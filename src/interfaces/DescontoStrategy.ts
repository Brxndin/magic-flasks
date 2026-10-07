import { Pedido } from '../components/Pedido';

export interface DescontoStrategy {
    calcular(pedido: Pedido): number;
}
