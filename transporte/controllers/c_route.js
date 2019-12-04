const Route = require('../models/m_route');
const route_conditions = require('../models/m_route_conditions');
const Sequelize = require ('sequelize');
const {
  validationResult
} = require('express-validator');


class Route_controller {
  constructor() {}

  async getRouteList() {
    return await Route.findAll({
      order: Sequelize.literal('id ASC')
    });
  }


  //Gets routes list
  async getRouteList(req, res) {
    try {
      var Routes = await Route.findAll({
        order: Sequelize.literal('id ASC')
      });
      return Routes
    } catch (error) {
      console.log(error);
    }
  };

  //Gets routes list
  async getList(req, res) {
    try {
      var Routes = await Route.findAll({
        order: Sequelize.literal('id ASC')
      });
      return res.render('../views/route/list.html', {
        Routes
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Muestra formulario para creación/edición
  async getGestionar(req, res) {
    try {
      let Ruta;
      let route_id = req.query.route_id; //Si viene del ícono de edición se recupera el id
      if(route_id){
        Ruta = await Route.findByPk(route_id); //Se obtiene la ruta con el id provisto
        //Se obtienen las condiciones relacionadas con la ruta obtenida
        let Condiciones = await route_conditions.findByPk(Ruta.route_conditions_id);
        return res.render('../views/route/add.html', {
          Ruta,
          Condiciones
        }); //Renderiza formulario editar
      } else {
        Ruta = await Route.findByPk(route_id); //Se obtiene un objeto nulo
        return res.render('../views/route/add.html', {
          Ruta
        }); //Renderiza formulario agregar
      }
    } catch (error) {
      console.log(error);
    };
  };

  //Saves the new route in the DB.
  async createRoute(req, res) {
    try {
      //Se llena variable con los resultados de la validación
      const errors = validationResult(req);
      let {
        name,
        monday,
        monday_frequency,
        tuesday,
        tuesday_frequency,
        wednesday,
        wednesday_frequency,
        thursday,
        thursday_frequency,
        friday,
        friday_frequency,
        saturday,
        saturday_frequency,
        sunday,
        sunday_frequency,
        enabled
      } = req.body; //Se obtienen variables del cuerpo de la petición
      //Si el valor obtenido de los checkbox es 'on' se cambia a 'true' para ser almacenado en la BD.
      //Un 'true' indica que ese día sí se brindará servicio.
      //Caso contrario se cambia a 'false' indicando que ese día no se brindará servicio a la ruta.
      //En este caso la cantidad de motoristas se cambia a 0.
      if (monday == 'on') {
        monday = true;
      } else {
        monday = false;
        monday_frequency = 0;
      };
      if (tuesday == 'on') {
        tuesday = true;
      } else {
        tuesday = false;
        tuesday_frequency = 0;
      };
      if (wednesday == 'on') {
        wednesday = true;
      } else {
        wednesday = false;
        wednesday_frequency = 0;
      };
      if (thursday == 'on') {
        thursday = true;
      } else {
        thursday = false;
        thursday_frequency = 0;
      };
      if (friday == 'on') {
        friday = true;
      } else {
        friday = false;
        friday_frequency = 0;
      };
      if (saturday == 'on') {
        saturday = true;
      } else {
        saturday = false;
        saturday_frequency = 0;
      };
      if (sunday == 'on') {
        sunday = true;
      } else {
        sunday = false;
        sunday_frequency = 0;
      };
      //Para saber si la ruta estándar se encuentra habilitada o deshabilitada
      if (enabled == 'on') {
        enabled = true;
      } else {
        enabled = false;
      };
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        res.render('../views/route/add.html', {
          name,
          errors: errors.array()
        });
      } else {
        console.log(req.body); //Impresión del cuerpo de la petición
        //Guardado en la BD de las condiciones de la ruta
        var conditions = await route_conditions.create({
          monday,
          monday_frequency,
          tuesday,
          tuesday_frequency,
          wednesday,
          wednesday_frequency,
          thursday,
          thursday_frequency,
          friday,
          friday_frequency,
          saturday,
          saturday_frequency,
          sunday,
          sunday_frequency,
        });
        //Guardado en BD de la ruta estándar
        Route.create({
          name,
          enabled,
          route_conditions_id: conditions.id,
        });
        res.redirect('/rutas'); //Redirecciona al listado de rutas estándar
      }
    } catch (error) {
      console.log(error); //Muestra errores si los hubiera.
    };
  };

  //Saves the edited route in the DB.
  async updateRoute(req, res) {
    try {
      //Se llena variable con los resultados de la validación
      const errors = validationResult(req);
      let {
        name,
        monday,
        monday_frequency,
        tuesday,
        tuesday_frequency,
        wednesday,
        wednesday_frequency,
        thursday,
        thursday_frequency,
        friday,
        friday_frequency,
        saturday,
        saturday_frequency,
        sunday,
        sunday_frequency,
        enabled,
        route_id,
        route_conditions_id,
      } = req.body; //Se obtienen variables del cuerpo de la petición
      //Si el valor obtenido de los checkbox es 'on' se cambia a 'true' para ser almacenado en la BD.
      //Un 'true' indica que ese día sí se brindará servicio.
      //Caso contrario se cambia a 'false' indicando que ese día no se brindará servicio a la ruta.
      //En este caso la cantidad de motoristas se cambia a 0.
      if (monday == 'on') {
        monday = true;
      } else {
        monday = false;
        monday_frequency = 0;
      };
      if (tuesday == 'on') {
        tuesday = true;
      } else {
        tuesday = false;
        tuesday_frequency = 0;
      };
      if (wednesday == 'on') {
        wednesday = true;
      } else {
        wednesday = false;
        wednesday_frequency = 0;
      };
      if (thursday == 'on') {
        thursday = true;
      } else {
        thursday = false;
        thursday_frequency = 0;
      };
      if (friday == 'on') {
        friday = true;
      } else {
        friday = false;
        friday_frequency = 0;
      };
      if (saturday == 'on') {
        saturday = true;
      } else {
        saturday = false;
        saturday_frequency = 0;
      };
      if (sunday == 'on') {
        sunday = true;
      } else {
        sunday = false;
        sunday_frequency = 0;
      };
      //Para saber si la ruta estándar se encuentra habilitada o deshabilitada
      if (enabled == 'on') {
        enabled = true;
      } else {
        enabled = false;
      };
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        let Ruta = await Route.findByPk(route_id);
        let Condiciones = await route_conditions.findByPk(Ruta.route_conditions_id);
        res.render('../views/route/add.html', {
          Ruta,
          Condiciones,
          errors: errors.array()
        });
      } else {
        console.log(req.body); //Impresión del cuerpo de la petición
        //Actualización en la BD de las condiciones de la ruta
        route_conditions.update({
          monday,
          monday_frequency,
          tuesday,
          tuesday_frequency,
          wednesday,
          wednesday_frequency,
          thursday,
          thursday_frequency,
          friday,
          friday_frequency,
          saturday,
          saturday_frequency,
          sunday,
          sunday_frequency,
        }, {
          where: {
            id: route_conditions_id
          }
        });
        //Actualización en la BD de la ruta estándar
        Route.update({
          name,
          enabled,
          route_conditions_id
        }, {
          where: {
            id: route_id
          }
        });
        res.redirect('/rutas'); //Redirecciona al listado de rutas estándar
      };
    } catch (error) {
      console.log(error); //Muestra errores si los hubiera.
    };
  };
};

module.exports = new Route_controller();