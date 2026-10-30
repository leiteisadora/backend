# API da loja

## Visão geral

API HTTP em Node.js e Express para gerenciar usuários e dados de uma loja e do
seu estoque. As respostas são JSON. O servidor também aceita corpos
`application/x-www-form-urlencoded`.

O acesso ao banco está em migração gradual:

- `/categorias` usa o modelo Sequelize `Categoria`.
- As demais rotas ainda usam diretamente o pool de conexões exportado por
  `mysql.js`.
- Os modelos Sequelize existem para mapear o esquema, mas isso não significa que
  todas as rotas já os utilizam.
- A aplicação não executa `sequelize.sync()` na inicialização; as tabelas
  existentes não são criadas ou alteradas automaticamente.

## Executar e configurar

Execute `npm start` para iniciar o servidor com Nodemon. A porta padrão é
`5000`; configure `PORT` para usar outra porta.

A conexão com o MySQL usa as variáveis definidas no `.env`:

| Variável | Finalidade | Padrão |
|---|---|---|
| `DB_HOST` | Host MySQL | Sem padrão |
| `DB_PORT` | Porta MySQL | `3306` |
| `DB_USER` | Usuário MySQL | Sem padrão |
| `DB_PASSWORD` | Senha MySQL | Sem padrão |
| `DB_NAME` | Banco de dados | Sem padrão |

Não publique valores de credenciais. O CORS está habilitado para qualquer
origem. Morgan registra as requisições HTTP.

Exemplo de origem local: `http://localhost:5000`.

## Rotas

Todas as rotas de coleção aceitam `GET`, `POST`, `PATCH /:id` e `DELETE /:id`,
salvo indicação em contrário. O `GET /:id` responde com uma lista que contém
zero ou um registro; um ID inexistente não é convertido em `404`.

| Recurso e prefixo | Campo do ID | Chave do envelope de leitura | Campos recebidos em `POST` e `PATCH` |
|---|---|---|---|
| Categorias — `/categorias` | `id_categoria` | `categoria` | `nome`, `descricao` |
| Clientes — `/clientes` | `id_cliente` | `cliente` | `nome`, `email`, `contato` |
| Fornecedores — `/fornecedores` | `id_fornecedor` | `fornecedor` | `nome`, `empresa`, `email`, `telefone`, `cidade`, `estado` |
| Funcionários — `/funcionarios` | `id_funcionario` | `funcionario` | `nome`, `cargo`, `salario`, `telefone`, `email` |
| Produtos — `/produtos` | `id_produto` | `produto` | `nome`, `descricao`, `preco`, `imagem_produto` |
| Entradas — `/entradas` | `id_entrada` | `entrada` | `id_produto`, `id_fornecedor`, `quantidade`, `valor_unitario`, `data_entrada`, `observacao` |
| Estoque — `/estoque` | `id_estoque` | `estoque` | `id_produto`, `quantidade`, `estoque_minimo`, `estoque_maximo`, `localizacao` |
| Histórico de preços — `/historico_precos` | `id_historico` | `historico_preco` | `id_produto`, `preco`, `vigencia` |
| Logs — `/logs` | `id_log` | `log` | `usuario`, `tabela_afetada`, `acao`, `registro`, `data_hora` |
| Movimentações — `/movimentacoes` | `id_movimentacao` | `movimentacao` | `id_produto`, `tipo`, `quantidade`, `data_movimentacao`, `observacao` |
| Pedidos — `/pedidos` | `id_pedido` | `pedido` | `status`, `data_pedido`, `id_cliente` |
| Itens de pedido — `/pedido_itens` | `id_item` | `pedido_item` | `id_pedido`, `id_produto`, `quantidade`, `valor_unitario`, `subtotal` |
| Saídas — `/saidas` | `id_saida` | `saida` | `id_produto`, `id_funcionario`, `quantidade`, `valor_unitario`, `data_saida`, `destino` |

Cada prefixo da tabela aceita:

| Método | Caminho | Comportamento |
|---|---|---|
| `GET` | `/<prefixo>` | Lista registros no envelope indicado. |
| `GET` | `/<prefixo>/:id` | Lista o registro correspondente ao ID no mesmo envelope; lista vazia quando não encontrado. |
| `POST` | `/<prefixo>` | Insere os campos indicados e responde `201` com mensagem e ID gerado. |
| `PATCH` | `/<prefixo>/:id` | Atualiza os campos indicados e responde `202` com mensagem. Os handlers definem todos esses campos na atualização; não trate `PATCH` como atualização parcial. |
| `DELETE` | `/<prefixo>/:id` | Remove pelo ID e responde `202` com mensagem. |

Os campos das requisições devem ser enviados em JSON ou
`application/x-www-form-urlencoded`. As rotas não têm validação de payload
uniforme; o banco pode rejeitar valores ausentes, inválidos, duplicados ou
incompatíveis com chaves estrangeiras. Na rota de categorias, campos omitidos
em `PATCH` são enviados ao Sequelize como `null`.

### Usuários — `/usuario`

Além do login, a rota oferece `GET /usuario`, `GET /usuario/:id`,
`POST /usuario`, `PATCH /usuario/:id` e `DELETE /usuario/:id`.

- O cadastro lê `nome`, `email`, `senha`, `contato` e `genero`.
- A atualização lê `nome`, `email` e `senha`.
- As consultas `GET` usam `SELECT *`; portanto, atualmente incluem o campo
  `senha` na resposta. Evite expor esses endpoints até que a resposta seja
  corrigida para omitir credenciais.
- O cadastro e a atualização gravam o valor de `senha` recebido sem aplicar
  hash. O login aceita bcrypt e também a comparação de valores legados em texto
  puro. O formato dos dados existentes não é inferido pela API.

### Login

`POST /usuario/login` autentica pelo e-mail de um usuário ativo (`ativo = 1`).
Envie:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua-senha"
}
```

- Sucesso: `200`, com `mensagem` e `usuario` sem o campo `senha`.
- Campos ausentes, vazios ou de tipo incorreto: `400`.
- E-mail ou senha inválidos: `401`.
- Falha de conexão, consulta ou validação bcrypt: `500`.

O endpoint remove espaços no início e no fim do e-mail. **Não cria sessão nem
emite token.** A API não tem middleware de autenticação: as demais rotas não
exigem login.

## Formatos de resposta

Leituras usam o envelope indicado na tabela, por exemplo:

```json
{
  "categoria": [
    {
      "id_categoria": 1,
      "nome": "Exemplo",
      "descricao": null,
      "ativo": 1
    }
  ]
}
```

Respostas de criação usam `201` e seguem o formato:

```json
{
  "mensagem": "Categoria criada com sucesso!",
  "id_categoria": 1
}
```

Atualizações e remoções respondem `202` com uma mensagem. Os nomes exatos das
mensagens variam por recurso.

## Status e erros

- `200`: leitura ou login bem-sucedido.
- `201`: registro criado.
- `202`: atualização ou remoção aceita.
- `400`: campos obrigatórios do login ausentes ou inválidos.
- `401`: credenciais de login inválidas.
- `404`: rota não encontrada; resposta do handler global:

  ```json
  {
    "erro": {
      "mensagem": "Não encontrado!"
    }
  }
  ```

- `500`: falha de conexão, consulta ou outra falha interna. Erros de banco
  tratados diretamente pelas rotas normalmente usam `{ "error": ... }`; o
  formato não é uniforme entre o handler global e os handlers das rotas.

## Frontend

O painel estático fica em `frontend/`. Sirva essa pasta com um servidor de
arquivos estáticos e abra `index.html`; informe o endereço base do backend no
botão de configurações. O valor é salvo no armazenamento local do navegador.
O painel consome os 13 recursos CRUD descritos acima, com busca, criação,
edição e remoção. Ele não inclui a rota de usuários: os `GET /usuario`
retornam o campo `senha`, e a API não oferece autenticação ou autorização.

O CORS permite qualquer origem, mas isso não protege os dados nem restringe
quem pode chamar a API. Não disponibilize o painel ou o backend publicamente
como ferramenta administrativa até que o backend implemente autenticação,
autorização e respostas seguras para dados de usuários.
