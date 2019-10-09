const db = require('../dbconfig/conex');
const Route = require('../models/m_route');
const department_controller = require('../controllers/c_department');
const express = require('express');
const Sequelize = require('sequelize');
const {
  validationResult
} = require('express-validator');


class Route_controller {
  constructor() {}

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

  //Gets departments list and renders add form
  async getAdd(req, res) {
    try {
      return res.render('../views/route/add.html');
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new procuraduría in the DB.
  async createRoute(req, res) {
    try {
      const errors = validationResult(req);
      let {
        name,
      } = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        res.render('../views/route/add.html', {
          name,
          errors: errors.array()
        });

      } else {
        console.log(req.body);
        Route.create({
          name
        });
        res.redirect('/rutas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Gets departments list and renders edit form
  async getUpdate(req, res) {
    try {
      let route_id = req.query.route_id;
      console.log(route_id);
      let Ruta = await Route.findByPk(route_id);
      return res.render('../views/route/edit.html', {
        Ruta
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the edited route in the DB.
  async updateRoute(req, res) {
    try {
      const errors = validationResult(req);
      let {
        route_id,
        name,
      } = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        let Ruta = await Route.findByPk(route_id);
        res.render('../views/route/edit.html', {
          Ruta,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Route.update({
          name: name,
        }, {
          where: {
            id: route_id
          }
        });
        res.redirect('/rutas');
      }
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports = new Route_controller();