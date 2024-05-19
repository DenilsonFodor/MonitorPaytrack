import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdtoRoutingModule } from './adto-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdtoRoutingModule,
    SharedModule,
    FormsModule
  ]
})

export class AdtoModule { }
