const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Movimentacao", {
    id_movimentacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    tipo: {
        type: DataTypes.ENUM("E", "S", "A", "P", "T"),
        allowNull: true,
        defaultValue: null
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    data_movimentacao: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    observacao: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "movimentacoes",
    timestamps: false
});
