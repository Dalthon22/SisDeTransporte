var tab, data;

//Serializa la tabla
$(document).ready(function () {
    fillTable();
    $('body').append(tab);
    console.dir($('body'))

});

//llenar tabla
function fillTable() {
    //Llenar el data table con los datos de todos los folos correspondientes al usuario
    tab = $('#mytable').DataTable({
        "scrollCollapse": false,
        //Este AJAX hace referencia al controller, c_folo6.js método getList(req, res)
        ajax: {
            url: '/folos',
            type: 'GET',
        },
        "columns": [{
                "data": "off_date"
            },
            {
                "data": "off_hour"
            },
            {
                "data": "return_hour"
            },
            {
                "data": "passengers_number"
            },
            {
                "data": "with_driver"
            },
            {
                "data": "created_at"
            },
            {
                "data": "buttons",
                //Indicarle que lo que se renderizará son los iconos que trae data del controlador
                "render": function (data, type, row, meta) {
                    return data;
                }

            }
        ]
    });


}
$('#mytable tbody').on('click', '.trash.red.alternate.outline.link.icon', function (event) {
    showLoadingDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea eliminar el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    //$('#delete_modal').modal('show');
    $('#delete_modal')
        .modal({
            closable: false,
            onShow: function () {

                console.log("Voy a mostrar el folo" + id_folo);
                //DATOS PARA MOSTRAR SOBRE EL FOLO A ELIMINAR
                $.ajax({
                    url: 'solicitud_nueva/getinfo',
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id_folo: JSON.stringify(id_folo)
                    },
                    success: (data) => {

                    }
                }).done(function (data, textStatus, jqXHR) {
                    console.log("Folo que van a eliminar" + data.folo.id);
                    //Para setting de los labels
                    $("#off_date_lb").text(data.folo.off_date);
                    $("#off_hour_lb").text(data.folo.off_hour);
                    $("#return_hour_lb").text(data.folo.return_hour);
                    $("#Passenger_number_lb").text(data.folo.passengers_number);
                    $("#with_driver_lb").text((data.folo.with_driver ? "Si" : "No"));
                    if (data.folo.with_driver) {
                        $("#driver_name_lb").text("------");
                        $("#license_type_lb").text("------");
                    } else {
                        $("#driver_name_lb").text(data.folo.person_who_drive);
                        $("#license_type_lb").text(data.folo.license_type);
                    }
                    $("#mission_lb").text(data.folo.mission);
                    if ((data.folo.observation).length > 1) {
                        $("#observation_lb").text(data.folo.observation);
                    } else {
                        $("#observation_lb").text("Sin observaciones");
                    }
                    $("#created_at_lb").text(data.folo.created_at);
                    //Limpiar la tabla
                    $('#addressTable').find('tbody').detach();
                    $('#addressTable').append($('<tbody>'));
                    if (data.folo.fplaces.length) {
                        data.folo.fplaces.forEach(ele => {
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    if (data.folo.address.length) {
                        data.folo.address.forEach(ele => {
                            //direcciones.push("\n" + i + " - " /* + ele.name + ', ' */ + ele.detail + ', ' + ele.city.name + ',' + ele.department.name + ".");
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    $('.segment').dimmer('hide');

                })
            },
            onDeny: function () {

            },
            onApprove: function () {
                animateAddButton();
                showDimmer();

                $.ajax({
                    url: 'solicitud_nueva/delete/' + id_folo,
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    success: (data) => {
                        console.log(data.type);
                        if (!data.type) {
                            successAddToast(data.title, data.message)
                            noAnimateAddButton();
                            tab.ajax.reload();
                        } else {
                            noAnimateAddButton();

                            $('body')
                                .toast({
                                    title: data.title,
                                    showIcon: false,
                                    class: 'error',
                                    position: 'top right',
                                    displayTime: 0,
                                    closeIcon: true,
                                    message: data.message,
                                });

                        }
                        //Para setting de los labels

                    }
                });
            }
        })
        .modal('show')
});

function printPDF() {
    event.preventDefault();

    //Recolección de datos.
    fechaSolicitud = $('#date_lb').text();
    unidadSolicitante = $('#unidad_lb').text();
    fechaSalida = $('#calendar1').val();
    horaSalida = $('#time').val();
    horaRetorno = $('#time1').val();
    var motorista; //1 = no ; 0 = sí
    if ($('#driver_i').is(":checked")) {
        motorista = 0;
    } else {
        motorista = 1;
    }
    cantidadPasajeros = $('#passengers_i').val();
    personaConducir = $('#n_driver_i').val();
    tipoLicencia = $('#license_ls_id option:selected').text();
    tablaDirecciones = document.getElementById('addressTable');
    mision = $('#mision_i_id').val();
    observaciones = $('#details_i').val();
    var c1, c2, c3, c4, direccion, b;
    var direcciones = [];
    /*La propiedad 'length' en JS comienza en 1.
    La primera fila es el encabezado, a partir de la segunda van direcciones.
    Si solo hay una dirección, se asigna a la variable 'dirección'.
    Si hay más se asignan al array 'direcciones'. */
    if (tablaDirecciones.rows.length == 2) {
        //Sin embargo, internamente las filas y las celdas siempre comienzan en 0.
        //Fila 0 es el encabezado, fila 1 en adelante son las direcciones.
        c1 = tablaDirecciones.rows[1].cells[0].innerHTML;
        c2 = tablaDirecciones.rows[1].cells[1].innerHTML;
        c3 = tablaDirecciones.rows[1].cells[2].innerHTML;
        c4 = tablaDirecciones.rows[1].cells[3].innerHTML;
        direccion = c1 + ', ' + c2 + ', ' + c3 + ', ' + c4 + ".";
        b = 0; //No crea listado de direcciones
    } else {
        direccion = "Ver listado de direcciones en página anexo.";
        b = 1; //Crea listado de direcciones
    };
    for (var i = 1; i < tablaDirecciones.rows.length; i++) {
        c1 = tablaDirecciones.rows[i].cells[0].innerHTML;
        c2 = tablaDirecciones.rows[i].cells[1].innerHTML;
        c3 = tablaDirecciones.rows[i].cells[2].innerHTML;
        c4 = tablaDirecciones.rows[i].cells[3].innerHTML;
        direcciones.push("\n" + i + " - " + c1 + ', ' + c2 + ', ' + c3 + ',' + c4 + ".");
    };
    //Convierto el array en un string.
    direcciones = direcciones.toString();

    $.post('/solicitud/createPDF', { //Petición ajax post.
            fechaSolicitud,
            unidadSolicitante,
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
        },
        //Abre el pdf en una nueva ventana.
        function (result) {
            // e.g This will open an image in a new window
            console.log("voy a imprimir el folo")
            debugBase64(result);
            // window.open(result);
        });


    /* Solo funciona en Mozilla Firefox, en Google Chrome se abre una pestaña en blanco.
    En IE 11 ni siquiera abre la ventana. No tengo Edge para probar ahí.
    Tampoco es posible cambiar el nombre con el que se descarga el PDF.*/
}

function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.close()
}

//PARA MOSTRAR EL PDF DEL FOLO SELECCIONADO
$('#mytable tbody').on('click', '.print.link.icon', function (event) {
    showLoadingPDFDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea imprimir el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    $.ajax({
        url: '/solicitud/showPDF',
        async: true,
        type: 'POST',
        dataType: 'json',
        data: {
            id_folo: JSON.stringify(id_folo)
        },
        success: (data) => {
            console.log("El folo se mostrará en seguida")
        }
    }).done(function (data, textStatus, jqXHR) {
        debugBase64(data.link);
        $('.segment').dimmer('hide');
    })
});
$('#mytable tbody').on('click', '.file.alternate.outline.link.icon', function (event) {
    showLoadingDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea Mostrar el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    //$('#delete_modal').modal('show');
    $('#show_modal')
        .modal({
            closable: false,
            onShow: function () {

                console.log("Voy a mostrar el folo" + id_folo);
                //DATOS PARA MOSTRAR SOBRE EL FOLO A ELIMINAR
                $.ajax({
                    url: 'solicitud_nueva/getinfo',
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id_folo: JSON.stringify(id_folo)
                    },
                    success: (data) => {

                    }
                }).done(function (data, textStatus, jqXHR) {
                    console.log("Folo que van a visualizar" + data.folo.id);
                    //Para setting de los labels
                    $("#off_date_lb1").text(data.folo.off_date);
                    $("#off_hour_lb1").text(data.folo.off_hour);
                    $("#return_hour_lb1").text(data.folo.return_hour);
                    $("#Passenger_number_lb1").text(data.folo.passengers_number);
                    $("#with_driver_lb1").text((data.folo.with_driver ? "Si" : "No"));
                    if (data.folo.with_driver) {
                        $("#driver_name_lb1").text("------");
                        $("#license_type_lb1").text("------");
                    } else {
                        $("#driver_name_lb1").text(data.folo.person_who_drive);
                        $("#license_type_lb1").text(data.folo.license_type);
                    }
                    $("#mission_lb1").text(data.folo.mission);
                    if (data.folo.observation) {
                        $("#observation_lb1").text(data.folo.observation);
                    } else {
                        $("#observation_lb1").text("Sin observaciones");
                    }
                    $("#created_at_lb1").text(data.folo.created_at);
                    //Limpiar la tabla
                    /* $('#progressTable1').find('tbody').detach();
                    $('#progressTable1').append($('<tbody>')); */
                    /* console.log("lo que quiero que se vea" + data.folo.estado.unit_cancel_detail); */
                    console.log(data.folo.estado.gas);
                    if (data.folo.estado.gas) {
                        var value = 1;
                        progressBar(value);
                    } else if (data.folo.estado.car) {
                        var value = 2;
                        progressBar(value);
                    } else if (data.folo.estado.driver) {
                        var value = 3;
                        progressBar(value);
                    } else if (data.folo.estado.t_approve) {
                        var value = 4;
                        progressBar(value);
                    } else if (!(data.folo.estado.t_approve) && data.folo.estado.t_det_approve) {
                        var value = 6;
                        var motivo = data.folo.estado.t_det_approve;
                        progressBar(value, motivo);
                    } else if (data.folo.estado.u_approve) {
                        var value = 5;
                        progressBar(value);
                    } else if (!(data.folo.estado.u_approve) && data.folo.estado.u_det_approve) {
                        var value = 7;
                        var motivo = data.folo.estado.u_det_approve;
                        progressBar(value, motivo);
                    } else {
                        progressBar();
                    }
                    $('#addressTable1').find('tbody').detach();
                    $('#addressTable1').append($('<tbody>'));
                    if (data.folo.fplaces.length) {
                        data.folo.fplaces.forEach(ele => {
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable1 tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    if (data.folo.address.length) {
                        data.folo.address.forEach(ele => {
                            //direcciones.push("\n" + i + " - " /* + ele.name + ', ' */ + ele.detail + ', ' + ele.city.name + ',' + ele.department.name + ".");
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable1 tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    $('.segment').dimmer('hide');
                })
            }
        }).modal('show');

});

function successAddToast(title, message) {
    $('.segment').dimmer('hide');
    // $('.segment').dimmer('set disabled');
    $('body')
        .toast({
            title: title,
            showIcon: true,
            class: 'success',
            position: 'top right',
            displayTime: 4000,
            closeIcon: true,
            message: message,
            /* className: {
                toast: 'ui message'
            } */
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            }
        });
}

function showDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Eliminando la solicitud...",
        closable: false,
    }).dimmer('show');
}

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
}

function showLoadingPDFDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "El folo se mostrará en seguida...",
        closable: false,
    }).dimmer('show');
}

function animateAddButton() {
    $('.approve.button').api('set loading');
    showDimmer();
}

function noAnimateAddButton() {
    {
        $('.approve.button')
            .api('remove loading');
        //$('.segment').dimmer('set disabled');
        $('.segment').dimmer('hide');
        //enable_elements();
    }
}

function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.close()
}

function progressBar(valor, motivo) {
    $('#progressTable1Parent').find('div').detach();
    $('#progressTable1Parent').append($('<div id="progressTable1">'));
    console.log(valor);
    if (valor == "1") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Asignados</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "2") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "3") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "4") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "5") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Esperando Aprobaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "5") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Esperando Aprobaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "6") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:80%;width:80%">' +
            '<i class="exclamation circle red icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Su solicitud ha sido cancelada debido a: ' + motivo + ' </div>' +
            '</div>' +
            '</div>'
        );
    } else if (valor == "7") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="active step" style="max-width:100%;width:100%">' +
            '<i class="exclamation circle red icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Su solicitud ha sido cancelada debido a: ' + motivo + ' </div>' +
            '</div>' +
            '</div>'
        );
    } else {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Entregado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Sin Aprobar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
};