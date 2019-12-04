const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');

const Role = db.define('SGT_Rol', {
    Codigo_Rol: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: Sequelize.STRING(50),
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

/* Role.hasMany(UserRol, {
    foreignKey: 'Codigo_Rol'
}); */

module.exports = Role;