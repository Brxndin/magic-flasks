import { PagamentoStrategy } from '../../interfaces/PagamentoStrategy';

export class PagamentoPIXStrategy implements PagamentoStrategy {
    public processar(valor: number): string {
        return `Valor a ser pago: R$ ${valor.toFixed(2)}. Chave PIX gerada: 12345678-abcd-1234-abcd-123456789abc.`;
    }
}
