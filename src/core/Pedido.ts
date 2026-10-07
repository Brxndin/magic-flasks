import { Cupom } from '../interfaces/Cupom';
import { DescontoStrategy } from '../interfaces/DescontoStrategy';
import { PagamentoStrategy } from '../interfaces/PagamentoStrategy';
import { Produto } from '../interfaces/Produto';

export class Pedido {
    public id: number;
    public produto: Produto;
    public destinatario: string;
    public pagamentoStrategy: PagamentoStrategy;
    public descontoStrategy: DescontoStrategy;
    public cupom: Cupom | null = null;

    constructor(id: number, produto: Produto, destinatario: string, pagamentoStrategy: PagamentoStrategy, descontoStrategy: DescontoStrategy) {
        this.id = id;
        this.produto = produto;
        this.destinatario = destinatario;
        this.pagamentoStrategy = pagamentoStrategy;
        this.descontoStrategy = descontoStrategy;
    }

    setCupom(cupom: Cupom) {
        this.cupom = cupom;
    }
}
