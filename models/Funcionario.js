const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Funcionario", {
    id_funcionario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    data_admissao: {
        type: DataTypes.DATEONLY,
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
        allowNull: false
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "funcionarios",
    timestamps: false
});
