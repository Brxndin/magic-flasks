import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';

export class PagamentoCartaoCreditoStrategy implements PagamentoStrategy {
    public processar(valor: number): string {
        const novoValor = valor + (valor * 0.025);

        return `Valor a ser pago (2,5% de taxa): R$ ${novoValor.toFixed(2)}.`;
    }
}
