import { Produto } from '../../../interfaces/Produto';

export abstract class UtensilioDecorator implements Produto {
    protected produto: Produto;

    constructor(produto: Produto) {
        this.produto = produto;
    }

    getDescricao(): string {
        return this.produto.getDescricao();
    }

    getPreco(): number {
        return this.produto.getPreco();
    }
}
