const Asignacion = require('../models/m_voucher_folo6_assign');
const Vehiculo = require('../models/m_vehicle');
const Deparment = require('../models/m_department');
const {
    validationResult
} = require('express-validator');

class assign_controller {
    constructor() {}

    async getAsignar(req, res) {
        try {
            var Vehiculos = await Vehiculo.findAll({
                where: {
                    state: 'Funcional',
                }
            });
            return res.render('../views/assign.html', {
                Vehiculos
            });
        } catch (error) {
            console.log(error);
        }
    };

}

module.exports = new assign_controller();