const Municipios = require('../models/m_city');
const Departamento = require('../models/m_department');


class City_controller {
  constructor() {}
  //Gets municipios list
  getAll() {
    return Municipios.findAll();
  };

  //Gets a municipios list based on department_id
  async getMunicipios(selectedDepartamento) {
    try {
      return await Municipios.findAll({
        where: {
          department_id: selectedDepartamento
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  async getName(id) {
    var name;
    await Municipios.findAll({
      where: {
        id: id
      },
      attributes: ['name'],
    }).then(city => {
      //console.dir("MUNIICIPIO" + JSON.stringify(city[0].name));
      name = city[0].name;
    });
    //console.log("MUNICIPIO" + name);
    return name;
  }




};

module.exports = new City_controller();