const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_approve_panel');
const {
    body
} = require('express-validator');

//Ruta para panel de aprobacion de jefe de unidad
router.get('/panel_de_aprobacion', (req, res) => {
    controller.getListUnit(req, res);
});

//ruta para aprobar o cancelar folos por jefe de unidad

router.post('/panel_de_aprobacion', (req, res) => {
    let aod = req.body.aprobacion;
    if (aod == 1) {
        controller.AprobarFoloUnidad(req, res);
    } else {
        controller.CancelarFoloUnidad(req, res);
    }
});
//Ruta para panel de aprobacion de jefe de transporte

router.get('/nuevos_requerimientos', (req, res) => {
    controller.getListAllNew(req, res);
});
//ruta para aprobar o cancelar folos por jefe de transporte

router.post('/nuevos_requerimientos', (req, res) => {
    let aod = req.body.aprobacion;
    if (aod == 1) {
        controller.AprobeFoloTransport(req, res);
    } else {
        controller.CancelarFoloTransporte(req, res);
    }
});

module.exports = router;