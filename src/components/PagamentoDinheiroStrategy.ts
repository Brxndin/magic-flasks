import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';

export class PagamentoDinheiroStrategy implements PagamentoStrategy {
    public processar(valor: number): boolean {
        console.log(`Valor a ser pago: ${valor.toFixed(2)}.`);

        return true;
    }
}
