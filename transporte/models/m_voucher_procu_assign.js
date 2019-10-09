const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
/* const Voucher = require('./m_voucher');
const Procuraduria = require('./m_procuraduria'); */

const Voucher_procu_assign = db.define('voucher_procu_assign', {
  date_voucher_procu: {
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

/* Voucher_procu_assign.belongsTo(Voucher, {
  foreignKey: 'num_voucher'
});
 */
/* Voucher_procu_assign.belongsTo(Procuraduria, {
  foreignKey: 'procuraduria_id'
}); */
module.exports = Voucher_procu_assign;
