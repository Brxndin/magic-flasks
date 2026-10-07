import { Adicional } from '../interfaces/Adicional';
import { Edulcorante } from '../interfaces/Edulcorante';
import { Liquido } from '../interfaces/Liquido';
import { Produto } from '../interfaces/Produto';
import { Recipiente } from '../interfaces/Recipiente';
import { PocaoBuilder } from './builders/PocaoBuilder';

export class Pocao implements Produto {
    private liquido: Liquido;
    private edulcorante: Edulcorante;
    private recipiente: Recipiente;
    private adicionais: Adicional[];

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

        return `${this.recipiente.nome} (${this.recipiente.quantidadeMl}ml) de ${produto}`;
    }
}
