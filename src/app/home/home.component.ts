import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { HomeModule } from './home.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{

  menus: Array<PoMenuItem> = 
  [
    {label: 'Adiantamento',        
     //shortLabel: 'Adto', 
     //action: this.menuAction.bind(this),       ss
     
     link: './adto', 
     icon: 'po-icon-star',
     shortLabel: 'Adiantamento'},

    {label: 'Prestação de Contas', 
     //shortLabel: 'Prest',
     //action: this.menuAction.bind(this),  
     link: './prest', 
     icon: 'po-icon-money',
     shortLabel: 'Prestação de Contas'}
  ]
  
 
  menuItemSelected: string = ''

  constructor(private router: Router) {}

  ngOnInit(): void {}
    
 
  menuAction(menu: PoMenuItem) {
    this.menuItemSelected = menu.label;
    
  }


}
