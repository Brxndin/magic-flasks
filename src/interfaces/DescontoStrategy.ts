import { Pedido } from '../core/Pedido';

export interface DescontoStrategy {
    calcular(pedido: Pedido): number;
}
