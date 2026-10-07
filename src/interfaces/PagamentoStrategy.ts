export interface PagamentoStrategy {
    processar(valor: number): string;
}
