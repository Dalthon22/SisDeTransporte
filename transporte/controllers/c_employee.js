const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Employee = require('../models/m_employee');

/* const Migration = require('../models/migrations');
 */
const {
    body,
    check,
    validationResult
} = require('../middleware/expresse-validator');

class employee_controllers {
    constructor() {
        //var migrate = new Migration();
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
};

module.exports = new employee_controllers();