import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PrestService } from '../shared/services/prest.service';
import { SessionStorageService } from '../shared/services/storage.service';
import { procPrestService } from '../shared/services/proc-prest.service';



@Component({
  selector: 'app-prest',
  templateUrl: './prest.component.html',
  styleUrl: './prest.component.css',
  providers: [PoDialogService]
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
    { property: 'ErrorSequence',    label: 'SEQ.',           type: 'string', width: '5%'},
    { property: 'ErrorNumber',      label: 'NUM.ERRO',       type: 'string', width: '5%'},
    { property: 'ErrorType',        label: 'TIPO',           type: 'string', width: '7%'},
    { property: 'ErrorDescription', label: 'DESCRICAO ERRO', type: 'string', width: '50%'},
    
  ]

  escondeTimer = true;
  itens: any = []  //tableData
  itensErro: any = []
  
  temRateio: any;
  temErro: any;

  retornoProc: any
  selecao: Array<any> = []
  itensSelecionados: Array<any> = [] 
  
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
              private storageService: SessionStorageService, 
              private poDialog: PoDialogService,
              private poNotification: PoNotificationService,
              private router: Router)
               {}
 
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
        this.itensErro = result.Erros
        this.storageService.setDados('ErrosPrest', this.itensErro)
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
  
  processaPrest(): void {
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
      sessionStorage.setItem('rowidPrest', item.rowid) 
      this.procServ.getProc(item.rowid).subscribe({
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