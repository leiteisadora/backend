const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("HistoricoPreco", {
    id_historico: {
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
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    vigencia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "historico_precos",
    timestamps: false
});
