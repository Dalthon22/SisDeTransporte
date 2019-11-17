const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Routes = require('./m_route');
const Vehicles = require('./m_vehicle');
const Employee = require('./m_employee');
const Folo6 = require('./m_folo6');
const Address = require('./m_address');
const Frequent_Place = require('./m_frequent_place');
const Voucher_procu_assign = require('./m_voucher_procu_assign');

const Procuraduria = db.define('SGT_Procuraduria', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    created_by: {
        type: Sequelize.INTEGER
    },
    updated_by: {
        type: Sequelize.INTEGER
    }
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
});

Procuraduria.hasMany(Routes, {
    foreignKey: 'procuraduria_id'
});
Procuraduria.hasMany(Frequent_Place, {
    foreignKey: 'procuraduria_id'
});
Procuraduria.hasMany(Vehicles, {
    foreignKey: 'procuraduria_id'
});
Procuraduria.belongsTo(Address, {
    foreignKey: 'address_id'
});
Procuraduria.hasMany(Employee, {
    foreignKey: 'procuraduria_id'
});
Procuraduria.hasMany(Folo6, {
    foreignKey: 'procuraduria_id'
});

Procuraduria.hasMany(Voucher_procu_assign, {
    foreignKey: 'procuraduria_id'
});

module.exports = Procuraduria;