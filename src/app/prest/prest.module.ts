import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestRoutingModule } from './prest-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PrestService } from '../shared/services/prest.service';
import { RateioComponent } from './rateio/rateio.component';
import { procPrestService } from '../shared/services/proc-prest.service';


@NgModule({
  declarations: [RateioComponent],
  imports: [
    CommonModule,
    PrestRoutingModule,
    SharedModule,
    FormsModule    
  ],
  providers: [PrestService, procPrestService]
})
export class PrestModule { }
