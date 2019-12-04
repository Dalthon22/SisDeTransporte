const Driver = require('../models/m_driver');
const {
    validationResult
} = require('express-validator');
var moment = require('moment');
moment.locale("Es-SV");
class driver_controller {
    constructor() {}

    async getList(req, res) {
        try {
            var helper = await Driver.findAll({
                where: {
                    active: 1
                }
            });
            var motoristas = [];
            helper.forEach(element => {
                var motorista = new Object();
                motorista.id = element.id;
                motorista.first_name = element.first_name;
                motorista.last_name = element.last_name;
                motorista.driver_license = element.driver_license;
                motorista.license_type = element.license_type;
                motorista.license_due_date = moment.utc(element.license_due_date).format("MM/YYYY");
                motoristas.push(motorista);
            });
            return res.render('../views/driver/list.html', {
                motoristas
            });
        } catch (error) {
            console.log(error);
        }
    };

    async getAdd(req, res) {
        try {
            const meses = this.getMonthList();
            const tipos = this.getLicenseType();
            var año_actual = moment().year();
            var driver_id = req.query.driver_id;
            var helper;
            var driver = new Object();
            if (driver_id) {
                helper = await Driver.findByPk(driver_id);
                driver.id = helper.id;
                driver.first_name = helper.first_name;
                driver.last_name = helper.last_name;
                driver.license_type = helper.license_type;
                driver.driver_license = helper.driver_license;
                driver.fechaIngreso = moment.utc(helper.birth_date, "YYYY-MM-DD").format("DD/MMMM/YYYY");
                console.log(driver.fechaIngreso);
                var mes = moment.utc(helper.license_due_date).format("MMMM");
                driver.license_month = mes.charAt(0).toUpperCase() + mes.slice(1);
                driver.license_year = moment.utc(helper.license_due_date).format("YYYY");
            }
            return res.render('../views/driver/add.html', {
                driver,
                meses,
                tipos,
                año_actual
            })
        } catch (error) {
            console.log(error);
        }
    };

    async createDriver(req, res) {
        try {
            const errors = validationResult(req);
            let {
                driver_license,
                license_type,
                month,
                anio,
                calendar1,
                first_name,
                last_name
            } = req.body;
            var driver = new Object();
            driver.first_name = first_name;
            driver.last_name = last_name;
            driver.license_type = license_type;
            driver.driver_license = driver_license;
            driver.license_month = month;
            driver.license_year = anio;
            driver.fechaIngreso = calendar1;
            driver.birth_date = moment(calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            driver.license_due_date = moment().year(anio).month(month).format("YYYY-MM-DD");
            const meses = this.getMonthList();
            const tipos = this.getLicenseType();
            var año_actual = moment().year();
            if (!errors.isEmpty()) {
                res.render('../views/driver/add.html', {
                    driver,
                    meses,
                    tipos,
                    año_actual,
                    errors: errors.array()
                });
            } else {
                try {
                    await Driver.create({
                        first_name: driver.first_name,
                        last_name: driver.last_name,
                        birth_date: driver.birth_date,
                        driver_license: driver.driver_license,
                        license_type: driver.license_type,
                        license_due_date: driver.license_due_date,
                        active: 1,
                        procuraduria_id: 3, //Sesion.get(#ProcuID);
                    });
                    res.redirect('/motoristas');
                } catch (errors) {
                    console.log(errors);
                    res.render('../views/driver/add.html', {
                        meses,
                        tipos,
                        año_actual,
                        error
                    });
                }

            }
        } catch (error) {
            console.log(error);
        }
    };
    async updateDriver(req, res) {
        try {
            const errors = validationResult(req);
            let {
                driver_license,
                license_type,
                month,
                anio,
                calendar1,
                first_name,
                last_name,
                driver_id
            } = req.body;
            var driver = new Object();
            driver.driver_id = driver_id;
            driver.first_name = first_name;
            driver.last_name = last_name;
            driver.license_type = license_type;
            driver.driver_license = driver_license;
            driver.license_month = month;
            driver.license_year = anio;
            driver.fechaIngreso = calendar1;
            driver.birth_date = moment(calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            driver.license_due_date = moment().year(anio).month(month).format("YYYY-MM-DD");
            const meses = this.getMonthList();
            const tipos = this.getLicenseType();
            var año_actual = moment().year();
            if (!errors.isEmpty()) {
                res.render('../views/driver/add.html', {
                    driver,
                    meses,
                    tipos,
                    año_actual,
                    errors: errors.array()
                });
            } else {
                try {
                    await Driver.update({
                        first_name: driver.first_name,
                        last_name: driver.last_name,
                        birth_date: driver.birth_date,
                        driver_license: driver.driver_license,
                        license_type: driver.license_type,
                        license_due_date: driver.license_due_date,
                    }, {
                        where: {
                            id: driver.driver_id
                        }
                    });
                    res.redirect('/motoristas');
                } catch (error) {
                    console.log(error);
                    error = 'Error al ingresar a la base.';
                    res.render('../views/motoristas/add.html', {
                        driver,
                        meses,
                        tipos,
                        año_actual,
                        error
                    });
                }

            }
        } catch (error) {
            console.log(error);
        }
    };
    async deleteMotorista(req, res) {
        try {
            let motorista_id = req.query.motorista_id;
            console.log(motorista_id);
            await Driver.update({
                active: 0
            }, {
                where: {
                    id: motorista_id
                }
            });
            res.redirect('/motoristas');
        } catch (error) {
            res.redirect('/motoristas');
        }
    }

    getMonthList() {
        let month_map = new Map();
        month_map.set('Enero', 'Enero').set('Febrero', 'Febrero').set('Marzo', 'Marzo').set('Abril', 'Abril').set('Mayo', 'Mayo').set('Junio', 'Junio').set('Julio', 'Julio').set('Agosto', 'Agosto').set('Septiembre', 'Septiembre').set('Octubre', 'Octubre').set('Noviembre', 'Noviembre').set('Diciembre', 'Diciembre');
        return month_map.entries();
    }
    getLicenseType() {
        let license_type_map = new Map();
        license_type_map.set('Particular', 'Particular').set('Liviana', 'Liviana').set('Pesada', 'Pesada').set('Pesada-T', 'Pesada-T');
        return license_type_map.entries();
    }
}

module.exports = new driver_controller();