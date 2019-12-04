const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
Voucher = require('./m_voucher');

const FacturaCompra = db.define('SGT_FacturaCompra', {
    num_bill: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    date_entry: {
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
    for_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    for_year: {
        type: Sequelize.INTEGER,
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

FacturaCompra.hasMany(Voucher, {
    foreignKey: 'num_entry_bill',
    as: 'num_entry_bill'
});

module.exports = FacturaCompra;