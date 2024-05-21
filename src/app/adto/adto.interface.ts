export interface Adiantamento
 {
    codigo_documento: string;
	tipo: string;
    cpf_cnpj: string;                       
	data_emissao: string;
    data_vencimento: string;
    valor_documento: number;
	observacao: string;
    cod_forma_pagto: string;
    conta_contabil: string;
	natureza: string;	
    centro_custo: string;
    banco_transf: string;
    agencia_transf: string;
	cta_corrente_transf: string;
}

export interface adtoAPI { //RootObject
	hasNext: boolean;
	items: Adiantamento[];
}

