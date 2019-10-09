const express = require('express')
const router = express.Router();;
const controller = require('../controllers/c_voucher');
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
router.get('/vales/:num',
    (req, res) => {
        const num = req.params.num;
        controller.ifExist(num, req, res);
    });

module.exports = router;