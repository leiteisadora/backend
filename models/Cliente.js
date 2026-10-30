const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Cliente", {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    contato: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
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
    tableName: "clientes",
    timestamps: false
});
