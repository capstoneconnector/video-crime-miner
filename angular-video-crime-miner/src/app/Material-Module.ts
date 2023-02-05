
import { NgModule } from "@angular/core";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    exports:[
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule
    ]

})
export class MaterialModule{

}
