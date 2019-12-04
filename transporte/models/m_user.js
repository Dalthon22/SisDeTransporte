const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const UserRol = require('./m_user_role');

const User = db.define('SGT_Usuario', {
    CodigoUsuario: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ApellidosUsuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    NombresUsuarios: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    CorreoElectronicoUsuario: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ActivoInactivousuario: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

User.hasMany(UserRol, {
    foreignKey: 'CodigoUsuario'
});

module.exports = User;