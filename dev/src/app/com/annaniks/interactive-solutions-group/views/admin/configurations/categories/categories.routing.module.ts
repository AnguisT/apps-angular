import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { CategoriesView } from './categories.view';


let categoriesRoutes:Routes = [
    { path:'',component:CategoriesView }
]

@NgModule({
    imports:[RouterModule.forChild(categoriesRoutes)],
    exports:[RouterModule],

})
export class CategoriesRoutingModule{}