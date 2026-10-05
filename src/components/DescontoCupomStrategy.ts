import { DescontoStrategy } from "../interfaces/DescontoStrategy";
import { Pedido } from "./Pedido";

export class DescontoCupomStrategy implements DescontoStrategy {
    calcular(pedido: Pedido): number {
        const preco = pedido.pocao.getPreco();

        if (pedido.cupom) {
            return preco * pedido.cupom.fatorMultiplicador;
        }

        return 0;
    }
}
