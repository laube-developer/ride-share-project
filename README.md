# Ride Drive Project (Java)

![Banner](/banner.png)

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

## 6. Passo a passo para trabalhar
O projeto tem duas branchs: `main` e `develop`.

- `main` (ou master): Esta branch deve conter apenas o código 100% funcional e pronto para entrega. Ninguém deve enviar código diretamente para ela.

- `develop`: Esta será a branch de integração. Todo o trabalho novo, quando finalizado e revisado, será mesclado (merged) aqui. Ela representa a versão de desenvolvimento mais atual do projeto.

As tarefas estão na aba [Issues](/issues).

### Passo 1 - Sincronizar com develop.
**`Sempre antes de mexer em qualquer coisa`**

```bash
git checkout develop
git pull origin develop
```

### Passo 2 - Criar sua Feature Branch
**`Sempre que for iniciar uma nova feature`**

```bash
#Cria uma nova branch e já muda para ela
#git checkout -b luis/feat/classes-usuario-heranca
git checkout -b nome-do-membro/feature/nome-da-tarefa
```

### Passo 3 - Trabalhar e "Committar"
Agora, você está na sua branch isolada. Pode trabalhar à vontade. Seu trabalho não afeta ninguém e o trabalho de ninguém afeta você.

Lembre-se de fazer commits pequenos e organizados por funcionalidade.

```bash
git add .
git commit -m "feat: Cria classe abstrata Usuario e herança de Passageiro"
```

### Passo 4 - Abrir um Pull Request (PR)
Quando sua tarefa estiver concluída (ex: Luís terminou todas as classes de usuário), você envia sua branch para o GitHub e abre um Pull Request (PR).

```bash
git push origin luis/feat/classes-usuario-heranca
```

No GitHub, você abrirá um PR da sua branch (luis/feat/classes-usuario-heranca) para a branch develop.

### Passo 5: Revisão de Código (Code Review)
Revisar o código no github (Procurar o pull request)

### Passo 6: Mesclar (Merge)
Após o PR ser aprovado, **`O LIDER`** clica no botão "Merge" no GitHub. Seu código agora é oficialmente parte da branch develop.