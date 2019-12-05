const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_address');
const {
    body
} = require('express-validator');

//get addresses list
router.get('/', (req, res) => {
    controller.getList(req, res);
});

// Show add form and Get Departamentos list
router.get('/add', (req, res) => {
    controller.getDepartmentList(req, res);
});

//Gets Municipios depending on the selected Departamento
router.get('/getMunicipios', (req, res) => {
    controller.getMunicipiosByDepartamento(req, res);
});

//Crea dirección en la base de datos.
router.post('/add', (req, res) => {
    controller.createAddress(req, res);
});

//Elimina la dirección a través del ícono.
router.post('/delete', (req, res) => {
    controller.deleteAddress(req, res);
});

//Elimina todas las direcciones creadas al salirse del folo.
router.post('/deleteList', (req, res) => {
    controller.deleteAddressList(req, res);
});

module.exports = router;