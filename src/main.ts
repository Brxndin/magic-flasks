import { PocaoBuilder } from './components/PocaoBuilder';
import { CatalogoRepository } from './repositories/CatalogoRepository';

const botaoPedir = document.querySelector('#pedir');

if (botaoPedir) {
    botaoPedir.addEventListener('click', () => {
        const catalogoRepository = new CatalogoRepository();

        const liquidoId = (document.querySelector('#liquido') as HTMLSelectElement)?.value;
        const edulcoranteId = (document.querySelector('#edulcorante') as HTMLSelectElement)?.value;
        const recipienteId = (document.querySelector('#recipiente') as HTMLSelectElement)?.value;

        const liquido = catalogoRepository.getLiquido(liquidoId);
        const edulcorante = catalogoRepository.getEdulcorante(edulcoranteId);
        const recipiente = catalogoRepository.getRecipiente(recipienteId);

        if (!liquido || !edulcorante || !recipiente) {
            alert('É preciso selecionar os ingredientes principais!');

            return;
        } else {
            const pocaoBuilder = new PocaoBuilder(liquido, edulcorante, recipiente);

            const adicionais = document.querySelectorAll<HTMLInputElement>('input[name="adicional"]:checked');

            adicionais.forEach((checkbox) => {
                const adicional = catalogoRepository.getAdicional(checkbox?.value);

                if (adicional) {
                    pocaoBuilder.comAdicional(adicional);
                }
            });

            const pocao = pocaoBuilder.montar();

            console.log(pocao.getDescricao());
        }
    });
}
