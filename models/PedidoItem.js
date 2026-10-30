const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("PedidoItem", {
    id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    valor_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "pedido_itens",
    timestamps: false
});
