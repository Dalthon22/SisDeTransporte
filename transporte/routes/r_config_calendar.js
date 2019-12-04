const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_config_calendar');

/*Get configuracion calendario list*/
router.get('/', (req, res) => {
    console.log("This is the config requested:" + req.query.config);
    switch (parseInt(req.query.config)) {
        case 1:
            controller.getRouteConfig(req, res);
            break;
        case 2:
            controller.getRouteDriverConfig(req, res);
            break;
            /* case 3:
                controller.
                break; */
        default:
            controller.getList(req, res);
    }
});

/* Obtienes la vista de rutas embebida en la pagina de calendario */
router.get('/rutas', (req, res) => {
    controller.getRouteConfig(req, res);
});

/* Obetiene la vista de asignacion de rutas a motorista embebida */
router.get('/rutas_motoristas', (req, res) => {
    controller.getRouteDriverConfig(req, res);
});

/* Obtiene la vitsa de calendario */
router.get('/calendario', (req, res) => {

});

module.exports = router