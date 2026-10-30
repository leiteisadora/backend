const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Saida", {
    id_saida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_funcionario: {
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
    data_saida: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    destino: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "saidas",
    timestamps: false
});
