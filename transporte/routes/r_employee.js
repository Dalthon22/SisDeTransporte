const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_employee');
const {
    body
} = require('express-validator');

router.get('/empleado/:id',
    (req, res) => {
        const id = req.params.id;
        console.log("Se buscará al empleado con id: " + id);
        controller.findById(id, req, res);
    });

router.get('/', (req, res) => {
    controller.getList(req, res);
});

router.get('/gestionar', (req, res) => {
    controller.getAdd(req, res);
})

router.post('/gestionar', [
    body('first_name', 'Ingrese el nombre del empleado').not().isEmpty(),
    body('last_name', 'Ingrese los apellidos del empleado').not().isEmpty(),
    body('email', '').not().isEmpty(),
    body('password', 'Ingrese una contraseña').not().isEmpty(),
    body('password', 'La contraseña debe tener al menos 8 caracteres').isLength({
        min: 8
    }),
    body('email', 'Ingrese una dirección de correo electrónico válido').not().isEmail(),
], (req, res) => {
    let employee_id = req.body.employee_id;
    console.log(employee_id);
    if (employee_id) {
        controller.updateEmployee(req, res);
    } else {
        controller.createEmployee(req, res);
    }
})

module.exports = router;