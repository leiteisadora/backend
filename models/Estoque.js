const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Estoque", {
    id_estoque: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estoque_minimo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    estoque_maximo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    localizacao: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "estoque",
    timestamps: false
});
