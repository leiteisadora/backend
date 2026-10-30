const sequelize = require("../sequelize");

const Categoria = require("./Categoria")(sequelize);
const Cliente = require("./Cliente")(sequelize);
const Entrada = require("./Entrada")(sequelize);
const Estoque = require("./Estoque")(sequelize);
const Fornecedor = require("./Fornecedor")(sequelize);
const Funcionario = require("./Funcionario")(sequelize);
const HistoricoPreco = require("./HistoricoPreco")(sequelize);
const Log = require("./Log")(sequelize);
const Movimentacao = require("./Movimentacao")(sequelize);
const Pedido = require("./Pedido")(sequelize);
const PedidoItem = require("./PedidoItem")(sequelize);
const Produto = require("./Produto")(sequelize);
const Saida = require("./Saida")(sequelize);
const Usuario = require("./Usuario")(sequelize);

const restrictedRelation = {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT"
};

Categoria.hasMany(Produto, {
    ...restrictedRelation,
    foreignKey: "id_categoria",
    as: "produtos"
});
Produto.belongsTo(Categoria, {
    ...restrictedRelation,
    foreignKey: "id_categoria",
    as: "categoria"
});

Produto.hasMany(Entrada, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "entradas"
});
Entrada.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});
Fornecedor.hasMany(Entrada, {
    ...restrictedRelation,
    foreignKey: "id_fornecedor",
    as: "entradas"
});
Entrada.belongsTo(Fornecedor, {
    ...restrictedRelation,
    foreignKey: "id_fornecedor",
    as: "fornecedor"
});

Produto.hasOne(Estoque, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "estoque"
});
Estoque.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});

Produto.hasMany(HistoricoPreco, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "historico_precos"
});
HistoricoPreco.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});

Produto.hasMany(Movimentacao, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "movimentacoes"
});
Movimentacao.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});

Cliente.hasMany(Pedido, {
    ...restrictedRelation,
    foreignKey: "id_cliente",
    as: "pedidos"
});
Pedido.belongsTo(Cliente, {
    ...restrictedRelation,
    foreignKey: "id_cliente",
    as: "cliente"
});

Pedido.hasMany(PedidoItem, {
    ...restrictedRelation,
    foreignKey: "id_pedido",
    as: "itens"
});
PedidoItem.belongsTo(Pedido, {
    ...restrictedRelation,
    foreignKey: "id_pedido",
    as: "pedido"
});

Produto.hasMany(PedidoItem, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "itens_pedido"
});
PedidoItem.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});

Produto.hasMany(Saida, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "saidas"
});
Saida.belongsTo(Produto, {
    ...restrictedRelation,
    foreignKey: "id_produto",
    as: "produto"
});
Funcionario.hasMany(Saida, {
    ...restrictedRelation,
    foreignKey: "id_funcionario",
    as: "saidas"
});
Saida.belongsTo(Funcionario, {
    ...restrictedRelation,
    foreignKey: "id_funcionario",
    as: "funcionario"
});

module.exports = {
    sequelize,
    Categoria,
    Cliente,
    Entrada,
    Estoque,
    Fornecedor,
    Funcionario,
    HistoricoPreco,
    Log,
    Movimentacao,
    Pedido,
    PedidoItem,
    Produto,
    Saida,
    Usuario
};
