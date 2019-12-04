const Department = require('./m_department');
const City = require('./m_city');
const Vehicle = require('./m_vehicle');
const Address = require('./m_address');
const Frequent_Place = require('./m_frequent_place');
const Voucher = require('./m_voucher');
const Voucher_folo6_assign = require('./m_voucher_folo6_assign');
const Folo6 = require('./m_folo6');
const Employee = require('./m_employee');
const Places_container = require('./m_places_container');
const Folo6_Approve_State = require('./m_folo6_approve_state');
const User = require('./m_user');
const Rol = require('./m_role');
const UserRol = require('./m_user_role');
const ProcurementBill = require('./m_bill');
const CosumedBill = require('./m_bill_close');

class Migration {
    constructor() {
        Department.sync();
        City.sync();

        Address.sync({
            alter: true
        });
        Vehicle.sync({
            alter: true
        });
        Frequent_Place.sync({
            alter: true
        });
        Voucher.sync({
            alter: true
        });
        Employee.sync({
            alter: true
        });
        Folo6.sync({
            alter: true
        });
        Places_container.sync({
            alter: true
        });
        Voucher_folo6_assign.sync({
            alter: true
        });
        Folo6_Approve_State.sync({
            alter: true
        });
        User.sync({
            alter: true
        });
        Rol.sync({
            alter: true
        });
        UserRol.sync({
            alter: true
        });
        ProcurementBill.sync({
            alter: true
        })
        CosumedBill.sync({
            alter: true
        })
    }
};

module.exports = Migration;