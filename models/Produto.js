const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Produto", {
    id_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    descricao: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    imagem_produto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: true
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "produtos",
    timestamps: false
});
