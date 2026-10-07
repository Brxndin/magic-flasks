import { EntregasDuendesLTDA, Pacote } from '../../external/EntregasDuendesLTDA';
import { ServicoEntrega } from '../../interfaces/ServicoEntrega';
import { Pedido } from '../Pedido';

export class EntregaDuendeAdapter implements ServicoEntrega {
    private sistemaDuendes = new EntregasDuendesLTDA();

    static geraCodigoEntrega(pedido: Pedido): string {
        return `POC-DND-${pedido.id}`;
    }

    despachar(pedido: Pedido): string {
        // faz a adaptação do pedido para o formato esperado na biblioteca externa
        const pacote: Pacote = {
            codigo: EntregaDuendeAdapter.geraCodigoEntrega(pedido),
            destinatario: pedido.destinatario,
            conteudo: pedido.produto.getDescricao(),
            fragil: true,
        };

        return this.sistemaDuendes.entregar(pacote);
    }
}
