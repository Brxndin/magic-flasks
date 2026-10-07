export interface Pacote {
    codigo: string;
    destinatario: string;
    conteudo: string;
    fragil: boolean;
}

export class EntregasDuendesLTDA {
    entregar(pacote: Pacote): string {
        let informacoes = `O Duende está levando o pacote ${pacote.codigo} para ${pacote.destinatario}.`;

        if (pacote.fragil) {
            informacoes = `${informacoes} Estamos usando plástico bolha para não estragar!`;
        }

        return informacoes;
    }
}
