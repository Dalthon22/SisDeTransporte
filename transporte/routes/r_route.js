const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_route');
const {
    body
} = require('express-validator');

// Get route list
router.get('/', (req, res) => {
    controller.getList(req, res);
});

// Show add form and Get Departamentos list
router.get('/registrar', (req, res) => {
    controller.getAdd(req, res);
});

//Save route
router.post('/registrar', [
        //Validations
        body('name', 'Ingrese el nombre de la ruta estándar.').not().isEmpty(),
        body('name', 'El nombre debe ser menor a 40 caracteres.').isLength({
            max: 40
        }),
        body('name', 'El nombre debe contener solo caracteres alfanuméricos.').matches(/^[a-zA-Záéíóú0-9 ]+$/i)
    ],
    (req, res) => {
        controller.createRoute(req, res);
    }
);

//Shows edit form
router.get('/actualizar', (req, res) => {
    controller.getUpdate(req, res);
});


//Saves edited route
router.post('/actualizar', [
    //Validations
    body('name', 'Ingrese el nombre de la ruta estándar.').not().isEmpty(),
    body('name', 'El nombre debe ser menor a 40 caracteres.').isLength({
        max: 40
    }),
    body('name', 'El nombre debe contener solo caracteres alfanuméricos.').matches(/^[a-zA-Záéíóú0-9 ]+$/i)
], (req, res) => {
    controller.updateRoute(req, res);
});

module.exports = router;