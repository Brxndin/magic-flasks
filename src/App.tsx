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

    // uso do singleton pra fila de pedidos e catálogo
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
            <header className="header-container">
                <h1 className="main-title">MAGIC FLASKS</h1>
                <h2 className="main-subtitle">Tire um tempo pra se curar</h2>
            </header>

            <main className="app-grid">
                <section className="role-section">
                    <div className="role-header">
                        <h1>Cavaleiro</h1>
                        <span className="role-badge">Área do Cliente</span>
                    </div>

                    <form onSubmit={pedir} className="card-section">
                        <h2 className="section-title">Formular Poção</h2>

                        <div className="form-group">
                            <label htmlFor="nome_cliente">Nome do Aventureiro</label>
                            <input name="nome_cliente" id="nome_cliente" type="text" placeholder="Ex: Sir Lancelot" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="liquido">Base Líquida</label>
                            <select name="liquido" id="liquido" required>
                                <option value="">Selecione o líquido...</option>
                                {CATALOGO.liquidos.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nome} — R$ {item.preco.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edulcorante">Edulcorante</label>
                            <select name="edulcorante" id="edulcorante" required>
                                <option value="">Selecione o edulcorante...</option>
                                {CATALOGO.edulcorantes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nome} — R$ {item.preco.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="recipiente">Frasco / Recipiente</label>
                            <select name="recipiente" id="recipiente" required>
                                <option value="">Selecione o frasco...</option>
                                {CATALOGO.recipientes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nome} ({item.quantidadeMl}ml) — {item.fatorMultiplicador * 100}% do valor
                                    </option>
                                ))}
                            </select>
                            <p className="field-hint">* A taxa do recipiente incide apenas sobre os ingredientes principais + adicionais.</p>
                        </div>

                        <div className="form-group">
                            <label>Ervas & Adicionais</label>
                            <div className="options-grid">
                                {CATALOGO.adicionais.map((item) => (
                                    <label key={item.id} className="custom-option">
                                        <input name="adicional" value={item.id} type="checkbox" />
                                        <span>
                                            {' '}
                                            {item.nome} (+R$ {item.preco.toFixed(2)})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Utensílios Extra</label>
                            <div className="options-grid">
                                {CATALOGO.utensilios.map((item) => (
                                    <label key={item.id} className="custom-option">
                                        <input name="utensilio" value={item.id} type="checkbox" />
                                        <span>
                                            {' '}
                                            {item.nome} (+R$ {item.preco.toFixed(2)})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Pagamento</label>
                            <div className="options-grid">
                                {CATALOGO.pagamentos.map((item) => (
                                    <label key={item.id} className="custom-option">
                                        <input name="pagamento" type="radio" value={item.id} required />
                                        <span> {item.nome}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cupom">Pergaminho de Desconto (Cupom)</label>
                            <input name="cupom" id="cupom" type="text" placeholder="Digite as runas mágicas" />
                            <p className="field-hint">* O desconto incide sobre ingredientes principais + adicionais + utensílios.</p>
                        </div>

                        <button type="submit" className="btn-primary">
                            Pedir Poção
                        </button>
                    </form>

                    <div className="card-section">
                        <div className="section-title">
                            <h2>Caixa / Pedidos a Pagar</h2>
                            <button className="btn-action" onClick={pagar}>
                                Pagar Próximo
                            </button>
                        </div>

                        {pedidosPendentes.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Original</th>
                                            <th>Desconto</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosPendentes.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td>{pedido.produto.getDescricao()}</td>
                                                <td>R$ {pedido.produto.getPreco().toFixed(2)}</td>
                                                <td>R$ {pedido.descontoStrategy.calcular(pedido).toFixed(2)}</td>
                                                <td>{pedido.pagamentoStrategy.processar(pedido.produto.getPreco() - pedido.descontoStrategy.calcular(pedido))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="empty-state">Nenhum pedido aguardando pagamento.</p>
                        )}
                    </div>
                </section>

                <section className="role-section">
                    <div className="role-header">
                        <h1>Oficina Mágica</h1>
                        <span className="role-badge">Atendimento & Entrega</span>
                    </div>

                    <div className="card-section">
                        <div className="section-title">
                            <h2>Feiticeiro — Caldeirão</h2>
                            <button className="btn-action" onClick={preparar}>
                                Preparar Próximo
                            </button>
                        </div>

                        {pedidosPagos.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Poção a Preparar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosPagos.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td>#{pedido.id}</td>
                                                <td>{pedido.produto.getDescricao()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="empty-state">Nenhuma poção pendente no caldeirão.</p>
                        )}
                    </div>

                    <div className="card-section">
                        <div className="section-title">
                            <h2>Duendes — Entregas Expressas LTDA</h2>
                            <button className="btn-action" onClick={entregar}>
                                Despachar Próximo
                            </button>
                        </div>

                        {falaDoDuende && (
                            <div className="duende-speech">
                                <span>
                                    💬 <strong>Duende diz:</strong> "{falaDoDuende}"
                                </span>
                            </div>
                        )}

                        {pedidosProntos.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Destinatário</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosProntos.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td>{EntregaDuendeAdapter.geraCodigoEntrega(pedido)}</td>
                                                <td>{pedido.destinatario}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="empty-state">Nenhuma poção pronta para entrega.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
