export interface PagamentoStrategy {
    processar(valor: number): boolean
}
