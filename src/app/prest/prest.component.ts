import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PrestService } from '../shared/services/prest.service';
import { SessionStorageService } from '../shared/services/storage.service';
import { procPrestService } from '../shared/services/proc-prest.service';

@Component({
  selector: 'app-prest',
  templateUrl: './prest.component.html',
  styleUrl: './prest.component.css'
})

export class PrestComponent implements OnInit {
  
   filterData: any = {
    dataEmissaoIni: new Date(),
    dataEmissaoDim: new Date(),
    codigoDocumentoIni: '',
    codigoDocumentoFim: 'ZZZZZZZZZZZZ',
    cpfCnpjIni: '',
    cpfCnpjFim: 'ZZZZZZZZZZZZ',
    page: 1,
    pageSize: 100,
    tipoDocumento: 'ACD',
  };

  colunas: Array<PoTableColumn> = [ 
    { property: 'situacao',  label: 'SITUAÇÃO', type: 'string', width: '10%',
      labels: [
        { label: 'Pendente',   value: 'Pendente',   color: 'color-08' },
        { label: 'Erro',       value: 'Erro',       color: 'color-07' },
        { label: 'Processado', value: 'Processado', color: 'color-11' },
        { label: 'Concluido',  value: 'Concluido',  color: 'color-11' },
      ]},
    { property: 'cod_estab',           label: 'ESTABELEC.',  type: 'string', width: '5%'},
    { property: 'codigo_documento',    label: 'CODIGO',      type: 'string', width: '10%'},
    { property: 'tipo',                label: 'TIPO',        type: 'string', width: '10%'},
    { property: 'cpf_cnpj',            label: 'CPF/CNPJ',    type: 'string'},
    { property: 'data_emissao',        label: 'EMISSÃO',     type: 'date'  , width: '12%'},
    { property: 'data_vencimento',     label: 'VENCIMENTO',  type: 'date'  , width: '12%'},
    { property: 'valor_documento',     label: 'VALOR',       type: 'currency', format: 'BRL'},
    { property: 'conta_contabil',      label: 'CTA.CONTABIL',type: 'string'},
    { property: 'natureza',            label: 'NATUREZA',    type: 'string'},
    { property: 'centro_custo',        label: 'C.CUSTO',     type: 'string'},
    { property: 'rateio_centro_custo', label: 'RATEIO',      type: 'string'},
    { property: 'rateio_cc',           label: 'RATEIO CC',   type: 'string'},
    { property: 'unid_negocio',        label: 'UNID.NEGOCIO',type: 'string'},
    { property: 'observação',          label: 'OBSERVAÇÃO',  type: 'string'},

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

  escondeTimer = true;
  itens: any = []  //tableData
  itensErro: any = []
  temRateio: any;
  temErro: any;
  
  //obs$!: Observable<boolean>;
  //hasMore$!: Observable<boolean>;
   


  maisOpcoes: Array<PoTableAction> = [
      { label: 'Rateio', 
        icon: 'po-icon-news', 
        action: this.rateio.bind(this)
      },
    ]

  constructor(private service: PrestService,
              private procServ: procPrestService,
              private storageService : SessionStorageService, 
              private router: Router) {}
 
  ngOnInit(): void {
    this.buscaDadosPrest();
    this.recupaDados();
  }

  onListaDados() {
    this.filterData.page = 1;
    this.buscaDadosPrest();
  }
  
  buscaDadosPrest() {
    this.escondeTimer = false
    this.service.getAll(this.filterData).subscribe({
      next:result => {
        this.escondeTimer = true
        this.itens = result.items,
        this.storageService.setDados('DadosPrest', this.itens)
      },
      error:erro => {
        this.escondeTimer = true
        console.log(erro)
      },
    })
  }

  rateio(args: any) {
    this.temRateio = args['rateio_cc']
    if (this.temRateio === true) {
      sessionStorage.setItem('rowidPrest', args.rowid) 
      this.router.navigate(['./home/prest/rateio']);
    }
  }
  
  BuscaErros(args: any) {
    this.escondeTimer = false
    sessionStorage.setItem('rowidPrest', args.rowid) 
    this.procServ.getErros(args.rowid).subscribe({
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
  
  procPrest(args: any) {
  }

  recupaDados() {
    const jsonData = this.storageService.getDados('DadosPrest')
    this.itens = jsonData
  }

  validaSituacao() {
    return true
  }

 habilitaErro(row:any, index: number) {
   return row.situacao == 'Erro';
  }

} 