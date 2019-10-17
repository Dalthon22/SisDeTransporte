const routes_controller = require("./c_route");


class config_calendar_controller {

    constructor() {};

    async getList(req, res) {
        try {
            var route_list = await routes_controller.getRouteList();
            return res.render('../views/config_Calendar.html', {
                route_list
            });
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = new config_calendar_controller();