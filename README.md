# Ride Drive Project (Java)
## 1. Visão Geral
O Ride Drive Project é um sistema de gerenciamento de transporte por aplicativo, simulando funcionalidades básicas de plataformas de carona/corrida. O projeto é desenvolvido em Java e utiliza amplamente os princípios da Orientação a Objetos (POO) para garantir um código modular, flexível e de fácil manutenção.
## 2. Conceitos e Tecnologias

| Conceito | Detalhes da Aplicação |
|-------|-----------------|
| **Java** | Linguagem de programação principal. |
| **Linguagem de programação principal.** | Base da arquitetura do projeto. Utilização de classes, herança, polimorfismo, encapsulamento e abstração. |
| **Controle de Exceceções** | Implementação de blocos `try-catch-finally` e a criação de **Exceções Customizadas** (ex: `PassageiroNaoEncontradoException`, `FormaPagamentoInvalidaException`) para garantir a robustez e o tratamento adequado de erros e situações inesperadas no sistema. |

## 3. Estrutura de Usuários

O sistema é centrado em diferentes tipos de usuários, modelados através de herança:
- `Usuario` **(Classe Base/Abstrata)**: Contém atributos e métodos comuns a todos os usuários (ex: `nome`, `email`, `id`).
  - `Passageiro` **(Subclasse)**: Usuário que solicita as corridas.
  - `Motorista` **(Subclasse)**: Usuário que realiza as corridas. Possui atributos específicos (ex: `modeloCarro`, `placa`).
 
## 4. Funcionalidades Principais
1. **Cadastro e Login:** Gestão de contas de `Passageiro` e `Motorista`.

2. **Solicitação de Corrida:** `Passageiro` informa origem e destino.

3. **Aceite da Corrida:** `Motorista` é notificado e pode aceitar a solicitação.

4. **Encerramento da Corrida:** Cálculo do valor final e registro da corrida concluída.

## 5. Controle de Pagamentos
O sistema suporta diversas formas de pagamento, modeladas de forma extensível:

`FormaPagamento` **(Interface/Classe Abstrata)**: Define o contrato para todos os métodos de pagamento (ex: método `processarPagamento(valor)`).

`Pix`: Implementa o processamento via chave ou QR Code.

`CartaoCredito`: Implementa a lógica de transação a crédito.

`CartaoDebito`: Implementa a lógica de transação a débito.

Essa estrutura permite adicionar novas formas de pagamento (ex: `Dinheiro`, `Voucher`) no futuro sem modificar a lógica central do sistema de corridas (princípio **Aberto/Fechado** do SOLID).
