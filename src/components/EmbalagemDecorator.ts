import { CatalogoRepository } from '../repositories/CatalogoRepository';
import { UtensilioDecorator } from './base/UtensilioDecorator';

export class EmbalagemDecorator extends UtensilioDecorator {
    getPreco(): number {
        const catalogoRepository = CatalogoRepository.getInstancia();
        const utensilio = catalogoRepository.getUtensilio('embalagem');

        if (utensilio) {
            return super.getPreco() + utensilio.preco;
        }

        return super.getPreco();
    }

    getDescricao(): string {
        const catalogoRepository = CatalogoRepository.getInstancia();
        const utensilio = catalogoRepository.getUtensilio('embalagem');

        if (utensilio) {
            return `${super.getDescricao()} + ${utensilio.nome}`;
        }

        return super.getDescricao();
    }
}
