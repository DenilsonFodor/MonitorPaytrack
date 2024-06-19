import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
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
    { property: 'ErrorSequence',    label: 'SEQ.',           type: 'string', width: '5%'},
    { property: 'ErrorNumber',      label: 'NUM.ERRO',       type: 'string', width: '5%'},
    { property: 'ErrorType',        label: 'TIPO',           type: 'string', width: '7%'},
    { property: 'ErrorDescription', label: 'DESCRICAO ERRO', type: 'string', width: '50%'},
  ]

 
  itens: any = []  //tableData
  itensErro: any
  escondeTimer = true;

  retornoProc: any
  selecao: Array<any> = []
  itensSelecionados: Array<any> = [] 

  obs$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  
  constructor(private service: adtoService,
              private adtoServ: procAdtoService,
              private storageService: SessionStorageService, 
              private poDialog: PoDialogService,
              private poNotification: PoNotificationService,
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
        this.itensErro = result.Erros
        this.storageService.setDados('ErrosAdto', this.itensErro)
      },
      error:erro => {
        this.escondeTimer = true
        console.log(erro)
      },
    }) 
  }

  selecaoReprocesso(event:any, type:any): void {
    if (type == 'new') {
      if (event.situacao =='Erro') {
        this.itensSelecionados = [
          ...this.itensSelecionados,
          {rowid:event.rowid},
        ]
      }
      else {
        this.poNotification.error('Situação invalida !!!')
      }  
    } 
    else {
      if (this.itensSelecionados.length > 0) {
        this.itensSelecionados = this.itensSelecionados.filter(
          itensSelecionados => itensSelecionados.rowid != event.rowid)
      }
    }
  }

  processaAdto(): void {
    this.poDialog.confirm({
      title: 'Reprocessamento',
      message: `Voce tem ${this.itensSelecionados.length} registros para reprocessamento, deseja continuar?`,
      confirm: () => this.reprocessa(this.itensSelecionados),
      cancel: () => {}
    });
  }

  reprocessa(regSelec: Array<any>) {
    regSelec.forEach(item => {
      this.escondeTimer = false
      sessionStorage.setItem('rowidAdto', item.rowid) 
      this.adtoServ.getProc(item.rowid).subscribe({
        next:result => {
          this.escondeTimer = true
          this.retornoProc = result.sucesso
          console.log(result.sucesso)
          //this.storageService.setDados('Reprocesso', this.retornoProc)
          if (this.retornoProc = 'no') {
            this.poNotification.error(`${item.rowid} erro no processamento`)
          }
          else {
            this.poNotification.success(`${item.rowid} processado com sucesso`)
          }  
        },
        error:erro => {
          this.escondeTimer = true
          this.poNotification.error(`${item.rowid} erro no processamento`)
        },
      }) 
        
      
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


