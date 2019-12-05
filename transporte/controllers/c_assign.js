const Asignacion = require('../models/m_voucher_folo6_assign');
const Vehiculo = require('../models/m_vehicle');
const employee = require('../models/m_employee');
const folo6 = require('../models/m_folo6');
const folo6_approve = require('../models/m_folo6_approve_state');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

const {
    validationResult
} = require('express-validator');

class assign_controller {
    constructor() {}

    async getAsignar(req, res) {
        try {
            /* Se buscan todos los folos que hayan sido aprobados por cada unidad */
            /* Se hace un join de Empleados,Folo6 y folo6_apporve */
            var folos = await employee.findAll({
                include: [{
                    model: folo6,
                    raw: true,
                    required: true,
                    include: [{
                        model: folo6_approve,
                        where: {
                            transport_unit_approve: 1, //Aprobados
                            cancel_tunit_detail: null //Que no haya sido cancelado
                        }
                    }]
                }]
            });
            /* Se enviara un array con todos los folos con los datos a mostrar */
            var data = [];
            /* Recorremos cada empleado y luego por todos los folos que tienen */
            folos.forEach((emp, i) => {
                emp.SGT_Folo6s.forEach((employeeFolos, i) => {
                    /* Se asignara a una variable el para luego ñadirla a la data */
                    var el = new Object();
                    el.first_name = emp.first_name;
                    el.last_name = emp.last_name;
                    var formatted_date = moment.utc(employeeFolos.off_date).format("DD MMMM YYYY");
                    el.off_date = formatted_date;
                    el.passengers_number = employeeFolos.passengers_number;
                    el.mission = employeeFolos.mission;
                    el.folo6id = employeeFolos.id;
                    el.wDriver = employeeFolos.with_driver;
                    el.off_hour = moment.utc(employeeFolos.off_hour).format("h:mm A");

                    data.push(el);
                })
            });
            var Cars = await Vehiculo.findAll({
                where: {
                    state: 'Funcional',
                }
            });
            return res.render('../views/assign.html', {
                Cars,
                data
            });
        } catch (error) {
            console.log(error);
        }
    };

}

module.exports = new assign_controller();