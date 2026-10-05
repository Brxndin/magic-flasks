import { PagamentoStrategy } from "./PagamentoStrategy";

export interface Pagamento {
    id: string;
    nome: string;
    strategy: PagamentoStrategy;
}
