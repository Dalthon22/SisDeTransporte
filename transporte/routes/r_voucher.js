const express = require('express');
const router = express.Router();
const controller = require('../controllers/c_voucher');
const controller_assign = require('../controllers/c_assign');
const controller_vehicle = require('../controllers/c_vehicle');

const {
    body,
    check,
    validationResult
} = require('../middleware/expresse-validator');

//Muestra el listado de vales y permite el ingreso de vales
router.get('/vales', (req, res) => {
    res.render('./voucher/area_combustible_voucher.html');

});
//MAndar a traer la data que llenara el datatable con los vales ingresados
router.get('/vales/list', (req, res) => {
    controller.getList(req, res);
});
router.get('/vales/quantity', (req, res) => {
    controller.getQuantity(req, res);
});
//Manda los datos para agregar del vale "n" al vale "m"; n y m son cualquier número donde m > n
router.post('/vales/add',
    /*  [
         body('first_voucher', "Debe ingresar el numero del voucher").not().isEmpty(),
         body('first_voucher').isInt().withMessage('Debe ser un numero'),
     ], */
    (req, res) => {
        // Handle the request somehow
        console.log(req.body);
        controller.createVoucher(req, res);
    });
//Ruta donde se manda a verificar si un número de vales existe
router.get('/vales/num', (req, res) => {
    controller.ifExist(req, res);

});

//Ruta donde se manda a verificar si un número de vales existe
router.get('/vales/bills', (req, res) => {
    controller.getBills(req, res);

});

//Reporte de vales por vehículo
router.get('/vales/reporte_por_vehiculo', (req, res) => {
    /* controller.getAsignaciones(req, res); */
    controller_vehicle.getList1().then(vehicles => {
        res.render('./report_voucher.html', {
            vehicles: vehicles,
        });
    })
});


router.get('/vales/reporte_por_vehiculo/datos', (req, res) => {
    /* controller.getAsignaciones(req, res); */
    controller_assign.getVehiclesAssigned(req, res);
});
//Listadp de vales por vehículo 
/* router.get('/vales/get_asignaciones', (req, res) => {
}); */

module.exports = router;