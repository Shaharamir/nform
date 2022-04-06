module.exports = {
  name: 'nform-demo-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/nform-demo-app',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
