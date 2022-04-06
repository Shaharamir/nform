import { NgModule } from '@angular/core';
import { PblNFormModule } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { ComplexDataStructuresExample } from './complex-data-structures.component';

@NgModule({
    declarations: [ComplexDataStructuresExample],
    imports: [
        ExampleCommonModule,
        PblNFormModule,
    ],
    exports: [ComplexDataStructuresExample]
})
@BindNgModule(ComplexDataStructuresExample)
export class ComplexDataStructuresExampleModule { }
