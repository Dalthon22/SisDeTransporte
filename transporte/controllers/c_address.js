const Address = require('../models/m_address');
const place_container = require('../models/m_places_container');
const department_controller = require('../controllers/c_department');
const municipio_controller = require('../controllers/c_city');
const express = require('express');
const Sequelize = require('sequelize');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")


const {
  validationResult
} = require('express-validator');

class address_services {
  constructor() {}
  //Gets Addresses list
  async getList(req, res) {
    try {
      var Direcciones = await Address.findAll({
        include: ['city', 'department']
      });
      return res.render('../views/address/list.html', {
        Direcciones
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Gets Departments List
  async getDepartmentList(req, res) {
    try {
      let Departamentos = await department_controller.getList();
      return res.render('../views/address/add.html', {
        Departamentos
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Gets Municipios list based on the selected department
  async getMunicipiosByDepartamento(req, res) {
    try {
      let selectedDepartamento = req.query.selectedDepartamento;
      let municipios = await municipio_controller.getMunicipios(selectedDepartamento);
      res.send(municipios);
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new address in the DB.
  async createAddress(req, res) {
    try {
      console.log("ID DEL LUGAR FRECUENTE" + req.query.fplace_id)
      let dir; //Creo variable que contendrá el objeto Dirección
      //Si no es lugar frecuete se crea la direccion de lo contrario se enlazará el id del lugar frecuente con el folo en la tabla place_container
      if (!req.query.fplace_id) {
        let {
          idSelDepto,
          idSelMun,
          selectedPlace,
          destinyPlace,
          direction,
          selectedPlaceTxt
        } = req.body //Saco los atributos del cuerpo de la petición
        console.log(req.body); //Imprimo la petición para comprobar los datos.
        if (selectedPlace != 10000) {
          //Si el lugar seleccionado es diferente de "Otro", solo guardará los valores de los dropdown
          dir = await Address.create({
            name: selectedPlaceTxt,
            city_id: idSelMun, //Creo dirección
            department_id: idSelDepto
          });


        } else { //De lo contrario guardará depto y municipio del dropdown; nombre y dirección de los inputs.
          console.log("GUARDAR DIRECCION")
          dir = await Address.create({
            name: destinyPlace,
            detail: direction, //Creo dirección
            city_id: idSelMun,
            department_id: idSelDepto
          });
          if (req.query.folo_id) {
            await place_container.create({
              folo_id: req.query.folo_id,
              date_of_visit: moment(),
              address_id: dir.id
            });
          }
        };
      } else {
        console.log("LUGAR FRECUENTE")
        if (req.query.folo_id) {
          await place_container.create({
            folo_id: req.query.folo_id,
            date_of_visit: moment(),
            frequent_place_id: req.query.fplace_id
          });
        }
      }



      res.send(dir); //Envío la dirección creada a la vista.
    } catch (error) {
      console.log(error); //Muestra errores.
    };
  };
  //Gets departments list and renders edit form
  async getUpdate(req, res) {
    try {
      let address_id = req.query.address_id;
      console.log(address_id);
      let Direccion = await Address.findByPk(address_id);
      let Departamentos = await department_controller.getList();
      return res.render('../views/address/edit.html', {
        Direccion,
        Departamentos
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the edited address in the DB.
  async updateAddress(req, res) {
    try {
      const errors = validationResult(req);
      let {
        address_id,
        detail,
        departamento,
        municipio,
      } = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the edited Address
        let Direccion = await Address.findByPk(route_id);
        let Departamentos = await department_controller.getList();
        res.render('../views/address/edit.html', {
          Direccion,
          Departamentos,
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
            id: address_id
          }
        });
        res.redirect('/direccion');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Elimina la dirección creada a través del ícono en la tabla.
  async deleteAddress(req, res) {
    try {
      let {
        id_address
      } = req.body; //Se obtiene el parámetro del cuerpo de la petición.
      await Address.destroy({ //Eliminación de la dirección.
        where: {
          id: id_address,
        }
      });
    } catch (error) {
      console.log(error); //Mensaje de error si lo hubiera.
    };
  };

  //Elimina todas las direcciones creadas al salir del Folo6.
  async deleteAddressList(req, res) {
    try {
      //Parseo del cuerpo de la petición para poder leer el array enviado dentro de él.
      req.body = JSON.parse(JSON.stringify(req.body));
      //Recorrido del cuerpo de la petición
      for (var key in req.body) {
        //Sin el parseo no es posible ejecutar el método dentro del if.
        if (req.body.hasOwnProperty(key)) {
          let value = req.body[key];
          await Address.destroy({ //Eliminación de las direcciones.
            where: {
              id: value,
            }
          });
          console.log('Se eliminó la dirección con el id ' + value); //Mensaje de éxito.
        };
      };
    } catch (error) {
      console.log(error); //Mensaje de error si lo hubiera.
    };
  };
};

module.exports = new address_services();