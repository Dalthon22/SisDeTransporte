const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Folo6 = require('./m_folo6');
const Folo6_Approve = require('./m_folo6_approve_state');
const User = require('./m_user');

const Employee = db.define('SGT_Empleado', {
    first_name: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    last_name: {
        type: Sequelize.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    is_unit_boss: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

Employee.hasMany(Folo6, {
    foreignKey: 'employee_id'
});

Employee.hasMany(Folo6_Approve, {
    foreignKey: 'aprove_tunit_boss_id'
});

Employee.belongsTo(Employee, {
    foreignKey: 'id_boss'
});

Employee.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = Employee;