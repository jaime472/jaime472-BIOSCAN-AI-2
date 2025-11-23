export interface ExamItem {
  nomeExame: string;
  valorMedido: string;
  unidade: string;
  valorReferencia: string;
  status: 'NORMAL' | 'ALTERADO' | 'CRITICO' | 'DESCONHECIDO';
  significadoClinico: string;
  explicacaoDetalhada: string;
  recomendacaoGeral: string;
}

export interface AnalysisResponse {
  paciente?: string;
  dataExame?: string;
  resumoGeral: string;
  exames: ExamItem[];
}
