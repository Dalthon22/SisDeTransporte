const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
Voucher_folo6_assign = require('./m_voucher_folo6_assign');
Voucher_procu_assign = require('./m_voucher_procu_assign');

const Voucher = db.define('voucher', {
  num_voucher: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  condition: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'disponible',
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
  voucher_provider: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  num_entry_bill: {
    type: Sequelize.BIGINT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  date_entry_bill: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  num_close_bill: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  date_close_bill: {
    type: Sequelize.DATE,
    allowNull: true,
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

Voucher.hasOne(Voucher_folo6_assign, {
  foreignKey: 'num_voucher'
});

Voucher.hasOne(Voucher_procu_assign, {
  foreignKey: 'num_voucher'
});

module.exports = Voucher;