const Routes = require("../models/m_route");
//const Drivers = require("../models/m_driver");
const Sequelize = require('sequelize');

var motoristas = ['José Hernández', 'José Martinez', 'José Gonzales', 'José Cortez'];

class Config_calendar_controller {

    constructor() {};

    async route_list() {
        return await Routes.findAll({
            order: Sequelize.literal('name ASC')
        });
    }

    async getList(req, res) {
        try {
            var route_list = await this.route_list();
            console.log(route_list);
            return res.render('../views/config_calendar/calendar_pages.html', {
                route_list
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getRouteConfig(req, res) {
        try {
            var route_list = await this.route_list();
            console.log(route_list);
            return res.render('../views/config_calendar/route_list.html', {
                route_list
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getRouteDriverConfig(req, res) {
        try {
            /* var drivers = await Drivers.findAll();  agregar motorista*/
            var route_list = await this.route_list();;
            return res.render('../views/config_calendar/route_driver_selection.html', {
                motoristas,
                route_list
            });
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = new Config_calendar_controller();