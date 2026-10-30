const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Entrada", {
    id_entrada: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_fornecedor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    data_entrada: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    observacao: {
        type: DataTypes.STRING(200),
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
    tableName: "entradas",
    timestamps: false
});
