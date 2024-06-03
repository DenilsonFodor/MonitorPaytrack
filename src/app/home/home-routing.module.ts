import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdtoModule } from '../adto/adto.module';
import { PrestModule } from '../prest/prest.module';

const routes: Routes = [
  { path: '' , pathMatch: 'full' , redirectTo:'home'},

  {   
    path: '', component: HomeComponent, children: [
      { path: 'adto', loadChildren: () => {return AdtoModule} },
      { path: 'prest', loadChildren: () => { return PrestModule} }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
