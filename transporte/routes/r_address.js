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

//Crea dirección en la base de datos.
router.post('/add', (req, res) => {
    controller.createAddress(req, res);
});

//Gets Municipios depending on the selected Departamento
router.get('/getMunicipios', (req, res) => {
    controller.getMunicipiosByDepartamento(req, res);
});

router.post('/delete', (req, res) => {
    controller.deleteAddress(req, res);
});

module.exports = router;