import { useRef, useState } from 'preact/hooks';

import { CanudoDecorator } from './core/decorators/CanudoDecorator';
import { DescontoCupomStrategy } from './core/strategies/DescontoCupomStrategy';
import { EmbalagemDecorator } from './core/decorators/EmbalagemDecorator';
import { EntregaDuendeAdapter } from './core/adapters/EntregaDuendeAdapter';
import { Pedido } from './core/Pedido';
import { PocaoBuilder } from './core/builders/PocaoBuilder';
import { Produto } from './interfaces/Produto';
import { CATALOGO, CatalogoRepository } from './repositories/CatalogoRepository';
import { FilaPedidos } from './services/FilaPedidos';

export function App() {
    const idCounter = useRef(0);
    const [falaDoDuende, setFalaDoDuende] = useState('');
    const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);
    const [pedidosPagos, setPedidosPagos] = useState<Pedido[]>([]);
    const [pedidosProntos, setPedidosProntos] = useState<Pedido[]>([]);

    // uso do singleton pra fila de pedidos
    const filaPedidos = FilaPedidos.getInstancia();
    const catalogo = CatalogoRepository.getInstancia();

    function pedir(event: Event) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        const liquidoId = formData.get('liquido') as string;
        const edulcoranteId = formData.get('edulcorante') as string;
        const recipienteId = formData.get('recipiente') as string;

        const liquido = catalogo.getLiquido(liquidoId);
        const edulcorante = catalogo.getEdulcorante(edulcoranteId);
        const recipiente = catalogo.getRecipiente(recipienteId);

        if (!liquido || !edulcorante || !recipiente) {
            alert('É preciso selecionar os ingredientes principais!');

            return;
        }

        const pagamentoId = formData.get('pagamento') as string;
        const pagamento = catalogo.getPagamento(pagamentoId);

        if (!pagamento) {
            alert('É preciso selecionar uma forma de pagamento!');

            return;
        }

        // uso do builder pra montar a poção
        const pocaoBuilder = new PocaoBuilder(liquido, edulcorante, recipiente);

        const adicionais = formData.getAll('adicional') as string[];

        adicionais.forEach((adicionalId) => {
            const adicional = catalogo.getAdicional(adicionalId);

            if (adicional) {
                pocaoBuilder.comAdicional(adicional);
            }
        });

        let pocao: Produto = pocaoBuilder.montar();

        // uso do decorator para utensílios extras
        const utensilios = formData.getAll('utensilio') as string[];

        if (utensilios.includes('canudo')) {
            pocao = new CanudoDecorator(pocao);
        }

        if (utensilios.includes('embalagem')) {
            pocao = new EmbalagemDecorator(pocao);
        }

        const nomeCliente = formData.get('nome_cliente') as string;
        const cupomId = formData.get('cupom') as string;
        const cupom = catalogo.getCupom(cupomId);

        idCounter.current += 1;

        // uso do strategy para o pedido, forma de pagamento e desconto
        const pedido = new Pedido(idCounter.current, pocao, nomeCliente, pagamento.strategy, new DescontoCupomStrategy());

        if (cupom) {
            pedido.setCupom(cupom);
        }

        filaPedidos.adicionaPedidoPendente(pedido);

        setPedidosPendentes([...filaPedidos.getPedidosPendentes()]);

        // limpa o formulário após o envio
        (event.target as HTMLFormElement).reset();
    }

    function pagar() {
        const pedido = filaPedidos.retiraPedidoPendente();

        setPedidosPendentes([...filaPedidos.getPedidosPendentes()]);

        if (pedido) {
            filaPedidos.adicionaPedidoPago(pedido);

            setPedidosPagos([...filaPedidos.getPedidosPagos()]);
        }
    }

    function preparar() {
        const pedido = filaPedidos.retiraPedidoPago();

        setPedidosPagos([...filaPedidos.getPedidosPagos()]);

        if (pedido) {
            filaPedidos.adicionaPedidoPronto(pedido);

            setPedidosProntos([...filaPedidos.getPedidosProntos()]);
        }
    }

    function entregar() {
        const pedido = filaPedidos.retiraPedidoPronto();

        setPedidosProntos([...filaPedidos.getPedidosProntos()]);

        if (pedido) {
            // uso do adapter para sistema externo de entregas
            const sistemaEntrega = new EntregaDuendeAdapter();

            const informacoes = sistemaEntrega.despachar(pedido);

            setFalaDoDuende(informacoes);
        } else {
            setFalaDoDuende('');
        }
    }

    return (
        <>
            <h1 id="titulo-principal">MAGIC FLASKS</h1>
            <h2 id="subtitulo-principal">Tire um tempo pra se curar</h2>
            <div id="tela">
                <div id="cliente">
                    <h1>Cliente</h1>

                    <form onSubmit={pedir}>
                        <h2>Seus Dados</h2>
                        <div>
                            <label>
                                Nome:
                                <input name="nome_cliente" type="text" placeholder="Informe seu nome" required />
                            </label>
                        </div>

                        <h2>Pedido</h2>
                        <div>
                            <h3>Ingredientes Principais:</h3>
                            <div>
                                <label for="liquido">Líquido:</label>
                                <select name="liquido" id="liquido" required>
                                    <option value="">Selecione</option>
                                    {CATALOGO.liquidos.map((liquido) => (
                                        <option key={liquido.id} value={liquido.id}>
                                            {liquido.nome} - R$ {liquido.preco.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label for="edulcorante">Edulcorante:</label>
                                <select name="edulcorante" id="edulcorante" required>
                                    <option value="">Selecione</option>
                                    {CATALOGO.edulcorantes.map((edulcorante) => (
                                        <option key={edulcorante.id} value={edulcorante.id}>
                                            {edulcorante.nome} - R$ {edulcorante.preco.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label for="recipiente">Recipiente:</label>
                                <select name="recipiente" id="recipiente" required>
                                    <option value="">Selecione</option>
                                    {CATALOGO.recipientes.map((recipiente) => (
                                        <option key={recipiente.id} value={recipiente.id}>
                                            {recipiente.nome} ({recipiente.quantidadeMl}ml) - {recipiente.fatorMultiplicador * 100}% do valor
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p>Obs: a taxa do recipiente é aplicada apenas sobre os valores dos ingredientes principais + adicionais.</p>
                        </div>

                        <div>
                            <h3>Adicionais:</h3>
                            {CATALOGO.adicionais.map((adicional) => (
                                <label key={adicional.id}>
                                    <input name="adicional" value={adicional.id} type="checkbox" />
                                    {adicional.nome} - R$ {adicional.preco.toFixed(2)}
                                </label>
                            ))}
                        </div>

                        <div>
                            <h3>Utensílios:</h3>
                            {CATALOGO.utensilios.map((utensilio) => (
                                <label key={utensilio.id}>
                                    <input name="utensilio" value={utensilio.id} type="checkbox" />
                                    {utensilio.nome} - R$ {utensilio.preco.toFixed(2)}
                                </label>
                            ))}
                            <p>Obs: o valor dos utensílios é calculado separado da poção.</p>
                        </div>

                        <div>
                            <h3>Forma de Pagamento:</h3>
                            {CATALOGO.pagamentos.map((pagamento) => (
                                <label key={pagamento.id}>
                                    <input name="pagamento" type="radio" value={pagamento.id} required />
                                    {pagamento.nome}
                                </label>
                            ))}
                            <p>Obs: ao pagar com cartão, é cobrada uma taxa de 2,5% sobre o valor final já com desconto.</p>
                        </div>

                        <div>
                            <h3>Cupom de Desconto:</h3>
                            <label for="cupom">Cupom:</label>
                            <input name="cupom" id="cupom" type="text" placeholder="Informe o cupom" />
                            <p>Obs: o desconto aplicado é feito sobre o valor dos ingredientes principais + adicionais + utensílios.</p>
                        </div>

                        <button type="submit">Pedir</button>
                    </form>

                    <h2>Pedidos para Pagar</h2>
                    <div>
                        {pedidosPendentes.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Valor Original</th>
                                        <th>Desconto</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPendentes.map((pedido) => {
                                        return (
                                            <tr>
                                                <td>{pedido.produto.getDescricao()}</td>
                                                <td>R$ {pedido.produto.getPreco().toFixed(2)}</td>
                                                <td>R$ {pedido.descontoStrategy.calcular(pedido).toFixed(2)}</td>
                                                <td>{pedido.pagamentoStrategy.processar(pedido.produto.getPreco())}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>Não há pedidos pendentes!</p>
                        )}
                        <button onClick={pagar}>Pagar o Próximo</button>
                    </div>
                </div>

                <div id="funcionario">
                    <h1>Funcionários</h1>

                    <h2>Feiticeiro</h2>
                    <div>
                        <h3>Pedidos para Preparo</h3>
                        {pedidosPagos.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Pedido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPagos.map((pedido) => {
                                        return (
                                            <tr>
                                                <td>{pedido.id}</td>
                                                <td>{pedido.produto.getDescricao()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>Não há pedidos pagos!</p>
                        )}
                        <button onClick={preparar}>Preparar o Próximo</button>
                    </div>

                    <h2>Duende</h2>
                    <div>
                        <h3>Pedidos para Entrega</h3>
                        {pedidosProntos.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Destinatário</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosProntos.map((pedido) => {
                                        return (
                                            <tr>
                                                <td>{pedido.id}</td>
                                                <td>{pedido.destinatario}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>Não há pedidos prontos!</p>
                        )}
                        {falaDoDuende && <p>Duende: {falaDoDuende}</p>}
                        <button onClick={entregar}>Entregar o Próximo</button>
                    </div>
                </div>
            </div>
        </>
    );
}
