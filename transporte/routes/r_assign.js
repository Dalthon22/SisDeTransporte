const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_assign');
const {
    body
} = require('express-validator');

router.get('/', (req, res) => {
    controller.getAsignar(req, res);
});

router.post('/', (req, res) => {
    controller.crearAsignacion(req, res);
});

module.exports = router;