import { EntregasDuendesLTDA, Pacote } from '../external/EntregasDuendesLTDA';
import { ServicoEntrega } from '../interfaces/ServicoEntrega';
import { Pedido } from './Pedido';

export class EntregaDuendeAdapter implements ServicoEntrega {
    private sistemaDuendes = new EntregasDuendesLTDA();

    despachar(pedido: Pedido): string {
        // faz a adaptação do pedido para o formato esperado na biblioteca externa
        const pacote: Pacote = {
            codigo: `POC-${pedido.id}`,
            destinatario: pedido.destinatario,
            conteudo: pedido.produto.getDescricao(),
            fragil: true,
        };

        return this.sistemaDuendes.entregar(pacote);
    }
}
