import { Adicional } from '../interfaces/Adicional';
import { Edulcorante } from '../interfaces/Edulcorante';
import { Liquido } from '../interfaces/Liquido';
import { Recipiente } from '../interfaces/Recipiente';
import { PocaoBuilder } from './PocaoBuilder';

export class Pocao {
    public readonly liquido: Liquido;
    public readonly edulcorante: Edulcorante;
    public readonly recipiente: Recipiente;
    public readonly adicionais: Adicional[];

    constructor(builder: PocaoBuilder) {
        this.liquido = builder.liquido;
        this.edulcorante = builder.edulcorante;
        this.recipiente = builder.recipiente;
        this.adicionais = builder.adicionais;
    }

    getPreco(): number {
        let preco = this.liquido.preco + this.edulcorante.preco;

        if (this.adicionais.length > 0) {
            for (const adicional of this.adicionais) {
                preco += adicional.preco;
            }
        }

        // aqui multiplica pela taxa pois o recipiente muda a quantidade em ml
        // essa taxa é aplicada tanto para o produto normal (líquido + edulcorante) quanto para adicionais
        return preco * this.recipiente.fatorMultiplicador;
    }

    getDescricao(): string {
        let produto = this.liquido.nome;

        if (this.adicionais.length > 0) {
            for (const adicional of this.adicionais) {
                produto = `${produto} + ${adicional.nome}`;
            }
        }

        return `${this.recipiente.nome} (${this.recipiente.quantidadeMl}ml) de ${produto}: R$ ${this.getPreco()}.`;
    }
}
