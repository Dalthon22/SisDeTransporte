const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Employee = require('../models/m_employee');
const User = require('../models/m_user');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

/* const Migration = require('../models/migrations');
 */
const {
    body,
    check,
    validationResult
} = require('express-validator');

class employee_controller {
    constructor() {

    }
    //Metodo find por id
    async findById(id, req, res) {
        try {
            let emp = await Employee.findByPk(id, {
                attributes: ['id', 'first_name', 'last_name', 'is_unit_boss']
            });
            console.log("El empleado recibido" + emp);

            res.send({
                emp
            });
        } catch (err) {
            console.log(err);
        }
    }

    async findById1(id) {
        try {
            var emp = new Object();
            await Employee.findByPk(id, {
                attributes: ['id', 'first_name', 'last_name', 'is_unit_boss', ]
            }).then(employee => {
                //    console.log("El empleado recibido" + employee + " De tipo " + typeof (employee));
                emp.id = employee.id;
                emp.first_name = employee.first_name;
                emp.last_name = employee.last_name;
                emp.is_unit_boss = employee.is_unit_boss;
            });


            //console.dir("Empleado FINAL RESULT : " + JSON.stringify(emp));
            return emp;
        } catch (err) {
            console.log(err);
        }
    }

    async getList(req, res) {
        try {
            var emps = await Employee.findAll({
                include: [User],
                order: Sequelize.literal('id ASC')
            });
            var employees = [];
            emps.forEach((record) => {
                var user = new Object();
                user.id = record.id;
                user.name = record.first_name + ' ' + record.last_name;
                user.email = record.SGT_Usuario.email;
                user.active = record.SGT_Usuario.active;
                user.created_at = moment.utc(record.created_at).format("DD/MM/YYYY h:mm A");
                employees.push(user);
            })
            console.log(employees);
            return res.render('../views/employee/list.html', {
                employees
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getAdd(req, res) {
        try {
            var employee;
            var employee_id = req.query.user_id;
            console.log(employee_id);
            if (employee_id) {
                employee = await Employee.findOne({
                    where: {
                        id: employee_id
                    },
                    include: [User]
                });
            }
            console.log(employee);
            return res.render('../views/employee/add.html', {
                employee
            });
        } catch (error) {
            console.log("Error en getCreate" + error)
        }
    }

    async updateEmployee(req, res) {

    }

    async createEmployee(req, res) {
        try {
            const errors = validationResult(req);
            let {
                first_name,
                last_name,
                email,
                password,
                active,
                roles,
            } = req.body;
            var emp = new Object();
            emp.first_name = first_name;
            emp.last_name = last_name;
            emp.email = email;
            emp.password = password;
            emp.active = active;
            emp.roles = roles;
            console.log(emp);
            if (!errors.isEmpty()) {
                console.log("Aqui");
                res.redirect('/empleados/gestionar');
            } else {
                try {
                    console.log("al crear");
                    await User.create({
                        email: emp.email,
                        password: emp.password,
                        active: emp.active
                    }).then(function (m) {
                        emp.user_id = m.null;
                        console.log(m.null);
                        console.log(emp.user_id);
                    });
                    console.log("al crear 2");
                    await Employee.create({
                        first_name: emp.first_name,
                        last_name: emp.last_name,
                        is_unit_boss: false,
                        id_boss: 1,
                        user_id: emp.user_id
                    });
                    res.redirect('/empleados');
                } catch (errors) {
                    console.log(errors);
                    res.redirect('/empleados/gestionar');
                }

            }
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = new employee_controller();