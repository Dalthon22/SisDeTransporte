const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Voucher_folo6_assign = db.define('voucher_folo6_assign', {
    date_voucher_f6: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});


module.exports = Voucher_folo6_assign;