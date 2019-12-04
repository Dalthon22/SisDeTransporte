const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Driver = db.define('SGT_Motorista', {
    first_name: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    last_name: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    birth_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    driver_license: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    license_type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    license_due_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '1'
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


module.exports = Driver;