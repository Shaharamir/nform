import * as Path from 'path';
import { Compiler, Configuration, DefinePlugin, debug } from 'webpack';
import * as simplegit from 'simple-git/promise';

import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { MarkdownPagesWebpackPlugin } from '@pebula-internal/webpack-markdown-pages';
import { SsrAndSeoWebpackPlugin } from '@pebula-internal/webpack-ssr-and-seo';
import { MarkdownAppSearchWebpackPlugin } from '@pebula-internal/webpack-markdown-app-search';
import { MarkdownCodeExamplesWebpackPlugin } from '@pebula-internal/webpack-markdown-code-examples';

import * as remarkPlugins from './build/remark';

// ** CONFIG VALUES **
function applyLoaders(webpackConfig: Configuration) {
  // We have custom loaders, for webpack to be aware of them we tell it the directory the are in.
  // make sure that each folder behaves like a node module, that is it has an index file inside root or a package.json pointing to it.
  // the default lib generation of nx and angular/cli does not do that.
  webpackConfig.resolveLoader.modules ? webpackConfig.resolveLoader.modules.push('libs-internal') : ['libs-internal'];


  // We push new loader rules to handle the scenarios
  // we also add a loader to handle markdown files.
  webpackConfig.module.rules.push(
    {
      test: [ /\.html$/ ],
      rules: [
        {
          use: [
            'html-loader',
          ]
        },
      ]
    },
  );
}

function updateWebpackConfig(webpackConfig: Configuration): Configuration {
  applyLoaders(webpackConfig);

  // push the new plugin AFTER the angular compiler plugin
  const { AngularWebpackPlugin } = require('@ngtools/webpack');

  let plugins = webpackConfig.plugins.filter( p => {
    if(p.constructor.name === 'AngularWebpackPlugin')
      return p;
    // return p instanceof AngularWebpackPlugin;
   } );
  if (plugins.length > 0) {
    const oldOptions = (plugins[1] as any).options;
    oldOptions.directTemplateLoading = false;
    plugins[1] = new AngularWebpackPlugin(oldOptions);
  } else {
    throw new Error('Invalid webpack configuration, could not find "AngularCompilerPlugin" or "AngularWebpackPlugin" in the plugins registered');
  }

  const remarkSlug = require('remark-slug')
  const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');
  const remarkAttr = require('remark-attr')
  const customBlockquotesOptions = { mapping: {
    'i>': 'info',
    'I>': 'info icon',
    'w>': 'warn',
    'W>': 'warn icon',
    'e>': 'error',
    'E>': 'error icon',
  }};

  const NFORMS_CONTENT_MAPPING_FILE = 'nforms-content-mapping.json';
  webpackConfig.plugins.push(new PebulaDynamicDictionaryWebpackPlugin(NFORMS_CONTENT_MAPPING_FILE));

  webpackConfig.plugins.push(new MarkdownPagesWebpackPlugin({
    context: __dirname,
    docsPath: '**/*.md',
    docsRoot: './content',
    outputAssetPathRoot: 'md-content',
    remarkPlugins: [
      remarkSlug,
      remarkAutolinkHeadings,
      [remarkAttr, { scope: 'permissive' }],
      remarkPlugins.gatsbyRemarkPrismJs(),
      [remarkPlugins.customBlockquotes, customBlockquotesOptions],
    ],
  }));

  webpackConfig.plugins.push(new SsrAndSeoWebpackPlugin({
    ssrPagesFilename: 'ssr-pages.json',
    sitemap: {
      basePath: 'https://shlomiassaf.github.io/nform',
    },
  }));

  webpackConfig.plugins.push(new MarkdownAppSearchWebpackPlugin({ }));

  webpackConfig.plugins.push(new MarkdownCodeExamplesWebpackPlugin({
    context: __dirname,
    docsPath: './content/**/*.ts',
  }));

  const angular = require('@angular/core/package.json');
  const cdk = require('@angular/cdk/package.json');
  const nform = require(Path.join(process.cwd(), `libs/nform/package.json`));

  const fn = async () => {
    const format =  {
      short_hash: '%h',
      hash: '%H',
      date: '%ai',
      message: '%s',
      refs: '%D',
      body: '%b',
      author_name: '%aN',
      author_email: '%ae'
    };
    const gitInfo = await simplegit().log({ n: "1", format});
    return {
      NFORMS_CONTENT_MAPPING_FILE: JSON.stringify(NFORMS_CONTENT_MAPPING_FILE),
      ANGULAR_VERSION: JSON.stringify(angular.version),
      CDK_VERSION: JSON.stringify(cdk.version),
      LIB_VERSION: JSON.stringify(nform.version),
      BUILD_VERSION: JSON.stringify(gitInfo.latest.short_hash),
    };

  };

  const definePlugin = new AsyncDefinePlugin(fn);
  webpackConfig.plugins.push(definePlugin);

  // webpackConfig.plugins.push(new debug.ProfilingPlugin({
  //     outputPath: Path.join(process.cwd(), 'webpack_profiling_events.json'),
  //   })
  // );

  return webpackConfig;
}

module.exports = updateWebpackConfig;

export class AsyncDefinePlugin {

  constructor(private asyncDef: () => Promise<any>) { }

  apply(compiler: Compiler) {
    let executeDefinePlugin = async () => {
      const definitions = await this.asyncDef();
      const definePlugin = new DefinePlugin(definitions);
      definePlugin.apply(compiler);
    };

    compiler.hooks.run.tapPromise('AsyncDefinePlugin', executeDefinePlugin);

    compiler.hooks.watchRun.tapPromise('AsyncDefinePlugin', async () => {
      if (executeDefinePlugin) {
        await executeDefinePlugin();
        executeDefinePlugin = undefined;
      }
    });
  }
}
