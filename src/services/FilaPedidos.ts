import { Pedido } from '../components/Pedido';

export class FilaPedidos {
    private static instancia: FilaPedidos | null;

    private pedidosPendentes: Pedido[] = [];
    private pedidosPagos: Pedido[] = [];
    private pedidosProntos: Pedido[] = [];

    private constructor() {}

    static getInstancia(): FilaPedidos {
        if (!FilaPedidos.instancia) {
            FilaPedidos.instancia = new FilaPedidos();
        }

        return FilaPedidos.instancia;
    }

    getPedidosPendentes() {
        return this.pedidosPendentes;
    }

    getPedidosPagos() {
        return this.pedidosPagos;
    }

    getPedidosProntos() {
        return this.pedidosProntos;
    }

    adicionaPedidoPendente(pedido: Pedido) {
        this.pedidosPendentes.push(pedido);
    }

    adicionaPedidoPago(pedido: Pedido) {
        this.pedidosPagos.push(pedido);
    }

    adicionaPedidoPronto(pedido: Pedido) {
        this.pedidosProntos.push(pedido);
    }

    private retiraProximoPedido(pedidos: Pedido[]): Pedido | null {
        if (pedidos.length > 0) {
            return pedidos.shift() ?? null;
        }

        return null;
    }

    retiraPedidoPendente(): Pedido | null {
        return this.retiraProximoPedido(this.pedidosPendentes);
    }

    retiraPedidoPago(): Pedido | null {
        return this.retiraProximoPedido(this.pedidosPagos);
    }

    retiraPedidoPronto(): Pedido | null {
        return this.retiraProximoPedido(this.pedidosProntos);
    }
}
