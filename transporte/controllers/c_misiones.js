const Mision = require('../models/m_mision');
const {
  validationResult
} = require('express-validator');

class Mision_controller {
  constructor() {}


  async getGestionar(req, res) {
    try {
      //Editar mision en la misma ruta
      //06102019_DD
      var Misi;
      let mis_id = req.query.mis_id;
      if (mis_id) {
        Misi = await Mision.findByPk(mis_id);
        return res.render('../views/mision/add.html', {
          Misi,
        });
      } else {
        Misi = await Mision.findByPk(mis_id);
        return res.render('../views/Mision/add.html', {
          Misi
        });
      };
    } catch (error) {
      console.log(error);
    }
  };

  //Gets mision list
  async getList(req, res) {
    try {
      var Misiones = await Mision.findAll({
        where: {
          active: 1
        }
      });
      return res.render('../views/mision/list.html', {
        Misiones
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new mision in the DB.
  //Última edición: 03/11/2019 - Axel Hernández
  async createMision(req, res) {
    try {
      const errors = validationResult(req);
      let {
        name,
      } = req.body;
      //Para enviar si hay error
      //06102019_DD
      var mis = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new Address
        res.render('../views/mision/add.html', {
          mis,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Mision.create({
          name,
          procuraduria_id: 3
        });
        res.redirect('/misiones');
      }
    } catch (error) {
      console.log(error);
    };
  };

  //Saves the edited Mision in the DB
  async updateMision(req, res) {
    try {
      const errors = validationResult(req);
      let {
        Misi_id,
        name,
      } = req.body;
      let mis = await Mision.findByPk(Misi_id);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the edited Address
        res.render('../views/mision/edit.html', {
          mis,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Mision.update({
          name: name
        }, {
          where: {
            id: Misi_id
          }
        });
        res.redirect('/misiones');
      };
    } catch (error) {
      console.log(error);
    }
  };
  async deleteMisiones(req, res) {
    try {
      let Misi_id = req.query.mis_id;
      console.log(Misi_id);
      await Mision.update({
        active: 0
      }, {
        where: {
          id: Misi_id
        }
      });
      res.redirect('/misiones');
    } catch (error) {
      res.redirect('/misiones');
    }
  };
};



module.exports = new Mision_controller();