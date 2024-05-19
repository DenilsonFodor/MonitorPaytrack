export interface Prestacao {
    codigo_documento: string;
	tipo: string;
    cpf_cnpj: string;                       
	data_emissao: string;
    data_vencimento: string;
    valor_documento: number;
	observacao: string;
    conta_contabil: string;
	natureza: string;	
    centro_custo: string;
    rateio_centro_custo: string;
    rateio_cc: string;
	
}

export interface prestAPI { //RootObject
	hasNext: boolean;
	items: Prestacao[];
}