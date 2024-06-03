import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Observable} from 'rxjs';
import { filter, pluck } from 'rxjs/operators';

import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { adtoService } from '../shared/services/adto.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-adto',
  templateUrl: './adto.component.html',
  styleUrl: './adto.component.css',
})

export class AdtoComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true}) poModal!: PoModalComponent;

  filterData: any = {
    dataEmissaoIni: new Date(),
    dataEmissaoDim: new Date(),
    codigoDocumentoIni: '',
    codigoDocumentoFim: 'ZZZZZZZZZZZZ',
    cpfCnpjIni: '',
    cpfCnpjFim: 'ZZZZZZZZZZZZ',
    page: 1,
    pageSize: 30,
    tipoDocumento: 'Adiantamento',
  };


  colunas: Array<PoTableColumn> = 
  [ {property: 'codigo_documento',    label: 'CODIGO',      type: 'string', width: '10%'},
    {property: 'tipo',                label: 'TIPO',        type: 'string', width: '10%'},
    {property: 'cpf_cnpj',            label: 'CPF/CNPJ',    type: 'string'},
    {property: 'data_emissao',        label: 'EMISSÃO',     type: 'date'  , width: '12%'},
    {property: 'data_vencimento',     label: 'VENCIMENTO',  type: 'date'  , width: '12%'},
    {property: 'valor_documento',     label: 'VALOR',       type: 'currency', format: 'BRL'},
    {property: 'observação',          label: 'OBSERVAÇÃO',  type: 'string'},
    {property: 'cod_forma_pagto',     label: 'FORMA PAGTO', type: 'string'},
    {property: 'conta_contabil',      label: 'CTA.CONTABIL',type: 'string'},
    {property: 'natureza',            label: 'NATUREZA',    type: 'string'},
    {property: 'centro_custo',        label: 'C.CUSTO',     type: 'string'},
    {property: 'banco_transf',        label: 'BANCO',       type: 'string'},
    {property: 'agencia_transf',      label: 'AGENCIA',     type: 'string'},
    {property: 'cta_corrente_transf', label: 'C.CORRENTE',  type: 'string'},
    {property: 'Unid_negocio',        label: 'UNID.NEGOCIO',type: 'string'},
  ];

 
  close: PoModalAction = {
    label: 'Cancela', action: () => {this.closeModal(); }
  };
  
  confirm: PoModalAction = {
     //label: 'Confirma', action: this.retornaDadosAdto.bind(this),
     label: 'Confirma', action: () => {this.onListaDados(); }
  };
  
  itens: any = []  //tableData

  obs$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  
  constructor(private service: adtoService, 
              private router: Router,
              private http: HttpClient) {}
 

  ngOnInit(): void {
    this.retornaDadosAdto();
  }

  closeModal() {
    this.poModal.close()
  }

  onListaDados() {
    this.filterData.page = 1;
    this.retornaDadosAdto();
  };
  
  retornaDadosAdto() {
    let obs$ = this.service.getAll(this.filterData);
    this.service.getAll(this.filterData).subscribe({
      next:result => {
        this.itens = result.items
      },
      error:erro => {
        console.log(erro)
      },
      complete:() => {
        this.closeModal();
      }
    })

    this.hasMore$ = obs$.pipe(pluck('hasNext'));

  }

  abrirModal() {
    this.poModal.open()
  }
}


