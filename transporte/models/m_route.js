const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const route_conditions = require('./m_route_conditions');
const frequent_places = require('./m_frequent_place');

const Route = db.define('SGT_Ruta', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  enabled: {
    type: Sequelize.BOOLEAN,
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

Route.belongsTo(route_conditions, {
  foreignKey: 'route_conditions_id'
});

Route.hasMany(frequent_places, {
  foreignKey: 'route_id'
});

module.exports = Route;