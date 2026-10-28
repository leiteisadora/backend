# API da loja

## Objetivo

Esta API fornece operações HTTP para gerenciar os dados de uma loja e do seu
estoque. Ela permite consultar, cadastrar, atualizar e remover registros de
usuários, clientes, produtos, pedidos e outros recursos relacionados. Os dados
são armazenados em MySQL.

## Tecnologias e configuração

- Node.js com Express.
- MySQL, acessado por um pool de conexões.
- Requisições e respostas em JSON. O servidor também aceita formulários
  `application/x-www-form-urlencoded`.
- CORS habilitado para qualquer origem.
- A porta padrão é `5000`; pode ser alterada pela variável `PORT`.
- A conexão com o banco usa as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`,
  `DB_PASSWORD` e `DB_NAME`. `DB_PORT` assume `3306` quando não informado.

## Endpoints

As rotas abaixo são relativas à origem e à porta onde o servidor está
executando. Por exemplo: `http://localhost:5000/produtos`.

| Recurso | Prefixo | Funcionalidades |
|---|---|---|
| Usuários | `/usuario` | Listar usuários, consultar por ID, cadastrar, atualizar, remover e autenticar pelo endpoint `/login`. |
| Clientes | `/clientes` | Listar, consultar por ID, cadastrar, atualizar e remover clientes. |
| Categorias | `/categorias` | Listar, consultar por ID, cadastrar, atualizar e remover categorias. |
| Fornecedores | `/fornecedores` | Listar, consultar por ID, cadastrar, atualizar e remover fornecedores. |
| Funcionários | `/funcionarios` | Listar, consultar por ID, cadastrar, atualizar e remover funcionários. |
| Produtos | `/produtos` | Listar, consultar por ID, cadastrar, atualizar e remover produtos. |
| Entradas | `/entradas` | Registrar e gerenciar entradas de produtos, incluindo fornecedor, quantidade, valor, data e observação. |
| Estoque | `/estoque` | Consultar e gerenciar registros de estoque, quantidade, limites mínimo e máximo e localização. |
| Histórico de preços | `/historico_precos` | Consultar e gerenciar preços e suas vigências por produto. |
| Logs | `/logs` | Consultar e gerenciar registros de log da aplicação. |
| Movimentações | `/movimentacoes` | Consultar e gerenciar movimentações de produtos, com tipo, quantidade, data e observação. |
| Pedidos | `/pedidos` | Consultar e gerenciar pedidos, com status, data e cliente associado. |
| Itens de pedido | `/pedido_itens` | Consultar e gerenciar produtos, quantidades e valores associados a pedidos. |
| Saídas | `/saidas` | Consultar e gerenciar saídas de produtos, com funcionário, quantidade, valor, data e destino. |

### Operações padrão de recursos

Nos recursos com gerenciamento completo, os métodos e caminhos seguem este
padrão:

| Método | Caminho | Operação |
|---|---|---|
| `GET` | `/<recurso>` | Lista os registros do recurso. |
| `GET` | `/<recurso>/:id` | Consulta um registro pelo ID. |
| `POST` | `/<recurso>` | Cadastra um registro usando os campos esperados no corpo JSON. |
| `PATCH` | `/<recurso>/:id` | Atualiza os campos do registro indicado. |
| `DELETE` | `/<recurso>/:id` | Remove o registro indicado. |

O nome do campo de ID varia por recurso (por exemplo, `id_produto`,
`id_cliente` e `id_pedido`). Cada cadastro e atualização recebe no corpo os
campos usados por aquele recurso; os nomes podem ser conferidos na tabela e no
código correspondente em `route/`.

### Login

`POST /usuario/login` autentica um usuário ativo pelo endereço de e-mail e
senha. Envie:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua-senha"
}
```

No sucesso, a resposta contém uma mensagem e os dados do usuário, sem a senha.
Credenciais inválidas retornam `401`; campos ausentes ou inválidos retornam
`400`.

O endpoint valida senhas armazenadas em bcrypt e também é compatível com
senhas legadas em texto puro. **O login não cria sessão nem emite token**; a
API não implementa autenticação para proteger as demais rotas.

## Respostas e erros

- `200`: consulta ou login bem-sucedido.
- `201`: registro criado.
- `202`: atualização ou remoção aceita.
- `400`: dados obrigatórios do login ausentes ou inválidos.
- `401`: credenciais de login inválidas.
- `404`: rota não encontrada.
- `500`: erro interno, incluindo falhas de conexão ou consulta ao banco.

As respostas de erro do tratamento geral usam o formato:

```json
{
  "erro": {
    "mensagem": "Não encontrado!"
  }
}
```
