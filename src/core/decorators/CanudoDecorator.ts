import { CatalogoRepository } from '../../repositories/CatalogoRepository';
import { UtensilioDecorator } from './base/UtensilioDecorator';

export class CanudoDecorator extends UtensilioDecorator {
    getPreco(): number {
        const catalogoRepository = CatalogoRepository.getInstancia();
        const utensilio = catalogoRepository.getUtensilio('canudo');

        if (utensilio) {
            return super.getPreco() + utensilio.preco;
        }

        return super.getPreco();
    }

    getDescricao(): string {
        const catalogoRepository = CatalogoRepository.getInstancia();
        const utensilio = catalogoRepository.getUtensilio('canudo');

        if (utensilio) {
            return `${super.getDescricao()} + ${utensilio.nome}`;
        }

        return super.getDescricao();
    }
}
