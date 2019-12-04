const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_driver');
const {
    body
} = require('express-validator');

router.get('/', (req, res) => {
    controller.getList(req, res);
});

router.get('/gestionar', (req, res) => {
    controller.getAdd(req, res);
});

router.post('/gestionar', [
    //Validations
    body('driver_license', 'Ingrese la licencia del motorista.').not().isEmpty(),
    body('license_type', 'Seleccione el tipo de licencia del motorista.').not().isEmpty(),
    body('month', 'Seleccione el mes de la fecha de vencimiento de la licensia.').not().isEmpty(),
    body('anio', 'Seleccione el año de la fecha de vencimiento de la licensia.').not().isEmpty(),
    body('calendar1', 'Seleccione la fecha de nacimiento del motorista.').not().isEmpty(),
    body('first_name', 'El nombre debe ser menor a 150 caracteres.').isLength({
        max: 150
    }),
    body('first_name', 'Ingrese el nombre del motorista.').not().isEmpty(),
    body('last_name', 'El apellido debe ser menor a 150 caracteres.').isLength({
        max: 150
    }),
    body('last_name', 'Ingrese el apellido del motorista.').not().isEmpty()

], (req, res) => {
    let driver_id = req.body.driver_id;
    console.log(driver_id);
    if (driver_id) {
        controller.updateDriver(req, res);
    } else {
        controller.createDriver(req, res);
    }
});

router.get('/eliminar', (req, res) => {
    controller.deleteMotorista(req, res);
});

module.exports = router;