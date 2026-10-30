const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Usuario", {
    id_usu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    contato: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    genero: {
        type: DataTypes.CHAR(1),
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
    tableName: "usuarios",
    timestamps: false
});
