const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Facts = sequelize.define('Facts', {
    Id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    Text: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    Font: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    Category: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true,
    tableName: 'facts'
});

module.exports = Facts;