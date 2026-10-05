import { Cupom } from '../interfaces/Cupom';
import { Pocao } from './Pocao';

export class Pedido {
    public id: number;
    public pocao: Pocao;
    public destinatario: string;
    public cupom: Cupom | null = null;

    constructor(id: number, pocao: Pocao, destinatario: string) {
        this.id = id;
        this.pocao = pocao;
        this.destinatario = destinatario;
    }

    setCupom(cupom: Cupom) {
        this.cupom = cupom;
    }
}
