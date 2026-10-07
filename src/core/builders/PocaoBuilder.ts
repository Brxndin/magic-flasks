import { Adicional } from '../../interfaces/Adicional';
import { Edulcorante } from '../../interfaces/Edulcorante';
import { Liquido } from '../../interfaces/Liquido';
import { Recipiente } from '../../interfaces/Recipiente';
import { Pocao } from '../Pocao';

export class PocaoBuilder {
    readonly liquido: Liquido;
    readonly edulcorante: Edulcorante;
    readonly recipiente: Recipiente;

    adicionais: Adicional[] = [];

    constructor(liquido: Liquido, edulcorante: Edulcorante, recipiente: Recipiente) {
        this.liquido = liquido;
        this.edulcorante = edulcorante;
        this.recipiente = recipiente;
    }

    comAdicional(adicional: Adicional): PocaoBuilder {
        this.adicionais.push(adicional);

        return this;
    }

    montar(): Pocao {
        return new Pocao(this);
    }
}
