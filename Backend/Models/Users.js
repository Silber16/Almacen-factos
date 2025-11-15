const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('Facts', {
    Id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    UserName: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    Trophies: { 
        type: DataTypes.JSON,
        default: []
    },
    Facts: { 
        type: DataTypes.JSON,
        default: []
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;