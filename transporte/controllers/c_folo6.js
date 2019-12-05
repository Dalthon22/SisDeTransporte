const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Folo6 = require('../models/m_folo6');
const place_container = require('../models/m_places_container');
const FPlace = require('../models/m_frequent_place');
const Address = require('../models/m_address');
const Municipios = require('../models/m_city');
const Departamento = require('../models/m_department');
const Apanel = require('../models/m_folo6_approve_state');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

//Para manejar el área de direcciones y lugares frecuentes
const department_controller = require('../controllers/c_department');
const municipio_controller = require('../controllers/c_city');
const pdfPrinter = require('pdfmake/src/printer'); //Copiar esto
const employee_controller = require('../controllers/c_employee');
/* const Migration = require('../models/migrations');
 */
const {
    body,
    check,
    validationResult
} = require('../middleware/expresse-validator');

class folo6_controllers {
    constructor() {
        //var migrate = new Migration();
    }
    //Gets Departments List
    async getDepartmentList(req, res) {
        try {
            let Departamentos = await department_controller.getList();
            return res.render('./folo6/folo6.html', {
                Departamentos
            });
        } catch (error) {
            console.log(error);
        }
    };
    //Metodo para generar pdf a partir del folo 6
    createPDF(req, res) {

        /* Se especifican 4 casos para creación del PDF:
        1. Sí quiere motorista y hay más de una dirección.
        2. No quiere motorista y hay más de una dirección.
        3. Sí quiere motorista y hay una sola dirección (caso ideal).
        4. No quiere motorista y hay una sola dirección. */
        try {
            //console.dir(req.body); //Muestra en consola el cuerpo de la petición para comprobar datos.
            let {
                fechaSolicitud,
                personaSolicitante,
                fechaSalida,
                horaSalida,
                horaRetorno,
                motorista,
                cantidadPasajeros,
                personaConducir,
                tipoLicencia,
                direccion,
                direcciones,
                mision,
                observaciones,
                b
            } = req.body;
            /* Al pasar el Array a String también se convierten las comas que separan a cada uno de los
            elementos del array. Remuevo la coma al final de cada línea. */
            direcciones = direcciones.replace('.,\n', '.\n');
            if (motorista == 0) { // 0 = Sí ; 1 = No
                motorista = "Sí.";
            } else {
                motorista = "No.";
            };

            console.log("VVoy a evaluar con b=" + b + " y moto=" + motorista)
            //Sí quiere motorista y hay más de una dirección.
            if (motorista == "Sí." && b == 1) {
                console.log("1")

                //Definición de fuentes a usar en el documento.
                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                //'printer' se encarga de escribir en el lienzo.
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
                var docDefinition = {
                    info: {
                        //Nombre interno del documento.
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRequerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Listado de direcciones.',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: [
                                '\nLa siguiente lista se presenta en el formato:  ',
                                {
                                    text: '\"Nombre del lugar, detalle de dirección, departamento, municipio.\"',
                                    bold: true,
                                    italics: true
                                },
                                ' Si encuentra un espacio en blanco entre comas es porque ese campo no se especificó.',
                            ]
                        },
                        {
                            text: direcciones
                        },
                    ],
                };
                //Se escribe en el documento el cuerpo previamente definido.
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                }); //Mete todo el texto del PDF en un Array.
                //doc.pipe(fs.createWriteStream('document1.pdf')); //Crea el PDF en local (server).
                /*Al finalizar el documento, se mete en un buffer la concatenación del Array
                y se guarda en 'result'. Este buffer es enviado a la vista en el response.*/
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    //Se especifica el tipo de contenido que recibirá.
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    /* res.setHeader('content-type', 'application/pdf'); */
                    /* res.setHeader(
                        'Content-Type', 'application/pdf',
                        'Content-Disposition', 'attachment; filename="folo6.pdf"'
                    );
                    res.send("data:application/pdf;base64," + result.toString('base64')); */
                    //Envío del PDF en forma base64.
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };
            //La misma documentación de arriba se aplica para todos los casos posteriores.
            //NO quiere motorista y hay más de una dirección.
            if (motorista == "No." && b == 1) {
                console.log("2")

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRequerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Listado de direcciones.',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: [
                                '\nLa siguiente lista se presenta en el formato:  ',
                                {
                                    text: '\"Nombre del lugar, detalle de dirección, departamento, municipio.\"',
                                    bold: true,
                                    italics: true
                                },
                                ' Si encuentra un espacio en blanco entre comas es porque ese campo no se especificó.',
                            ]
                        },
                        {
                            text: direcciones
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    /*  res.setHeader('content-type', 'application/pdf'); */

                    /* res.send("data:application/pdf;base64," + result.toString('base64')); */
                    /*  res.setHeader(
                         'Content-Type', 'application/pdf',
                         'Content-Disposition', 'attachment; filename="folo6.pdf"'
                     );
                     res.send("data:application/pdf;base64," + result.toString('base64')); */
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };

            //Sí quiere motorista y solo es una dirección.
            if (motorista == "Sí." && b == 0) {
                console.log("3")

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\Requerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    /* res.setHeader('content-type', 'application/pdf'); */

                    /* res.send("data:application/pdf;base64," + result.toString('base64')); */
                    /* res.setHeader(
                        'Content-Type', 'application/pdf',
                        'Content-Disposition', 'attachment; filename="folo6.pdf"'
                    );
                    res.send("data:application/pdf;base64," + result.toString('base64')); */
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };

            //No quiere motorista y solo es una dirección.
            if (motorista == "No." && b == 0) {
                console.log("4")

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRquerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    /* res.setHeader(
                        'Content-Type', 'application/pdf',
                        'Content-Disposition', 'attachment; filename="folo6.pdf"'
                    );
                    res.send("data:application/pdf;base64," + result.toString('base64')); */
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };
        } catch (err) {
            console.log(err);
        };
    };

    //Mostrar PDF de los folos ya guardados
    async showAndcreatePDF(req, res) {
        /* Se especifican 4 casos para creación del PDF:
        1. Sí quiere motorista y hay más de una dirección.
        2. No quiere motorista y hay más de una dirección.
        3. Sí quiere motorista y hay una sola dirección (caso ideal).
        4. No quiere motorista y hay una sola dirección. */
        try {
            let folo = await this.foloInfo(req);
            //console.dir("EN SHOW RECIBI ESTO" + JSON.stringify(folo));
            var fechaSolicitud = folo.created_at;
            var personaSolicitante = folo.emp.first_name + ', ' + folo.emp.last_name;
            var fechaSalida = folo.off_date;
            var horaSalida = folo.off_hour;
            var horaRetorno = folo.return_hour;
            var motorista = "No";
            var cantidadPasajeros = folo.passengers_number;
            var personaConducir = folo.person_who_drive;
            var tipoLicencia = folo.license_type;
            //B es un contador definido por la cantidad de direcciones que posee una solicitud
            var b = folo.b
            var direccion;
            var direcciones = [];
            console.log("cantidad de direcciones: " + b + " Y MOTORISTA: " + motorista);
            if (b === 1) {
                //Si existe lugar frecuente si no lo ingresado es una dirección
                if (folo.fplaces.length) {
                    direccion = folo.fplaces[0].name + ", " + folo.fplaces[0].detail + ", " + folo.fplaces[0].city.name + ", " + folo.fplaces[0].department.name;
                } else {
                    //Para verificar que address no esta vacío
                    if (folo.address.length)
                        direccion = (folo.address[0].name ? folo.address[0].name + ", " : "") + (folo.address[0].detail ? folo.address[0].detail + ", " : "") + (folo.address[0].city.name ? folo.address[0].city.name + ", " : "") + (folo.address[0].department.name ? folo.address[0].department.name : "");
                }
            } else {
                //Si existe más de una ruta o de un lugar frecuente
                direccion = "Ver listado de direcciones en página anexo"
                var i = 1
                if (folo.fplaces.length) {
                    folo.fplaces.forEach(ele => {
                        direcciones.push("\n" + i + " - " + (ele.name ? ele.name + ', ' : '') + (ele.detail ? ele.detail + ', ' : '') + (ele.city.name ? ele.city.name + ',' : '') + (ele.department.name ? ele.department.name + "." : "."));
                        i++;
                    })
                }
                if (folo.address.length) {
                    folo.address.forEach(ele => {
                        direcciones.push("\n" + i + " - " + (ele.name ? ele.name + ', ' : '') + (ele.detail ? ele.detail + ', ' : '') + (ele.city.name ? ele.city.name + ',' : '') + (ele.department.name ? ele.department.name + "." : "."));
                        i++;
                    })
                }
            }
            console.log(typeof (b) + " cantidad " + b)
            var mision = folo.mission;
            var observaciones = folo.observation;
            /* Al pasar el Array a String también se convierten las comas que separan a cada uno de los
             elementos del array. Remuevo la coma al final de cada línea. */
            //direcciones = direcciones.replace('.,\n', '.\n');

            //Sí quiere motorista y hay más de una dirección.
            if (motorista == "Sí" && b > 1) {
                console.log("CON MOTORISTA Y MÁS UNA DIRECCION");
                //Definición de fuentes a usar en el documento.
                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                //'printer' se encarga de escribir en el lienzo.
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
                var docDefinition = {
                    info: {
                        //Nombre interno del documento.
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRequerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Listado de direcciones.',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: [
                                '\nLa siguiente lista se presenta en el formato:  ',
                                {
                                    text: '\"Nombre del lugar, detalle de dirección, departamento, municipio.\"',
                                    bold: true,
                                    italics: true
                                },
                                ' Si encuentra un espacio en blanco entre comas es porque ese campo no se especificó.',
                            ]
                        },
                        {
                            text: direcciones
                        },
                    ],
                };
                //Se escribe en el documento el cuerpo previamente definido.
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                }); //Mete todo el texto del PDF en un Array.
                //doc.pipe(fs.createWriteStream('document1.pdf')); //Crea el PDF en local (server).
                /*Al finalizar el documento, se mete en un buffer la concatenación del Array
                y se guarda en 'result'. Este buffer es enviado a la vista en el response.*/
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    //Se especifica el tipo de contenido que recibirá.
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    //res.setHeader('content-type', 'application/pdf');
                    //Envío del PDF en forma base64.
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };
            //La misma documentación de arriba se aplica para todos los casos posteriores.
            //NO quiere motorista y hay más de una dirección.
            if (motorista == "No" && b > 1) {
                console.log("SIN MOTORISTA Y MÁS DE UNA DIRECCION");

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRquerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Listado de direcciones.',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: [
                                '\nLa siguiente lista se presenta en el formato:  ',
                                {
                                    text: '\"Nombre del lugar, detalle de dirección, departamento, municipio.\"',
                                    bold: true,
                                    italics: true
                                },
                                ' Si encuentra un espacio en blanco entre comas es porque ese campo no se especificó.',
                            ]
                        },
                        {
                            text: direcciones
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    //res.setHeader('content-type', 'application/pdf');
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };

            //Sí quiere motorista y solo es una dirección.
            if (motorista == "Sí" && b == 1) {
                console.log("CON MOTORISTA Y UNA DIRECCION");

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRequerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    //delete req.headers;
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };

            //No quiere motorista y solo es una dirección.
            if (motorista == "No" && b == 1) {
                console.log("SIN MOTORISTA Y UNA DIRECCION");

                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                const printer = new pdfPrinter(fonts);
                var today = new Date();
                var month = today.getMonth() + 1;
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    content: [{
                            image: 'public/images/logo.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'CONSULTORIA Y ESTRATEGIA EMPRESARIAL',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nRquerimiento de transporte',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nCantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos del vehículo asignado:\n\n\n'
                        },
                        {
                            text: 'Marca: _________________            Placa: _________________             Km. actual: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
                doc.on('end', () => {
                    result = Buffer.concat(chunks);
                    //res.setHeader('content-type', 'application/pdf');
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64')
                    });
                });
                doc.end();
            };
        } catch (err) {
            console.log(err);
        };
    };

    async foloInfo(req) {
        try {
            console.log("FOLO QUE VOY A VERIFICAR" + req.body.id_folo)
            var folo = await Folo6.findAll({
                where: {
                    id: req.body.id_folo
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            //console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                //console.log("FOLO QUE VOY RECIBI" + folo.id)

                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                /*CORRECCIÓN HECHA POR AXEL HERNÁNDEZ - 21/11/2019:
                Al mostrar el PDF desde el listado de solicitudes, la fecha de salida se mostraba con un día
                menos que la fecha de salida almacenada en la base de datos.
                Esto sucedía por la resta del tiempo UTC de -6 horas. La fecha de salida es guardada en la BD
                con valores de 0 horas, 0 minutos, 0 segundos (como si se hubiera guardado exactamente a medianoche),
                y al restarle las 6 horas se devolvía al día anterior.*/
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).utcOffset("-06:00").format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });
            console.log(el.id);
            var estados = await Apanel.findAll({
                where: {
                    folo06_id: el.id
                }
            });
            el.estado = new Object();
            estados.forEach((estado, i) => {
                console.log(JSON.stringify(estado.id));
                var e = new Object();
                el.estado = new Object();
                e.u_approve = estado.request_unit_approve;
                e.u_det_approve = estado.unit_cancel_detail;
                e.t_approve = estado.transport_unit_approve;
                e.t_det_approve = estado.cancel_tunit_detail;
                e.driver = estado.driver;
                e.car = estado.car;
                e.gas = estado.gasoline;
                el.estado = e;
            });
            /* if(estado.SGT_Folo6_Aprovado.gasoline){
            } */
            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.body.id_folo
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                //console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces));
                Fplaces.forEach(row => {
                    //console.dir(row.SGT_Lugar_Frecuente);
                    if (row.SGT_Lugar_Frecuente) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.SGT_Lugar_Frecuente.name));
                        var f = new Object();
                        f.city = new Object();
                        f.department = new Object();

                        f.id = row.SGT_Lugar_Frecuente.id;
                        f.name = row.SGT_Lugar_Frecuente.name;
                        f.detail = row.SGT_Lugar_Frecuente.detail;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        f.city.id = row.SGT_Lugar_Frecuente.city_id;
                        municipio_controller.getName(row.SGT_Lugar_Frecuente.city_id).then(name => {
                            f.city.name = name;
                        });
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        f.department.id = row.SGT_Lugar_Frecuente.department_id;
                        department_controller.getName(row.SGT_Lugar_Frecuente.department_id).then(name => {
                            f.department.name = name;
                        });
                        f.procu_id = row.SGT_Lugar_Frecuente.procuraduria_id;
                        el.fplaces.push(f);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.body.id_folo
                },
                attributes: ['address_id'],
                include: [Address]
            }).then(Dirs => {
                //console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs));
                Dirs.forEach(row => {
                    //console.dir(row.SGT_Direccion);
                    if (row.SGT_Direccion) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.SGT_Direccion.detail));
                        var dir = new Object();
                        dir.city = new Object();
                        dir.department = new Object();
                        dir.id = row.SGT_Direccion.id;
                        dir.name = row.SGT_Direccion.name;
                        dir.detail = row.SGT_Direccion.detail;
                        dir.city.id = row.SGT_Direccion.city_id;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        municipio_controller.getName(row.SGT_Direccion.city_id).then(name => {
                            dir.city.name = name;
                        });
                        dir.department.id = row.SGT_Direccion.department_id
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        department_controller.getName(row.SGT_Direccion.department_id).then(name => {
                            dir.department.name = name;
                        });
                        //dir.procu_id = row.address.procuraduria_id;

                        el.address.push(dir);
                        el.b++;
                    }
                })
            });
            el.emp = new Object();
            el.emp = await employee_controller.findById1(el.employee_id);

            //console.dir("Datos del folo" + JSON.stringify(el) + "\nDatos el empleado: " + JSON.stringify(el.emp));
            //console.dir("Lugares frecuentes: " + JSON.stringify(el.fplaces));
            //console.dir("Direcciones: " + JSON.stringify(el.address));
            // console.dir(data);
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            return el;
        } catch (error) {
            console.log(error);
        }
    };
    async foloInfoById(req, res) {
        try {
            let Departamentos = await department_controller.getList();

            console.log("FOLO QUE VOY A VERIFICAR" + req.params.id)
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            //console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                console.log("FOLO QUE VOY RECIBI" + folo.id)

                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).utcOffset("-06:00").format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                //console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces))
                Fplaces.forEach(row => {
                    if (row.SGT_Lugar_Frecuente) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.frequent_place.name));
                        var f = new Object();
                        f.city = new Object();
                        f.department = new Object();

                        f.id = row.SGT_Lugar_Frecuente.id;
                        f.name = row.SGT_Lugar_Frecuente.name;
                        f.detail = row.SGT_Lugar_Frecuente.detail;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        f.city.id = row.SGT_Lugar_Frecuente.city_id;
                        municipio_controller.getName(row.SGT_Lugar_Frecuente.city_id).then(name => {
                            f.city.name = name;
                        });
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        f.department.id = row.SGT_Lugar_Frecuente.department_id;
                        department_controller.getName(row.SGT_Lugar_Frecuente.department_id).then(name => {
                            f.department.name = name;
                        });
                        f.procu_id = row.SGT_Lugar_Frecuente.procuraduria_id;
                        el.fplaces.push(f);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['address_id'],
                include: [Address]
            }).then(Dirs => {
                //console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs))
                Dirs.forEach(row => {
                    if (row.SGT_Direccion) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.address.detail));
                        var dir = new Object();
                        dir.city = new Object();
                        dir.department = new Object();
                        dir.id = row.SGT_Direccion.id;
                        dir.name = row.SGT_Direccion.name;
                        dir.detail = row.SGT_Direccion.detail;
                        dir.city.id = row.SGT_Direccion.city_id;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        municipio_controller.getName(row.SGT_Direccion.city_id).then(name => {
                            dir.city.name = name;
                        });
                        dir.department.id = row.SGT_Direccion.department_id
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        department_controller.getName(row.SGT_Direccion.department_id).then(name => {
                            dir.department.name = name;
                        });
                        //dir.procu_id = row.address.procuraduria_id;

                        el.address.push(dir);
                        el.b++;
                    }
                })
            });
            el.emp = new Object();
            el.emp = await employee_controller.findById1(el.employee_id);

            //console.dir("Datos del folo" + JSON.stringify(el) + "\nDatos el empleado: " + JSON.stringify(el.emp));
            // console.dir("Lugares frecuentes: " + JSON.stringify(el.fplaces));
            //console.dir("Direcciones: " + JSON.stringify(el.address));
            // console.dir(data);
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            res.render('./folo6/folo6_edit.html', {
                folo: el,
                Departamentos
            });
        } catch (error) {
            console.log(error);
        }
    };

    //Método que envía los folos ingresados de forma que puedan ser renderizados en un datatable; incluye iconos de eliminado y de edición.
    async getList(req, res) {
        var day, mont, year;
        try {
            /******FALTA: LISTAR LOS VALES QUE CORRESPONDEN A UN SOLO EMPLEADO*/
            var folos = await Folo6.findAll({
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'created_at']
            });
            //console.log(d);
            //data contendrá todos los folos extraídos de la BD
            var data = [];
            folos.forEach((row, i) => {
                var el = new Object();
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(row.off_date).format("DD MMMM YYYY");
                el.off_hour = moment.utc(row.off_hour).format("h:mm A");
                el.return_hour = moment.utc(row.return_hour).format("h:mm A");
                el.passengers_number = row.passengers_number;
                //Si with_driver = true, envía la cadena "Si"
                el.with_driver = row.with_driver ? "Si" : "No";
                el.created_at = moment.parseZone(row.created_at).local().format("DD/MM/YYYY h:mm A");
                //Icono para visualizar el folo. Enlance y un icono de lapiz para editar el folo. Un icono de eliminado. Ambos tiene por identificardor el id del folo que ha ido a traer a la BD
                //var today = moment().format("DD MMMM YYYY");
                var trully = moment().isBefore(moment.utc(row.off_date))
                //console.log("FECHA ES: " + trully);
                if (trully)
                    el.buttons = '<i id="' + row.id + '" class="large print black link icon "></i><i id="' + row.id + '" class="large file grey alternate outline link icon "></i><a href="/solicitud_nueva/' + row.id + '"><i class="large pencil yellow alternate link icon"></i></a><i class="large trash red alternate outline link icon" id="' + row.id + '"></i>';
                else
                    el.buttons = '<i id="' + row.id + '" class="large print black link icon "></i><i id="' + row.id + '" class="large file grey alternate outline link icon "></i>'
                data.push(el);
            });
            //console.dir(data);
            //Envío de los folos en formato JSON
            res.send({
                data: data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //Envía el folo solicitado en el formato en que fueron ingresados. Este se utiliza principalmente en la pantalla para hacer el update al folo6
    async getOne(req, res) {
        try {
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            // console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                //Se envía '1' ó '0' por que el checkbox "Con motorista" reconoce ambos como estados válidos.
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            console.log(el);
            // console.dir(data);
            res.render('./folo6/folo6_edit.html', {
                folo: el
            });
            //return folo;
        } catch (error) {
            console.log(error);
        }
    };
    //Método para enviar en forma de string todos los atributos del folo 6 se utiliza para mostrar en un modal el folo ya sea para ver todos los atributos o para eliminarlos
    //*** FALTA MANDAR COMO STRING LAS DIRECCIONES */
    async foloToString(req, res) {
        try {
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces))
                Fplaces.forEach(row => {
                    if (row.frequent_place) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.frequent_place.name));
                        el.fplaces.push(row.frequent_place);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            await place_container.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['address_id'],
                include: [Address]
            }).then(Dirs => {
                console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs))
                Dirs.forEach(row => {
                    if (row.address) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.address.detail));
                        el.address.push(row.address);
                        el.b++;
                    }
                })
            });
            console.dir(el);
            /* let x = await this.foloInfo(req, res)
            console.dir("Recibí el objeto " + x) */
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            res.send({
                folo: el
            });
        } catch (error) {
            console.log(error);
        }
    };
    //Este metodo recibe los parametros del req y con ellos crea el folo en la BD
    async createFolo6(req, res) {
        var form, emp, date, motorista, fplaces, address, folo;
        //Convierte los json enviados por un post de ajax
        motorista = JSON.parse(req.body.motorista);
        console.dir("form: " + JSON.stringify(motorista + "Y del tipo:" + typeof (motorista)));
        form = JSON.parse(req.body.form);
        console.dir("form: " + JSON.stringify(form));
        emp = JSON.parse(req.body.emp);
        console.dir("emp: " + JSON.stringify(emp) + "id: " + emp.id);
        fplaces = JSON.parse(req.body.fplaces)
        console.dir("Recibi estos lugares frecuentes: " + fplaces);
        address = JSON.parse(req.body.address)
        console.dir("Recibi estas direcciones: " + address)

        try {
            const errors = validationResult(req);
            //Conversion al formato permitido por sequelize YYYY-MM-DD y horas HH:mm (Formato 24 hrs)
            date = moment(form.calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            var t = moment(form.time, ["h:mm A"]).format("HH:mm");
            var t1 = moment(form.time1, ["h:mm A"]).format("HH:mm");

            //errors es una variable declara para las validaciones realizadas en express
            //console.log(errors.array());

            if (!errors.isEmpty()) {
                res.send({
                    title: "Error al guardar los datos",
                    message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                    type: 1
                });
            } else {
                console.log("Estoy en el create");
                //CREATE para los estados de aprobacion del folo

                //Si en el folo 6 NO selecciono motorista se llenará con estos datos la BD
                folo = await Folo6.create({
                    off_date: date,
                    off_hour: t,
                    return_hour: t1,
                    passengers_number: form.passengers_i,
                    with_driver: motorista ? 0 : 1,
                    person_who_drive: form.name_driver_i,
                    license_type: form.license_ls,
                    mission: form.mision_i,
                    observation: form.details_i,
                    employee_id: emp.id,
                    //procuraduria_id: emp.procuraduria_id
                });
                console.dir("Folo creado" + folo);

                //Si es jefe, se auto-aprobara a si mismo
                if (emp.is_unit_boss) {
                    Apanel.create({
                        request_unit_approve: 1,
                        aprove_boss_id: emp.id,
                        transport_unit_approve: 0,
                        folo06_id: folo.id
                    });
                } else {
                    Apanel.create({
                        request_unit_approve: 0,
                        transport_unit_approve: 0,
                        folo06_id: folo.id
                    });
                }
                //CREATE para places container, esta tabla relaciona ya sean lugares frecuentes o direcciones con un folo
                if (fplaces.length) {
                    fplaces.forEach(id => {
                        place_container.create({
                            folo_id: folo.id,
                            date_of_visit: moment(),
                            frequent_place_id: id
                        });
                    })
                } else {
                    console.log("No hay lugares frecuentes para relacionar");
                }
                if (address.length) {
                    address.forEach(id => {
                        place_container.create({
                            folo_id: folo.id,
                            date_of_visit: moment(),
                            address_id: id
                        });
                    })
                } else {
                    console.log("No hay direcciones que relacionar");
                }
                console.log("sali del create");
                //Datos que se envían a la vista
                res.send({
                    message: "Datos agregados con exito",
                    type: 0,
                    redirect: "/home",
                    status: 200
                });
            }
        } catch (err) {
            console.log("Ocurrio en el método create" + err);
            res.send({
                title: "Error al guardar los datos",
                message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
            //throw new Error(" Ocurre ingresando los vales en la BD " + err);
        }
    }
    //Recibe los datos actulizados para un registro de folo 6
    async editFolo6(req, res) {
        var form, emp, date;
        /*  motorista = JSON.parse(req.body.motorista);
         console.dir("form: " + JSON.stringify(motorista + "Y del tipo:" + typeof (motorista))); */
        form = JSON.parse(req.body.form);
        console.dir("form: " + JSON.stringify(form));
        emp = JSON.parse(req.body.emp);
        console.dir("emp: " + JSON.stringify(emp) + "id: " + emp.id);

        try {
            console.log("Solicito editar el folo con id: " + form.folo_id);

            //errors es una variable declara para las validaciones realizadas en express
            //console.log(errors.array());            //Conversion al formato permitido por sequelize YYYY-MM-DD y horas HH:mm (Formato 24 hrs)
            date = moment(form.calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            var t = moment(form.time, ["h:mm A"]).format("HH:mm");
            var t1 = moment(form.time1, ["h:mm A"]).format("HH:mm");

            // console.log(errors.array());
            if (1 == 2) {
                res.send({
                    title: "Error al guardar los datos",
                    message: "Ocurrio un error mientras se guardaban los cambios, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                    type: 1
                });
            } else {
                console.log("Estoy en el edit");

                console.log("Estoy en el else del edit");
                console.log("En el controller me dice que tiene esta licencia" + form.license_ls);
                let f = await Folo6.update({
                    request_unit: emp.unit_id,
                    off_date: date,
                    off_hour: t,
                    return_hour: t1,
                    passengers_number: form.passengers_i,
                    with_driver: 0,
                    person_who_drive: form.name_driver_i,
                    license_type: form.license_ls,
                    mission: form.mision_i,
                    observation: form.details_i,
                    employee_id: emp.id,
                    //procuraduria_id: emp.procuraduria_id
                }, {
                    where: {
                        id: form.folo_id
                    }
                });
                console.dir("Folo actualizado" + f);

                //Departamento
                console.log("sali del create");
                res.send({
                    message: "Datos actualizados con exito",
                    type: 0,
                    redirect: "/home",
                    status: 200
                });
            }
        } catch (err) {
            console.log("Ocurrio en el método edit" + err);
            res.send({
                title: "Error al guardar los cambios",
                message: "Ocurrio un error mientras se actualizaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
            //throw new Error(" Ocurre ingresando los vales en la BD " + err);
        }
    }
    //Elima el folo indicado como parametros en req.params.id
    async deleteFolo(req, res) {
        try {
            /* Elimina de la tabla la unión del folo con los lugares y/o direcciones*/
            await place_container.destroy({
                where: {
                    folo_id: req.params.id
                }
            });

            /* Elimina el folo */
            var folo = await Folo6.destroy({
                where: {
                    id: req.params.id
                },
            });

            res.send({
                    type: 0,
                    title: "Datos eliminados con éxito",
                    message: "Folo " + req.params.id + " eliminado con exito",
                }

            );
        } catch (err) {
            res.send({
                title: "Error al eliminar los datos",
                message: "Ocurrio un error mientras se eliminaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
        }
    }

    async deletePlacesContainer(req, res) {
        try {
            let {
                id_address,
                id_frequent_place
            } = req.body;
            if (id_address != null) {
                place_container.destroy({
                    where: {
                        address_id: id_address
                    }
                });
            };
            if (id_frequent_place != null) {
                place_container.destroy({
                    where: {
                        frequent_place_id: id_frequent_place
                    }
                });
            };
        } catch (error) {
            console.log(error);
        };
    };
};

module.exports = new folo6_controllers();