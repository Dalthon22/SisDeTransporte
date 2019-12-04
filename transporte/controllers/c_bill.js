const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Voucher = require('../models/m_voucher');
const FacturaCompra = require('../models/m_bill')
//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")
/* const Migration = require('../models/migrations');
 */
const {
    body,
    check,
    validationResult
} = require('../middleware/expresse-validator');
/*  < td > num_voucher < /td> <
     td > price < /td> <
     td > condition < /td> <
     td > voucher_provider < /td> <
     td > num_entry_bill < /td> <
     td > date_entry_bill < /td> <
     td > num_close_bill < /td> <
     td > date_close_bill < /td> */

/*Estados para los vales si Disponible cuando recien se ingrese a la procuraduría,En espera cuando ya este asignado a una procuraduria 
pero a la espera de un viaje, Asignado: cuando ya tenga un viaje asignado, Liquidado cuando ya se haya ingresado al sistema el numero de factura
con el cual se liquidó
*/
var states = ["Disponible", "En espera", "Asignado", "Liquidado"];

class bill_controllers {

    constructor() {
        //var migrate = new Migration();
    }

    async vouchersPerBills(bill_num) {
        console.log("voy llegando")
        var cant_voucher;
        await Voucher.count({
            where: {
                num_entry_bill: bill_num
            }
        }).then(count => {
            console.log(count + "Del tipo" + typeof (count))
            cant_voucher = count;
        });
        return cant_voucher;
    }

}

module.exports = new bill_controllers();