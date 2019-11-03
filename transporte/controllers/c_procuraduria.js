const Procuraduria = require('../models/m_procuraduria');
const Address = require('../models/m_address');
const Departamento = require('../controllers/c_department');
const {
  validationResult
} = require('express-validator');

class Procuraduria_controller {
  constructor() {}
  //Gets procuradurías list

  async getGestionar(req, res) {
    try {
      let Departamentos = await Departamento.getList();
      console.log(Departamentos);
      return res.render('../views/procuraduria/add.html', {
        Departamentos
      });
    } catch (error) {
      console.log(error);
    }

  };

  async getList(req, res) {
    try {
      var Procuradurias = await Procuraduria.findAll();
      return res.render('../views/procuraduria/list.html', {
        Procuradurias
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new procuraduría in the DB.
  async createProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        name,
      } = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new Address
        res.render('../views/procuraduria/add.html', {
          name,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Procuraduria.create({
          name,
        });
        res.redirect('/instituciones');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Renders edit form
  async getUpdate(req, res) {
    try {
      let procu_id = req.query.procu_id;
      console.log(procu_id);
      let Procu = await Procuraduria.findByPk(procu_id);
      return res.render('../views/procuraduria/edit.html', {
        Procu
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the edited procuraduria in the DB
  async updateProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        procu_id,
        name,
      } = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the edited Address
        let Procu = await Procuraduria.findByPk(procu_id);
        res.render('../views/procuraduria/edit.html', {
          Procu,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Procuraduria.update({
          name: name
        }, {
          where: {
            id: procu_id
          }
        });
        res.redirect('/instituciones');
      }
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports = new Procuraduria_controller();