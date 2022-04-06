import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { TheRendererExample } from './the-renderer.component';

@NgModule({
    declarations: [TheRendererExample],
    imports: [
        ExampleCommonModule,
        PblNFormModule,
    ],
    exports: [TheRendererExample]
})
@BindNgModule(TheRendererExample)
export class TheRendererExampleModule { }
