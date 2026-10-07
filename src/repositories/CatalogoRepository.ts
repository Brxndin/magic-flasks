import { PagamentoCartaoCreditoStrategy } from '../core/strategies/PagamentoCartaoCreditoStrategy';
import { PagamentoDinheiroStrategy } from '../core/strategies/PagamentoDinheiroStrategy';
import { PagamentoPIXStrategy } from '../core/strategies/PagamentoPIXStrategy';
import { Adicional } from '../interfaces/Adicional';
import { Cupom } from '../interfaces/Cupom';
import { Edulcorante } from '../interfaces/Edulcorante';
import { Liquido } from '../interfaces/Liquido';
import { Pagamento } from '../interfaces/Pagamento';
import { Recipiente } from '../interfaces/Recipiente';
import { Utensilio } from '../interfaces/Utensilio';

export const CATALOGO = {
    liquidos: [
        { id: 'lagrima_noiva', nome: 'Lágrima de Noiva', preco: 12 },
        { id: 'agua_eletrizada', nome: 'Água Eletrizada', preco: 13 },
        { id: 'nectar_viscoso', nome: 'Néctar de Fruta Viscosa', preco: 15.5 },
    ],
    edulcorantes: [
        { id: 'po_fada', nome: 'Pó de Fada', preco: 1.5 },
        { id: 'cristal_lunar', nome: 'Grãos de Cristal Lunar', preco: 1 },
        { id: 'mandragora', nome: 'Raíz de Mandragora Moída', preco: 1.7 },
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
    cupons: [
        { id: 'MAGIC10', fatorMultiplicador: 0.1 },
        { id: 'MAGIC15', fatorMultiplicador: 0.15 },
        { id: 'MAGIC20', fatorMultiplicador: 0.2 },
    ],
    utensilios: [
        { id: 'canudo', nome: 'Canudo Espiral', preco: 0.5 },
        { id: 'embalagem', nome: 'Embalagem', preco: 1 },
    ],
    pagamentos: [
        { id: 'cartao', nome: 'Cartão', strategy: new PagamentoCartaoCreditoStrategy() },
        { id: 'pix', nome: 'PIX', strategy: new PagamentoPIXStrategy() },
        { id: 'dinheiro', nome: 'Dinheiro', strategy: new PagamentoDinheiroStrategy() },
    ],
};

export class CatalogoRepository {
    private static instancia: CatalogoRepository | null;

    private liquidos = new Map<string, Liquido>();
    private edulcorantes = new Map<string, Edulcorante>();
    private recipientes = new Map<string, Recipiente>();
    private adicionais = new Map<string, Adicional>();
    private cupons = new Map<string, Cupom>();
    private utensilios = new Map<string, Utensilio>();
    private pagamentos = new Map<string, Pagamento>();

    private constructor() {
        // aqui ajuda a não fazer diversos for
        // é criado um novo objeto em que o id é o índice do objeto, então pega o certo direto
        CATALOGO.liquidos.forEach((i) => this.liquidos.set(i.id, i));
        CATALOGO.edulcorantes.forEach((i) => this.edulcorantes.set(i.id, i));
        CATALOGO.recipientes.forEach((i) => this.recipientes.set(i.id, i));
        CATALOGO.adicionais.forEach((i) => this.adicionais.set(i.id, i));
        CATALOGO.cupons.forEach((i) => this.cupons.set(i.id, i));
        CATALOGO.utensilios.forEach((i) => this.utensilios.set(i.id, i));
        CATALOGO.pagamentos.forEach((i) => this.pagamentos.set(i.id, i));
    }

    static getInstancia(): CatalogoRepository {
        if (!CatalogoRepository.instancia) {
            CatalogoRepository.instancia = new CatalogoRepository();
        }

        return CatalogoRepository.instancia;
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

    getCupom(id: string): Cupom | undefined {
        return this.cupons.get(id);
    }

    getUtensilio(id: string): Utensilio | undefined {
        return this.utensilios.get(id);
    }

    getPagamento(id: string): Pagamento | undefined {
        return this.pagamentos.get(id);
    }
}
