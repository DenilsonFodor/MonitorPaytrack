import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule} from "./app.routes";
import { PoTemplatesModule } from "@po-ui/ng-templates";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PoModule } from "@po-ui/ng-components";
import { APP_BASE_HREF } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AdtoComponent } from "./adto/adto.component";
import { PrestComponent } from "./prest/prest.component";
import { SharedModule } from "./shared/shared.module";

@NgModule({
    declarations: [
      AppComponent, 
      HomeComponent,
      AdtoComponent,
      PrestComponent, 
    ],
    imports: [
      PoModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      PoTemplatesModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forRoot([]),
    ],
    providers: [{
      provide: APP_BASE_HREF,
      useValue: window.location.pathname,
    },
  
  ],
    bootstrap: [AppComponent]
  })
  export class AppModule { }