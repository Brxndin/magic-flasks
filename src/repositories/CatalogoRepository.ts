import { Adicional } from '../interfaces/Adicional';
import { Edulcorante } from '../interfaces/Edulcorante';
import { Liquido } from '../interfaces/Liquido';
import { Recipiente } from '../interfaces/Recipiente';

export const CATALOGO = {
    liquidos: [
        { id: 'lagrima_noiva', nome: 'Lágrima de Noiva', preco: 12 },
        { id: 'agua_eletrizada', nome: 'Água Eletrizada', preco: 13 },
        { id: 'nectar_viscoso', nome: 'Néctar de Fruta Viscosa', preco: 15.5 },
    ],
    edulcorantes: [
        { id: 'po_fada', nome: 'Pó de Fada', preco: 2.5 },
        { id: 'cristal_lunar', nome: 'Grãos de Cristal Lunar', preco: 2 },
        { id: 'mandragora', nome: 'Raíz de Mandragora Moída', preco: 3 },
    ],
    recipientes: [
        { id: 'redondo', nome: 'Frasco Redondo', quantidadeMl: 200, fatorMultiplicador: 1 },
        { id: 'triangular', nome: 'Frasco Triangular', quantidadeMl: 300, fatorMultiplicador: 1.5 },
        { id: 'quadrado', nome: 'Frasco Quadrado', quantidadeMl: 500, fatorMultiplicador: 2 },
    ],
    adicionais: [
        { id: 'bolhas', nome: 'Bolhas', preco: 2 },
        { id: 'fumaca', nome: 'Fumaça Colorida', preco: 1 },
        { id: 'gelo', nome: 'Gelo Seco de Cemitério', preco: 2 },
    ],
};

export class CatalogoRepository {
    private liquidos = new Map<string, Liquido>();
    private edulcorantes = new Map<string, Edulcorante>();
    private recipientes = new Map<string, Recipiente>();
    private adicionais = new Map<string, Adicional>();

    constructor() {
        // aqui ajuda a não fazer diversos for
        // é criado um novo objeto em que o id é o índice do objeto, então pega o certo direto
        CATALOGO.liquidos.forEach((i) => this.liquidos.set(i.id, i));
        CATALOGO.edulcorantes.forEach((i) => this.edulcorantes.set(i.id, i));
        CATALOGO.recipientes.forEach((i) => this.recipientes.set(i.id, i));
        CATALOGO.adicionais.forEach((i) => this.adicionais.set(i.id, i));
    }

    getLiquido(id: string): Liquido | undefined {
        return this.liquidos.get(id);
    }

    getEdulcorante(id: string): Edulcorante | undefined {
        return this.edulcorantes.get(id);
    }

    getRecipiente(id: string): Recipiente | undefined {
        return this.recipientes.get(id);
    }

    getAdicional(id: string): Adicional | undefined {
        return this.adicionais.get(id);
    }
}
