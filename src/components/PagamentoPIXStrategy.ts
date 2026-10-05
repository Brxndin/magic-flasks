import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';

export class PagamentoPixStrategy implements PagamentoStrategy {
    public processar(valor: number): boolean {
        console.log(`Valor a ser pago: ${valor.toFixed(2)}.`);
        console.log(`Chave PIX gerada: (54) 99999-9999.`);

        return true;
    }
}
