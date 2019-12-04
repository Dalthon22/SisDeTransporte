const Procuraduria = require('../models/m_procuraduria');
const Address = require('../models/m_address');
const Departamento = require('../controllers/c_department');
const {
  validationResult
} = require('express-validator');

class Procuraduria_controller {
  constructor() { }


  async getGestionar(req, res) {
    try {
      //Editar procu en la misma ruta
      //06102019_DD
      var Procu;
      let procu_id = req.query.procu_id;
      if (procu_id) {
        Procu = await Procuraduria.findByPk(procu_id);
        let Dir = await Address.findByPk(Procu.address_id);
        let detail = Dir.detail;
        let departamento = Dir.department_id;
        let municipio = Dir.city_id;
        let Departamentos = await Departamento.getList();
        return res.render('../views/procuraduria/add.html', {
          Procu,
          detail,
          departamento,
          municipio,
          Departamentos
        });
      } else {
        Procu = await Procuraduria.findByPk(procu_id);
        let Departamentos = await Departamento.getList();
        return res.render('../views/procuraduria/add.html', {
          Departamentos,
          Procu
        });
      };
    } catch (error) {
      console.log(error);
    }
  };

  //Gets procuradurías list
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
  //Última edición: 15/11/2019 - Axel Hernández
  async createProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        name,
        detail,
        departamento,
        municipio,
        enabled
      } = req.body;
      if(enabled == 'on'){
        enabled = true;
      } else {
        enabled = false;
      };
      //Para enviar si hay error
      //06102019_DD
      var Procu = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new Address
        res.render('../views/procuraduria/add.html', {
          Procu,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        var dir = await Address.create({
          detail,
          city_id: municipio,
          department_id: departamento
        });
        Procuraduria.create({
          name,
          enabled,
          address_id: dir.id
        });
        res.redirect('/instituciones');
      }
    } catch (error) {
      console.log(error);
    };
  };

  //Saves the edited procuraduria in the DB
  async updateProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        procu_id,
        name,
        detail,
        departamento,
        municipio
      } = req.body;
      let Procu = await Procuraduria.findByPk(procu_id);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the edited Address
        res.render('../views/procuraduria/add.html', {
          Procu,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Address.update({
          detail,
          city_id: municipio,
          department_id: departamento
        }, {
          where: {
            id: Procu.address_id
          },
        });
        Procuraduria.update({
          name: name
        }, {
          where: {
            id: procu_id
          }
        });
        res.redirect('/instituciones');
      };
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports = new Procuraduria_controller();