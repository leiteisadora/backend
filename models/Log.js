const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Log", {
    id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    tabela_afetada: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    acao: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    registro: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: "logs",
    timestamps: false
});
