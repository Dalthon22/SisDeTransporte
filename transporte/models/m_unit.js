const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Employees = require('./m_employee');

const Unit = db.define('unit', {
    name_unit: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

/* Unit.hasMany(Employees, {
    foreignKey: 'unit_id'
}); */

module.exports = Unit;