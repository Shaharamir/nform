import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FlatteningExample } from './flattening.component';

@NgModule({
    declarations: [FlatteningExample],
    imports: [
        ExampleCommonModule,
        PblNFormModule,
    ],
    exports: [FlatteningExample]
})
@BindNgModule(FlatteningExample)
export class FlatteningExampleModule { }
