const Sequelize = require('sequelize');
const db = require('../dbconfig/conex');
const Address = require('./m_address');
const Frequent_Place = require('./m_frequent_place');
const Folo_06 = require('./m_folo6');

const Places_container = db.define('SGT_Lugares_Contenedor', {
    date_of_visit: {
        type: Sequelize.DATEONLY,
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

Places_container.belongsTo(Address, {
    foreignKey: 'address_id'
});
Places_container.belongsTo(Frequent_Place, {
    foreignKey: 'frequent_place_id'
});

module.exports = Places_container;