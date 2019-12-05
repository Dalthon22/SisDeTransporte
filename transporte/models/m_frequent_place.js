const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const City = require('../models/m_city');
const Department = require('./m_department');

const Frequent_Place = db.define('SGT_Lugar_Frecuente', {
    name: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    detail: {
        type: Sequelize.STRING(250),
    },
    created_by: {
        type: Sequelize.INTEGER
    },
    updated_by: {
        type: Sequelize.INTEGER
    },
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

Frequent_Place.belongsTo(City, {
    foreignKey: 'city_id',
});

Frequent_Place.belongsTo(Department, {
    foreignKey: 'department_id'
});

module.exports = Frequent_Place;