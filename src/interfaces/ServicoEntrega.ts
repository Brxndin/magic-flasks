import { Pedido } from '../components/Pedido';

export interface ServicoEntrega {
    despachar(pedido: Pedido): void;
}
