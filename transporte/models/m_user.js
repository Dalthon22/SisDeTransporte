const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Employee = require('./m_employee');
const UserRol = require('./m_user_role');

const User = db.define('SGT_Usuario', {
    email: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    password: {
        type: Sequelize.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: '1'
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

User.hasMany(UserRol, {
    foreignKey: 'user_id'
});

module.exports = User;