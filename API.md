# API de Gestão da Loja e Estoque

## Visão geral

Esta API HTTP, implementada em Node.js e Express, centraliza o gerenciamento de
usuários, cadastros, pedidos e operações de estoque de uma loja. Seu objetivo é
fornecer ao painel web operações autenticadas de consulta, cadastro, atualização
e exclusão dos dados. As respostas são JSON. O servidor também aceita corpos
`application/x-www-form-urlencoded`.

### Problema que resolve

A API reúne em um único serviço os dados e operações que, sem ela, ficariam
dispersos entre controles manuais: cadastro de produtos, clientes e
fornecedores, acompanhamento de pedidos e registro de entradas, saídas e
estoque. O painel e outros clientes autorizados podem consultar e manter esses
dados por meio de rotas HTTP autenticadas.

### Tecnologias e persistência

- **Backend:** Node.js (CommonJS) e Express 5.
- **Banco de dados:** MySQL.
- **Acesso SQL:** driver `mysql` e pool de conexões definido em `mysql.js`.
- **ORM:** Sequelize 6. É usado atualmente pela rota `/categorias` e para
  definir os modelos que mapeiam tabelas e tipos do banco. As demais rotas ainda
  usam consultas SQL pelo pool MySQL; portanto, o ORM não é a camada de acesso
  de toda a API.
- **Autenticação e segurança:** `jsonwebtoken` para assinar sessões,
  `bcryptjs` para proteger senhas novas, `cookie-parser` para ler cookies e
  `cors` para restringir origens.
- **Logs HTTP:** Morgan.

O acesso ao banco está em migração gradual:

- `/categorias` usa o modelo Sequelize `Categoria`.
- As demais rotas ainda usam diretamente o pool de conexões exportado por
  `mysql.js`.
- Os modelos Sequelize existem para mapear o esquema, mas isso não significa que
  todas as rotas já os utilizam.
- A aplicação não executa `sequelize.sync()` na inicialização; as tabelas
  existentes não são criadas ou alteradas automaticamente.

## Executar e configurar

### Instalação e inicialização

Requisitos: Node.js compatível com a versão indicada no projeto e uma instância
MySQL acessível. Na raiz do projeto:

```sh
npm install
```

Crie o banco e as tabelas antes de iniciar a API. A aplicação não cria nem
atualiza o esquema automaticamente; o arquivo SQL incluído no repositório pode
ser usado para preparar um banco local após revisar sua adequação ao ambiente.
Configure as variáveis abaixo em um arquivo `.env` local (use `.env.example`
como modelo), então inicie:

```sh
npm start
```

Para desenvolvimento com reinício automático:

```sh
npm run dev
```

A porta padrão é `5000`; configure `PORT` para usar outra porta. Para executar
os testes automatizados:

```sh
npm test
```

A conexão com o MySQL usa as variáveis definidas no `.env`:

| Variável | Finalidade | Padrão |
|---|---|---|
| `DB_HOST` | Host MySQL | Sem padrão |
| `DB_PORT` | Porta MySQL | `3306` |
| `DB_USER` | Usuário MySQL | Sem padrão |
| `DB_PASSWORD` | Senha MySQL | Sem padrão |
| `DB_NAME` | Banco de dados | Sem padrão |
| `PORT` | Porta HTTP da API | `5000` |
| `HOST` ou `IP` | Interface/endereço local onde o servidor escuta | Todas as interfaces |
| `JWT_SECRET` | Segredo de assinatura das sessões | Obrigatório; mínimo de 32 bytes aleatórios |
| `FRONTEND_ORIGIN` | Origens autorizadas do frontend, separadas por vírgula | Obrigatório em produção |
| `NODE_ENV` | Ambiente de execução | `development` |

Copie `.env.example` para `.env` e gere um segredo com
`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
Configure segredos apenas no ambiente local ou no painel do provedor; nunca os
publique. Em produção, use HTTPS e configure `FRONTEND_ORIGIN` com a origem
exata do frontend. O CORS permite credenciais apenas para origens autorizadas.
Morgan registra as requisições HTTP.

Exemplo de origem local do frontend: `http://localhost:8765`. O endereço base
padrão da API usado pelo painel é `http://localhost:5000`.

Não inclua valores reais de senha do banco, `JWT_SECRET` ou outros segredos na
documentação, no controle de versão ou em exemplos. Em produção, defina-os no
gerenciador de variáveis do provedor de hospedagem.

## Rotas

As rotas abaixo descrevem os recursos de negócio e seus IDs. Todas exigem uma
sessão válida e aceitam `GET /`, `GET /:id`, `POST /`, `PATCH /:id` e
`DELETE /:id`. As finalidades de cada método são: listar, consultar um registro,
cadastrar, atualizar e excluir, respectivamente. O `GET /:id` responde com uma
lista que contém zero ou um registro; um ID inexistente não é convertido em
`404`.

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

As leituras de entradas, estoque, histórico de preços, movimentações, pedidos,
itens de pedido e saídas incluem nomes dos registros relacionados, quando
existentes: `produto_nome`, `fornecedor_nome`, `cliente_nome`,
`funcionario_nome` e `pedido_referencia`. Os IDs originais continuam presentes
para compatibilidade com os clientes existentes.

### Usuários — `/usuario`

As rotas de usuário têm estas finalidades e requisitos:

| Método e caminho | Finalidade | Acesso |
|---|---|---|
| `POST /usuario/login` | Validar credenciais e iniciar sessão | Público, sujeito à validação de origem |
| `POST /usuario/logout` | Encerrar a sessão no navegador | Público; limpa o cookie apresentado pelo cliente |
| `GET /usuario/me` | Consultar a identidade da sessão atual | Autenticado |
| `GET /usuario` | Listar usuários sem expor senhas | Autenticado |
| `GET /usuario/:id` | Consultar usuário por ID sem expor senha | Autenticado |
| `POST /usuario` | Cadastrar usuário | Autenticado |
| `PATCH /usuario/:id` | Atualizar nome, e-mail e senha do usuário | Autenticado |
| `DELETE /usuario/:id` | Excluir usuário por ID | Autenticado |

- O cadastro lê `nome`, `email`, `senha`, `contato` e `genero`.
- A atualização lê `nome`, `email` e `senha`.
- As consultas `GET` não retornam o campo `senha`.
- O cadastro e a atualização aplicam bcrypt à senha. O login ainda aceita a
  comparação de valores legados em texto puro para compatibilidade; atualize
  as senhas antigas para remover esse formato.

#### Cadastrar um usuário e testar o login

O cadastro `POST /usuario` é protegido. Portanto, para cadastrar usuários pela
API é necessário já ter uma sessão válida; não existe um endpoint público para
criar a primeira conta. Em uma instalação nova, prepare a conta inicial por um
processo administrativo seguro e autorizado (por exemplo, uma carga inicial
controlada no banco). Não habilite o cadastro público sem implementar e revisar
os controles necessários.

Depois de obter a sessão de um usuário autorizado, envie o cadastro em JSON:

```sh
curl -i -b cookies.txt \
  -H "Content-Type: application/json" \
  -X POST http://localhost:5000/usuario \
  -d '{"nome":"Nome de teste","email":"usuario@exemplo.com","senha":"substitua-por-uma-senha-segura","contato":"","genero":""}'
```

A resposta esperada é `201 Created`, com uma mensagem e o ID criado. A senha é
armazenada com bcrypt; não reutilize senhas reais em exemplos ou ambientes de
teste compartilhados.

Para autenticar, envie o e-mail e a senha em JSON. O exemplo salva o cookie da
sessão no arquivo local `cookies.txt`:

```sh
curl -i -c cookies.txt \
  -H "Origin: http://localhost:8765" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:5000/usuario/login \
  -d '{"email":"usuario@exemplo.com","senha":"substitua-pela-senha-cadastrada"}'
```

Um login válido retorna `200 OK`, a mensagem de sucesso e os dados do usuário
sem a senha, além de emitir o cookie `loja_session` com `HttpOnly`. Para testar
a sessão, envie o cookie salvo:

```sh
curl -i -b cookies.txt \
  -H "Origin: http://localhost:8765" \
  http://localhost:5000/usuario/me
```

## Formato das requisições e respostas

Envie payloads em `application/json` (recomendado) ou
`application/x-www-form-urlencoded`. Para JSON, inclua
`Content-Type: application/json`. Exemplo de cadastro de categoria:

```json
{
  "nome": "Exemplo",
  "descricao": "Descrição da categoria"
}
```

O sucesso do cadastro retorna `201 Created`:

```json
{
  "mensagem": "Categoria criada com sucesso!",
  "id_categoria": 1
}
```

As leituras retornam JSON com um envelope nomeado pelo recurso e uma lista,
inclusive na consulta por ID:

```json
{
  "categoria": [
    {
      "id_categoria": 1,
      "nome": "Exemplo",
      "descricao": "Descrição da categoria",
      "ativo": 1
    }
  ]
}
```

Atualizações e exclusões respondem `202 Accepted` com uma mensagem. As mensagens
variam por rota. Erros também são JSON, mas seu formato não é totalmente
uniforme: handlers de autenticação retornam `mensagem`, falhas de banco podem
retornar `error`, e erros tratados pelo handler global usam `erro.mensagem`.
Consulte a tabela de status abaixo e os requisitos específicos de cada rota.

### Login

`POST /usuario/login` autentica pelo e-mail de um usuário ativo (`ativo = 1`).
Envie:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua-senha"
}
```

- Sucesso: `200`, com `mensagem` e `usuario` sem o campo `senha`, e define um
  cookie de sessão `HttpOnly` com expiração de oito horas.
- Campos ausentes, vazios ou de tipo incorreto: `400`.
- E-mail ou senha inválidos: `401`.
- Falha de conexão, consulta ou validação bcrypt: `500`.
- Segredo de sessão ausente ou curto demais: `503`.

O endpoint remove espaços no início e no fim do e-mail. `POST /usuario/logout`
remove o cookie e `GET /usuario/me` retorna a identidade autenticada. Todas as
rotas CRUD, incluindo os endpoints de usuários, exigem uma sessão válida; sem
ela respondem `401`. A sessão é um JWT assinado em cookie `HttpOnly`, não
acessível ao JavaScript do navegador. O logout limpa o cookie do navegador; o
token expira após oito horas.

Todos os usuários ativos autenticados têm as mesmas permissões; ainda não há
perfis ou autorização por recurso. Consultas de usuários omitem o campo
`senha`.

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
- `403`: origem não autorizada.
- `503`: configuração de autenticação incompleta.
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
edição e remoção, e exige login. Os campos relacionais usam seletores com nomes
e as listagens exibem os nomes incluídos pelos `JOIN`s da API. A API e o
frontend devem permitir cookies com credenciais e usar origens autorizadas.

O CORS aceita apenas origens autorizadas pela configuração do servidor (em
desenvolvimento também aceita origens de `localhost` e `127.0.0.1`). CORS não
substitui autenticação: as rotas de dados e de gerenciamento de usuários exigem
uma sessão válida. Todos os usuários autenticados têm as mesmas permissões;
ainda não há autorização por perfil ou por recurso. Em produção, use HTTPS,
configure explicitamente `FRONTEND_ORIGIN` e proteja as credenciais e o segredo
JWT.

## Endereço público da API

O repositório ainda não tem uma URL pública implantada. O endereço local padrão
é `http://localhost:5000`; ele só pode ser acessado na máquina onde o servidor
está executando. A configuração inicial para Render está em `render.yaml`.

Para publicar pela sua conta Render:

1. Envie o repositório para o GitHub e, no Render, crie um **Blueprint** a
   partir desse repositório.
2. Revise o Blueprint `loja-api` e confirme a criação do serviço. O deploy
   automático está desativado; inicie o primeiro deploy manualmente.
3. Configure no painel os valores secretos solicitados (`DB_HOST`, `DB_USER`,
   `DB_PASSWORD` e `DB_NAME`) para um banco MySQL acessível pelo Render.
   `JWT_SECRET` é gerado pelo Render. Em `FRONTEND_ORIGIN`, informe a origem
   HTTPS exata do frontend publicado, sem caminho de rota.
4. Após um deploy bem-sucedido, copie a URL `https://...onrender.com` exibida
   pelo Render e atualize esta seção. O nome configurado é `loja-api`, mas a
   URL só fica reservada após a criação do serviço e pode depender da
   disponibilidade do nome.

Até a implantação estar concluída, não há endereço público funcional a
informar. Não use o host do MySQL como endereço da API: são serviços
diferentes. Nunca coloque valores secretos no repositório ou neste documento.
