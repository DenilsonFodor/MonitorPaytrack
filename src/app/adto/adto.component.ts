import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { Observable} from 'rxjs';
import { pluck } from 'rxjs/operators';

import { adtoService } from '../shared/services/adto.service';
import { HttpClient } from '@angular/common/http';
import { procAdtoService } from '../shared/services/proc-adto.service';
import { SessionStorageService } from '../shared/services/storage.service';


@Component({
  selector: 'app-adto',
  templateUrl: './adto.component.html',
  styleUrl: './adto.component.css',
})

export class AdtoComponent implements OnInit {
  
  
  filterData: any = {
    dataEmissaoIni: new Date(),
    dataEmissaoDim: new Date(),
    codigoDocumentoIni: '',
    codigoDocumentoFim: 'ZZZZZZZZZZZZ',
    cpfCnpjIni: '',
    cpfCnpjFim: 'ZZZZZZZZZZZZ',
    page: 1,
    pageSize: 100,
    tipoDocumento: 'AN',
  };


  colunas: Array<PoTableColumn> = 
  [ {property: 'situacao',  label: 'SITUAÇÃO', type: 'string', width: '10%',
      labels: [
        { label: 'Pendente',   value: 'Pendente',   color: 'color-08' },
        { label: 'Erro',       value: 'Erro',       color: 'color-07' },
        { label: 'Processado', value: 'Processado', color: 'color-11' },
        { label: 'Concluido',  value: 'Concluido',  color: 'color-11' },
      ]},
    {property: 'cod_estab',           label: 'ESTABELEC.',  type: 'string', width: '5%'},
    {property: 'codigo_documento',    label: 'CODIGO',      type: 'string', width: '10%'},
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
    {property: 'unidade_negocio',     label: 'UNID.NEGOCIO',type: 'string'},
  ];

  colunasErro: Array<PoTableColumn> = [
    { property: 'referencia',          label: 'REFERENCIA',  type: 'string', width: '12%'},
    { property: 'cod_estab',           label: 'ESTABELEC',   type: 'string', width: '10%'},
    { property: 'codigo_documento',    label: 'CODIGO',      type: 'string', width: '12%'},
    { property: 'tipo',                label: 'TIPO',        type: 'string', width: '5%'},
    { property: 'cpf_cnpj',            label: 'CPF/CNPJ',    type: 'string', width: '12%'},
    { property: 'ErrorNumber',         label: 'NUM.ERRO',    type: 'string', width: '10%'},
    { property: 'ErrorDescription',    label: 'DESC.ERRO',   type: 'string', width: '30%'},
  ]

 
  itens: any = []  //tableData
  itensErro: any
  escondeTimer = true;

  obs$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  
  constructor(private service: adtoService,
              private adtoServ: procAdtoService,
              private storageService: SessionStorageService, 
              private router: Router) {}
 

  ngOnInit(): void {
    this.retornaDadosAdto();
  }

  onListaDados() {
    this.filterData.page = 1;
    this.retornaDadosAdto();
  };
  
  retornaDadosAdto() {
    this.escondeTimer = false
    let obs$ = this.service.getAll(this.filterData);
    this.service.getAll(this.filterData).subscribe({
      next:result => {
        this.escondeTimer = true
        this.itens = result.items
      },
      error:erro => {
        this.escondeTimer = true
        console.log(erro)
      },
 
    })
    this.hasMore$ = obs$.pipe(pluck('hasNext'));
  }

  BuscaErros(args: any) {
    this.escondeTimer = false
    sessionStorage.setItem('rowidAdto', args.rowid) 
    this.adtoServ.getErros(args.rowid).subscribe({
      next:result => {
        this.escondeTimer = true
        this.itensErro = result.items
        this.storageService.setDados('ErrosPrest', this.itensErro)
      },
      error:erro => {
        this.escondeTimer = true
        console.log(erro)
      },
    }) 
  }

  procAdto(args: any) {
  }

  validaSituacao() {
     return true
  }

  habilitaErro(row:any, index: number) {
    return row.situacao == 'Erro';
  }


}


