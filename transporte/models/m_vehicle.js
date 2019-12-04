const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Vehicle = db.define('SGT_Vehiculo', {
    brand: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    model: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    plate: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    chassis: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    engine: {
        type: Sequelize.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true,
        }
    },
    state: {
        type: Sequelize.STRING(25),
        defaultValue: 'Funcional',
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    is_traveling: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
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

module.exports = Vehicle;