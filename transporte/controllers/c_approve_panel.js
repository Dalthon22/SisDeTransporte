const folo6 = require('../models/m_folo6');
const folo6_approve = require('../models/m_folo6_approve_state');
const employee = require('../models/m_employee');
var moment = require('moment');

const {
    validationResult
} = require('express-validator');
class approve_panel_controller {
    /* con get listUnit se utiliza para los jefes de unidad, mostrara solo los folos que no se han aprobado */
    async getListUnit(req, res, message, atype) {
        try {
            let id_unidad = 1;
            /* Traemos todos los folos de la unidad correspondiente haciendo Joins con las tablas empleado y estado del folo */
            /* Se hace un join de Empleados,Folo6 y folo6_state */
            var folos = await employee.findAll({
                include: [{
                    model: folo6,
                    raw: true,
                    required: true,
                    include: [{
                        model: folo6_approve,
                        where: {
                            request_unit_approve: 0,
                            unit_cancel_detail: null
                        }
                    }]
                }],
                where: {
                    unit_id: id_unidad
                }
            });
            var data = []; /* La data que se enviara al front */
            /* recorremos todos los empleados y ademas recorremos por cada uno de sus folos */
            folos.forEach(emp => {
                console.dir(emp);
                emp.SGT_Folo6s.forEach(employeeFolos => {
                    var el = new Object(); /* sera lo que ingresaremos a la data */
                    el.first_name = emp.first_name;
                    el.last_name = emp.last_name;
                    var formatted_date = moment.utc(employeeFolos.off_date).format("DD MMMM YYYY"); /* Damos Formato correcto a la fecha */
                    el.off_date = formatted_date;
                    el.passengers_number = employeeFolos.passengers_number;
                    el.mission = employeeFolos.mission;
                    el.folo6id = employeeFolos.id;
                    data.push(el);
                })
            });
            /* Renderizamos y enviamos la data  */
            return res.render('../views/folo6/folo06_approve_panel_boss_unit.html', {
                data,
                message,
                atype
            });
        } catch (error) {
            console.log(error);
        }
    };

    /* Aprobar folo por el jefe de la unidad correspondiente */
    async AprobarFoloUnidad(req, res) {
        try {
            let folo06id = await req.body.folo6_id_Amodal; /* Conseguimos el id del folo a aprobar */
            /* var idboss = session.getActual.idemployee(); */
            var idboss = 1;
            await folo6_approve.update({
                /* Hacemos update en el estado del folo */
                request_unit_approve: 1,
                aprove_boss_id: idboss
            }, {
                where: {
                    folo06_id: folo06id,
                }
            });
            /* Asignamos los mensajes que se enviaran */
            let message = 'true';
            let atype = 'true';
            this.getListUnit(req, res, message, atype);
        } catch (err) {
            /* Error al hacer el update que regresara a la pagina con  */
            console.log(err);
            error = 'No se actualizo el estado del folo BD ERROR.';
            /* Asignamos los mensajes que se enviaran */
            let message = 'false';
            let atype = 'true';
            this.getListUnit(req, res, message, atype);
        }
    };
    /* Cancelar el folo 6 por cada jefe de unidad */
    async CancelarFoloUnidad(req, res) {
        try {
            /* Conseguimos el id del folo y ademas la razon por la que se cancela */
            let folo06id = await req.body.folo6_id_Cmodal;
            let motivoC = await req.body.motivo;
            /* Hacemos el update a la tabla */
            await folo6_approve.update({
                request_unit_approve: 0,
                unit_cancel_detail: motivoC
            }, {
                where: {
                    folo06_id: folo06id
                }
            });
            /* Asignamos los mensajes que se enviaran */
            let message = 'true';
            let atype = 'false';
            /* Renderizamos la pagina con los mensajes */
            this.getListUnit(req, res, message, atype);
        } catch (err) {
            /* Si hay error se hara saber a la persona */
            console.log(err);
            error = 'No se actualizo el estado del folo BD ERROR.';
            /* se envian los mensajes correspondientes */
            let message = 'false';
            let atype = 'false';
            this.getListUnit(req, res, message, atype);
        }
    };

    /* con getListAllNew se utiliza para el jefe de transporte, mostrara solo los folos que no se han aprobado */
    async getListAllNew(req, res, message, atype) {
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
                            request_unit_approve: 1, //Aprobado por Unidad
                            transport_unit_approve: 0, //Sin Aprobar por Transporte
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
            /* Se renderiza la pagina con la data y si llevase algun mensaje */
            return res.render('../views/folo6/folo06_approve_panel_transport.html', {
                data,
                message,
                atype
            });
        } catch (error) {
            console.log(error);
        }
    };

    /* Metodo para aprobar el folo y pase a la siguiente asignación */
    async AprobeFoloTransport(req, res) {
        try {
            let folo06id = await req.body.folo6_id_Amodal; /* se consigue el id del folo */
            /* se actualiza la tabla de estados del folo correspondie   nte */
            /* var idboss = session.getActual.idemployee(); */
            var idboss = 1;
            await folo6_approve.update({
                transport_unit_approve: 1,
                aprove_tunit_boss_id: idboss
            }, {
                where: {
                    folo06_id: folo06id
                }
            });
            /* Se asignan los mensajes para mostrar */
            let message = 'true';
            let atype = 'true';
            /* Se renderiza la pagina con mensaje */
            this.getListAllNew(req, res, message, atype);
        } catch (error) {
            console.log(error);
            //error = 'No se actualizo el estado del folo BD ERROR.';
            /* Se asignan los mensajes para mostrar el error */
            let message = 'false';
            let atype = 'true';
            /* se renderiza la pagina con mensaje */
            this.getListAllNew(req, res, message, atype);
        }
    };

    /* Metodo para cancelar el folo si tiene discrepancia */
    async CancelarFoloTransporte(req, res) {
        try {
            /* se consiguen el id del folo y el motivo de la cancelacion */
            let folo06id = await req.body.folo6_id_Cmodal;
            let motivoC = await req.body.motivo;
            /* se actualiza la tabla de estados del folo correspondiente */
            await folo6_approve.update({
                transport_unit_approve: 0,
                cancel_tunit_detail: motivoC
            }, {
                where: {
                    folo06_id: folo06id
                }
            });
            /* Se asignan los mensajes a enviar */
            let message = 'true';
            let atype = 'false';
            /* se renderiza la pagina con mensaje de aprobación */
            this.getListAllNew(req, res, message, atype);
        } catch (error) {
            console.log(error);
            error = 'No se actualizo el estado del folo BD ERROR.';
            /* se asignan los mensajes de error */
            let message = 'false';
            let atype = 'false';
            /* se renderiza la pagina con mensaje de error */
            this.getListAllNew(req, res, message, atype);
        }
    };
}
module.exports = new approve_panel_controller();