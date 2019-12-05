/*
21062019_DD
Controlador del modelo Vehicle
*/

const Vehicle = require('../models/m_vehicle');
const Sequelize = require('sequelize');
const querystring = require('querystring');
const url = require('url');
const {
    validationResult
} = require('express-validator');

//Clase controller que contiene todos los metodos necesarios para la gestion
//de vehiculos
class Vehicle_controller {
    constructor() {

    }

    //Metodo que inicializa el los estados de los vehiculos
    getStateList() {
        let states_map = new Map();
        states_map.set('Funcional', 'Funcional').set('Mantenimiento', 'En Mantenimiento').set('Dañado', 'Dañado');
        return states_map.entries();
    }

    //Encuntra un registro por el id
    //Parametro: _id Llave primaria de la tabla
    async findById(_id) {
        let vehicle = await Vehicle.findByPk(_id);
        return vehicle;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _id Llave primaria de la tabla
    async existById(_id) {
        let vehicle = await Vehicle.findByPk(_id);
        let exist = (vehicle) ? true : false;
        return exist;
    }

    //Encuntra un registro por el placa
    //Parametro: _plate Campo único en la tabla
    async findByPlate(_plate) {
        let vehicle = await Vehicle.findOne({
            where: {
                plate: _plate
            }
        })
        return vehicle;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _plate Campo único en la tabla
    async existByPlate(_plate) {
        let vehicle = await Vehicle.count({
            where: {
                plate: _plate
            }
        });
        console.log(vehicle);
        let is_registered = (vehicle >= 1) ? true : false;
        console.log(is_registered);
        return is_registered;
    }

    //Valida la existencia de un vehiculo por su placa y envia una respuesta
    //Parametro: _plate (matircula)
    async existsResponse(_plate, req, res) {
        try {
            if (!await this.existByPlate(_plate)) {
                res.send({
                    type: 0,
                    message: "El número de matrícula: " + _plate + " es valido"
                });
            } else {
                console.log('Error. Ya existe la placa: ' + _plate);
                res.send({
                    type: 1,
                    message: "El número de matrícula: " + _plate + " ya está asociada a un vehículo."
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Obtiene todos los reguistros almacenados en la tabla
    async getList(req, res) {
        try {
            var vehicles = await Vehicle.findAll({
                order: Sequelize.literal('plate ASC')
            });
            console.log(vehicles);
            return res.render('../views/vehicle/list.html', {
                vehicles
            });
        } catch (Error) {
            console.log(Error)
        }
    }


    //Obtiene todos los reguistros almacenados en la tabla
    async getList1() {
        try {
            var lista = [];
            var vehicles = await Vehicle.findAll({
                order: Sequelize.literal('plate ASC'),
                state: "Funcional"
            });
            vehicles.forEach(v => {
                var e = new Object();
                e.id = v.id;
                e.plate = v.plate;
                e.brand = v.brand;
                e.model = v.model;
                lista.push(e);
            });
            /* return res.send({
                vehicles: lista
            }); */
            return lista;
        } catch (Error) {
            console.log(Error)
        }
    }

    //Renderiza el formulario de ingreso de vehiculo
    //Para editar o ingresar un nuevo vehiculo
    async getCreate(req, res) {
        try {
            const states = this.getStateList();
            var plate = req.query.matricula;
            var vehicle;
            console.log(plate);
            if (plate) {
                vehicle = await this.findByPlate(plate);
            }
            return res.render('../views/vehicle/create.html', {
                states,
                vehicle
            })
        } catch (error) {
            console.log("Error en getCreate" + error)
        }
    }

    //Metodo que inserta el nuevo vehiculo. Post gestionar
    //Recibe los parametros request y response, respectivamente
    async create(req, res) {
        try {
            const errors = validationResult(req);
            const states = this.getStateList();
            let {
                brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
            } = req.body;
            let vehicle = req.body;
            if (errors.isEmpty() && !await this.existByPlate(plate)) {
                await Vehicle.create({
                    brand,
                    chassis,
                    model,
                    engine,
                    plate,
                    state,
                    seats,
                });
                const query = querystring.stringify({
                    title: "Guardado exitoso",
                    message: "Vehiculo registrado",
                    class: "success"
                });
                res.send({
                    redirect: "/vehiculos?&" + query,
                    status: 200
                });
            } else {
                res.render('../views/vehicle/create.html', {
                    errors: errors.array(),
                    states,
                    vehicle,
                    plate_error: "El número de placa ya ha sido vinculada a otro vehículo"
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                type: 1,
                title: "Error al guardar",
                message: "El vehículo no pudo ser guardado. " + error,
            });
        }
    }

    //Metodo que actualiza el nuevo vehiculo. Post gestionar
    //Recibe los parametros request y response, respectivamente
    async update(req, res) {
        try {
            const errors = validationResult(req);
            const states = this.getStateList();
            let {
                brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
                vehicle_id,
            } = req.body;
            let vehicle = req.body;
            if (errors.isEmpty()) {
                await Vehicle.update({
                    brand,
                    chassis,
                    model,
                    engine,
                    plate,
                    state,
                    seats,
                }, {
                    where: {
                        id: vehicle_id
                    }
                });
                const query = querystring.stringify({
                    title: "Guardado exitoso",
                    message: "Vehiculo actualizado",
                    class: "success"
                });
                res.send({
                    redirect: "/vehiculos?&" + query,
                    status: 200
                });
            } else {
                res.render('../views/vehicle/create.html', {
                    errors: errors.array(),
                    states,
                    vehicle,
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                type: 1,
                title: "Error al actualizar",
                message: "El vehículo no pudo ser guardado. " + error,
            });
        }
    }
};

module.exports = new Vehicle_controller();