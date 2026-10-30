const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Fornecedor", {
    id_fornecedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    empresa: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    cidade: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    estado: {
        type: DataTypes.CHAR(2),
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
    tableName: "fornecedores",
    timestamps: false
});
