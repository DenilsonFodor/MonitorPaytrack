import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { PrestService } from '../shared/services/prest.service';
import { SessionStorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-prest',
  templateUrl: './prest.component.html',
  styleUrl: './prest.component.css',
})

export class PrestComponent implements OnInit {
   @ViewChild(PoModalComponent, { static: true}) poModal!: PoModalComponent;

   filterData: any = {
    dataEmissaoIni: new Date(),
    dataEmissaoDim: new Date(),
    codigoDocumentoIni: '',
    codigoDocumentoFim: 'ZZZZZZZZZZZZ',
    cpfCnpjIni: '',
    cpfCnpjFim: 'ZZZZZZZZZZZZ',
    page: 1,
    pageSize: 100,
    tipoDocumento: 'PrestacaoContas',
  };

  colunas: Array<PoTableColumn> = [ 
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

  acoes: PoTableAction[] =  [
    {label: '', icon: 'po-icon-news', action: this.rateio.bind(this)}
  ];

  close: PoModalAction = {
    label: 'Cancela', action: () => {this.closeModal()}
  };
  confirm: PoModalAction = {
     label: 'Confirma', action: () => {this.onListaDados()}
  };
  
  
  itens: any = []  //tableData
  
  //obs$!: Observable<boolean>;
  //hasMore$!: Observable<boolean>;
   
  temRateio: any;

  constructor(private service: PrestService,
              private storageService : SessionStorageService, 
              private router: Router) {}
 
  ngOnInit(): void {
    this.buscaDadosPrest();
    this.recupaDados();
  }

  closeModal() {
    this.poModal.close();
  }

  onListaDados() {
    this.filterData.page = 1;
    this.buscaDadosPrest();
  }
  
  buscaDadosPrest() {
    this.service.getAll(this.filterData).subscribe({
      next:result => {
        this.itens = result.items,
        this.storageService.setDados('DadosPrest', this.itens)
      },
      error:erro => {
        console.log(erro)
      },
      complete:() => {
        this.closeModal();
      }
    })
  }

  rateio(args: any) {
    this.temRateio = args['rateio_cc']
    if (this.temRateio === true) {
      console.log(args)
      sessionStorage.setItem('rowidPrest', args.rowid) 
      this.router.navigate(['./home/prest/rateio']);
    }
  }

  recupaDados() {
    const jsonData = this.storageService.getDados('DadosPrest')
    this.itens = jsonData
  }

  abrirModal() {
    this.poModal.open()
  }
  
}
