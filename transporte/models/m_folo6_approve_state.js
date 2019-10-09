const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
//const Employee = require('./m_employee');


const Folo6_Approve_State = db.define('folo6_approve_state', {
    request_unit_approve: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0
    },
    unit_cancel_detail: {
        type: Sequelize.STRING(250),
    },
    transport_unit_approve: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0
    },
    cancel_tunit_detail: {
        type: Sequelize.STRING(250),
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

/* Folo6_Approve_State.belongsTo(Employee, {
    foreignKey: 'aprove_boss_id'
});

Folo6_Approve_State.belongsTo(Employee, {
    foreignKey: 'aprove_tunit_boss_id'
}); */

module.exports = Folo6_Approve_State;