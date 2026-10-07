import { PagamentoStrategy } from '../../interfaces/PagamentoStrategy';

export class PagamentoDinheiroStrategy implements PagamentoStrategy {
    public processar(valor: number): string {
        return `Valor a ser pago: R$ ${valor.toFixed(2)}.`;
    }
}
