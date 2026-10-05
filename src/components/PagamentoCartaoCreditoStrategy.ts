import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';

export class PagamentoCartaoCreditoStrategy implements PagamentoStrategy {
    public processar(valor: number): boolean {
        const novoValor = valor + (valor * 0.025);

        console.log(`Valor a ser pago (2,5% de taxa): ${novoValor.toFixed(2)}.`);

        return true;
    }
}
