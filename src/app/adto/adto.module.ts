import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdtoRoutingModule } from './adto-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { adtoService } from '../shared/services/adto.service';
import { procAdtoService } from '../shared/services/proc-adto.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdtoRoutingModule,
    SharedModule,
    FormsModule,
    
  ],
  providers: [adtoService, procAdtoService]
})

export class AdtoModule { }
