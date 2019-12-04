const Department = require('./m_department');
const City = require('./m_city');
const Vehicle = require('./m_vehicle');
const Address = require('./m_address');
const Route = require('./m_route');
const Frequent_Place = require('./m_frequent_place');
const Voucher = require('./m_voucher');
const Voucher_procu_assign = require('./m_voucher_procu_assign');
const Voucher_folo6_assign = require('./m_voucher_folo6_assign');
const Folo6 = require('./m_folo6');
const Employee = require('./m_employee');
const Places_container = require('./m_places_container');
const Folo6_Approve_State = require('./m_folo6_approve_state');
const route_conditions = require('../models/m_route_conditions');
const User = require('./m_user');
const Rol = require('./m_role');
const UserRol = require('./m_user_role');
const ProcurementBill = require('./m_bill');
const CosumedBill = require('./m_bill_close');
const Mision = require('../models/m_mision');
const Driver = require('../models/m_driver');

class Migration {
    constructor() {
        Department.sync();
        City.sync();
        Driver.sync({
            alter: false
        });
        Mision.sync({
            alter: false
        });
        Address.sync({
            alter: false
        });
        Vehicle.sync({
            alter: false
        });
        Frequent_Place.sync({
            alter: false
        });
        Voucher.sync({
            alter: false
        });
        Employee.sync({
            alter: false
        });
        Folo6.sync({
            alter: false
        });
        Places_container.sync({
            alter: false
        });
        Voucher_procu_assign.sync({
            alter: false
        });
        Voucher_folo6_assign.sync({
            alter: false
        });
        Folo6_Approve_State.sync({
            alter: false
        });
        route_conditions.sync({
            alter: false
        });
        Route.sync({
            alter: false
        });
        User.sync({
            alter: false
        });
        Rol.sync({
            alter: false
        });
        UserRol.sync({
            alter: false
        });
        ProcurementBill.sync({
            alter: false
        })
        CosumedBill.sync({
            alter: false
        })
    }
};

module.exports = Migration;