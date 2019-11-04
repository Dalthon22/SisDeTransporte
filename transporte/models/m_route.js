const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const route_conditions = require ('./m_route_conditions');

const Route = db.define('route', {
  name: {
    type: Sequelize.STRING,
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

module.exports = Route;