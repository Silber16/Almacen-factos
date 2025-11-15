const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trophy = sequelize.define('Trophy', {
    Id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    Icon: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    Points: { 
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
    tableName: 'trophies'
});

module.exports = Trophy;