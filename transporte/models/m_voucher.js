const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
Voucher_folo6_assign = require('./m_voucher_folo6_assign');

const Voucher = db.define('SGT_Vale', {
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

module.exports = Voucher;