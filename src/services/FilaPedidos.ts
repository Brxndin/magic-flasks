import { Pedido } from '../components/Pedido';

export class FilaPedidos {
    private static instancia: FilaPedidos | null;

    private pedidos: Pedido[] = [];

    private constructor() {}

    static getInstancia(): FilaPedidos {
        if (!FilaPedidos.instancia) {
            FilaPedidos.instancia = new FilaPedidos();
        }

        return FilaPedidos.instancia;
    }

    getAllPedidos() {
        return this.pedidos;
    }

    adicionaPedido(pedido: Pedido) {
        this.pedidos.push(pedido);
    }

    retiraProximoPedido(): Pedido | null {
        if (this.pedidos.length > 0) {
            return this.pedidos.shift() ?? null;
        }

        return null;
    }
}
