import { Pedido } from '../core/Pedido';

export interface ServicoEntrega {
    despachar(pedido: Pedido): void;
}
