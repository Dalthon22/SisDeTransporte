const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Role = require('./m_role');

const UserRol = db.define('SGT_UsuarioRol', {
    CodigoRol: {
        type: Sequelize.STRING(10),
        primaryKey: true,
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

UserRol.belongsTo(Role, {
    foreignKey: 'CodigoRol',
});

module.exports = UserRol;