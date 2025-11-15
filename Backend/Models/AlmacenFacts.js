const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AlmacenFacts = sequelize.define('AlmacenFacts', {
    UserId: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FactsIds: { 
        type: DataTypes.JSON,
        default: []
    },
}, {
    timestamps: true,
    tableName: 'almacenFacts'
});

module.exports = AlmacenFacts;