const Departamento = require('../models/m_department');

class Department_controller {
  constructor() {}
  //Gets departments list
  async getList() {
    try {
      return await Departamento.findAll();
    } catch (error) {
      console.log(error);
    }
  };
  async getName(id) {
    var name;
    await Departamento.findAll({
      where: {
        id: id
      },
      attributes: ['name'],
    }).then(dpto => {
      //console.dir("DEPARTAMENTO" + JSON.stringify(dpto[0].name));
      name = dpto[0].name;
    });
    return name;
  }

};

module.exports = new Department_controller();