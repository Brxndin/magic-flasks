# Magic Flasks

Sistema para criação de pedidos de poções mágicas. Feito para a cadeira de Padrões de Projetos de Software (Design Patterns) da faculdade.

## Tecnologias Usadas

- TypeScript
- Preact
- Vite

## Design Patterns Usados

Foram usados 5 design patterns para fazer o sistema.

- Builder: monta a poção básica com seus adicionais opcionais.
- Decorator: adiciona utensílios para a poção, como canudo e embalagem.
- Strategy: define o pedido com a forma de pagamento e desconto por cupom.
- Singleton: cria 3 listas ordenadas de pedidos, contemplando pedidos pendentes, pagos e prontos. Também foi feito um Repository para dados fixos que usa esse padrão (pois não há banco de dados).
- Adapter: cria um adaptador para a biblioteca externa de entregas dos duendes para os pedidos.
