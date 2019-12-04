const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
Voucher = require('./m_voucher');

const FacturaLiquidacion = db.define('SGT_FacturaLiquidacion', {
    num_bill: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    date_close: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    provider: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    total: {
        type: Sequelize.DECIMAL(10, 2),
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

FacturaLiquidacion.hasMany(Voucher, {
    foreignKey: 'num_close_bill',
    as: 'num_close_bill'
});

module.exports = FacturaLiquidacion;