const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Voucher = require('../models/m_voucher');
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

class voucher_controllers {
    constructor() {
        //var migrate = new Migration();
    }

    async ifExist(numVoucher, req, res) {
        console.log("Desde router recibi este numero de vale: " + numVoucher);
        var b = false;
        var num = parseInt(numVoucher);
        console.log("Numero de vale que se buscara: " + num);
        try {
            console.log("Voy a buscar")
            let v = await Voucher.count({
                where: {
                    num_voucher: num
                }
            });
            console.log("Ya busque we, y me salen: " + v);
            b = (v >= 1) ? true : false;
            console.log("Ya te mando a buscar desde router el vale: " + num);
            console.log("B es igual: " + b)
            if (b === true) {
                console.log("Si we la rego la doña");
                res.send({
                    type: 1,
                    message: "El vale numero: " + num + " ya ha sido registrado"
                });
                throw new Error('El numero de vale ya ha se registro');
            } else {
                console.log("Esta limpio, por esta vez...");
                res.send({
                    type: 0,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    //Metodo find por id
    static async findById(num_voucher) {
        let voucher = await Car.findByPk(num_voucher);
        return voucher;
    }

    async getList(req, res) {
        try {
            var vouchers = await Voucher.findAll({
                attributes: ['num_voucher', 'price', 'condition', 'voucher_provider', 'num_entry_bill', 'date_entry_bill', 'num_close_bill', 'date_close_bill'],
            });
            var data = [];
            vouchers.forEach((row, i) => {
                var el = new Object();
                el.num_voucher = row.num_voucher;
                el.price = row.price;
                el.condition = row.condition;
                el.voucher_provider = row.voucher_provider;
                el.num_entry_bill = row.num_entry_bill;
                el.date_entry_bill = moment.utc(row.date_entry_bill).format("DD/MM/YYYY");
                if (row.num_close_bill) {
                    el.num_close_bill = row.num_close_bill;
                    el.date_close_bill = moment.utc(row.date_close_bill).format("DD/MM/YYYY");
                } else {
                    el.num_close_bill = "Sin liquidar";
                    el.date_close_bill = "-----";
                }
                data.push(el);
            });
            res.send({
                data: data
            });
        } catch (error) {
            console.log(error);
        }
    };

    async createVoucher(req, res) {
        var primer, ultimo;
        var date;

        try {
            const errors = validationResult(req);

            let {
                date_entry_bill,
                bill_num,
                provider,
                price,
                first_voucher,
                last_voucher,
            } = req.body;
            //Conversion al formato permitido por sequelize YYYY-MM-DD
            date = new Date(date_entry_bill.slice(-4) + '-' +
                date_entry_bill.substring(3, 5) + '-' + date_entry_bill.substring(0, 2));
            primer = parseInt(first_voucher);
            ultimo = parseInt(last_voucher);
            console.log(errors.array());
            if (!errors.isEmpty()) {
                console.log("Aqui vengo con mi flow");
                res.render('../views/frequent_places/add.html', {
                    date_entry_bill,
                    bill_num,
                    provider,
                    price,
                    first_voucher,
                    last_voucher,
                    errors: errors.array()
                });
            } else {
                console.log("Estoy en el else del create");
                do {
                    await Voucher.create({
                        num_voucher: primer,
                        price,
                        condition: "Disponible",
                        date_entry: date,
                        voucher_provider: provider,
                        num_entry_bill: bill_num,
                        date_entry_bill: date,
                    });
                    primer++;
                }
                while (primer <= ultimo);
                console.log(primer);
                console.log(ultimo);
                //Departamento
                console.log("sali del create");

                res.json({
                    message: "Datos agregados con exito",
                    type: 0
                });
            }
        } catch (err) {
            console.log("Ocurrio en el método create" + err);
            res.send({
                title: "Error al guardar los datos",
                message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                message1: "Error al ingresar el vale No: " + primer,
                type: 1
            });
            //throw new Error(" Ocurre ingresando los vales en la BD " + err);
        }
    }
};

module.exports = new voucher_controllers();