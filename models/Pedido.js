const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Pedido", {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    data_pedido: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: true
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "pedidos",
    timestamps: false
});
