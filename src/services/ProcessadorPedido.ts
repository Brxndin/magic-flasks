import { Pedido } from '../components/Pedido';
import { DescontoStrategy } from '../interfaces/DescontoStrategy';
import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';

export class ProcessadorPedido {
    private descontoStrategy: DescontoStrategy;
    private pagamentoStrategy: PagamentoStrategy;

    constructor(descontoStrategy: DescontoStrategy, pagamentoStrategy: PagamentoStrategy) {
        this.descontoStrategy = descontoStrategy;
        this.pagamentoStrategy = pagamentoStrategy;
    }

    public setDescontoStrategy(strategy: DescontoStrategy): void {
        this.descontoStrategy = strategy;
    }

    public setPagamentoStrategy(strategy: PagamentoStrategy): void {
        this.pagamentoStrategy = strategy;
    }

    public finalizarPedido(pedido: Pedido): void {
        const valor = pedido.pocao.getPreco();

        console.log(`==================================================`);

        console.log(`CHECKOUT`);
        console.log(`Pedido ${pedido.id} - ${pedido.pocao.getDescricao()}`);
        console.log(`Valor Original: R$ ${valor.toFixed(2)}`);

        const desconto = this.descontoStrategy.calcular(pedido);
        const valorComDesconto = valor - desconto;

        console.log(`Desconto Aplicado: R$ ${desconto.toFixed(2)}`);
        console.log(`Valor com Desconto: R$ ${valorComDesconto.toFixed(2)}`);

        const pagamentoSucesso = this.pagamentoStrategy.processar(valorComDesconto);

        // aqui talvez de pára aplicar o observer
        // if (pagamentoSucesso) {
        //     const msg = `Seu pedido ${pedido.id} foi pago com sucesso no valor final de R$ ${valorComDesconto.toFixed(2)}!`;
        // }

        console.log(`==================================================`);
    }
}
