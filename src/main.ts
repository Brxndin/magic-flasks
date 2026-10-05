import { DescontoCupomStrategy } from './components/DescontoCupomStrategy';
import { Pedido } from './components/Pedido';
import { PocaoBuilder } from './components/PocaoBuilder';
import { CatalogoRepository } from './repositories/CatalogoRepository';
import { FilaPedidos } from './services/FilaPedidos';
import { ProcessadorPedido } from './services/ProcessadorPedido';

let id = 0;

function getNextId() {
    id += 1;

    return id;
}

const botaoPedir = document.querySelector('#pedir');

if (botaoPedir) {
    botaoPedir.addEventListener('click', () => {
        const catalogoRepository = CatalogoRepository.getInstancia();

        const liquidoId = (document.querySelector('#liquido') as HTMLSelectElement)?.value;
        const edulcoranteId = (document.querySelector('#edulcorante') as HTMLSelectElement)?.value;
        const recipienteId = (document.querySelector('#recipiente') as HTMLSelectElement)?.value;

        const liquido = catalogoRepository.getLiquido(liquidoId);
        const edulcorante = catalogoRepository.getEdulcorante(edulcoranteId);
        const recipiente = catalogoRepository.getRecipiente(recipienteId);

        if (!liquido || !edulcorante || !recipiente) {
            alert('É preciso selecionar os ingredientes principais!');

            return;
        }

        const pagamentoId = (document.querySelector('input[name="pagamento"]:checked') as HTMLInputElement)?.value;
        const pagamento = catalogoRepository.getPagamento(pagamentoId);

        if (!pagamento) {
            alert('É preciso selecionar uma forma de pagamento!');

            return;
        }

        // uso do builder pra montar a poção
        const pocaoBuilder = new PocaoBuilder(liquido, edulcorante, recipiente);

        const adicionais = document.querySelectorAll<HTMLInputElement>('input[name="adicional"]:checked');

        adicionais.forEach((checkbox) => {
            const adicional = catalogoRepository.getAdicional(checkbox?.value);

            if (adicional) {
                pocaoBuilder.comAdicional(adicional);
            }
        });

        const pocao = pocaoBuilder.montar();

        const nomeCliente = (document.querySelector('#nome_cliente') as HTMLInputElement)?.value;
        const cupomId = (document.querySelector('#cupom') as HTMLInputElement)?.value;

        const cupom = catalogoRepository.getCupom(cupomId);

        const pedido = new Pedido(getNextId(), pocao, nomeCliente);

        if (cupom) {
            pedido.setCupom(cupom);
        }

        // uso do singleton pra fila de pedidos
        const filaPedidos = FilaPedidos.getInstancia();

        filaPedidos.adicionaPedido(pedido);

        const allPedidos = filaPedidos.getAllPedidos();

        // uso do strategy para o pedido, forma de pagamento e desconto
        const descontoStrategy = new DescontoCupomStrategy();
        const pagamentoStrategy = pagamento.strategy;

        const processadorPedido = new ProcessadorPedido(descontoStrategy, pagamentoStrategy);

        // verificar: no momento, sempre que adiciona um pedido novo, ele usa o mesmo pagamentoStrategy para todos, ver como tornar dinâmico
        allPedidos.forEach((pedido) => {
            processadorPedido.finalizarPedido(pedido);
        });
    });
}
