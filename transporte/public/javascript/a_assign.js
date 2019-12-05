var filterValue, myTable;
var tableCells = "<tbody> <tr> <td> 1 </td> <td> 2 </td> <td> 3 </td> <td> 4 </td> <td> <i class =\"yellow big edit icon\" value=\"\" >< /i> <i class =\"red big window close icon\" value =\"\" >< /i> </td > </tr> </tbody>"

$(window).on('load', function () {
    console.log('window loaded');
    this.enviarToast();
});

$(document).ready(function () {
    myTable = $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });
    $.ajax({
        url: '/vales/quantity',
        async: true,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log(typeof (data.v));
            num = data.v;
            console.log(num);
        }
    }).done(function () {
        $("#quantity").text(num);
    });

});

function enviarToast() {
    var type = $('input#messagetype').val();
    var info = $('input#messageinfo').val(); /* Tomamos los valores de los input en el HTML */
    if (type == 'true') {
        if (info == 'true') {
            $('body')
                .toast({
                    class: 'success',
                    message: `El Requerimiento fue aprobado`,
                    position: 'top right'
                });
        } else if (info == 'false') {
            $('body')
                .toast({
                    class: 'error',
                    position: 'top right',
                    message: `Error al modificar la base de Datos.`
                });
        }
    } else if (type == 'false') {
        if (info == 'true') {
            $('body')
                .toast({
                    class: 'warning',
                    position: 'top right',
                    message: `El Requerimiento fue cancelado`
                });
        } else if (info == 'false') {
            $('body')
                .toast({
                    class: 'error',
                    position: 'top right',
                    message: `Error al modificar la base de Datos.`
                });
        }
    }
};

$('#container').css('display', 'block'); /* para arreglar un error de datatables */

/* Detona el metodo editar en el back mediante el id en un querystring */
$(".check.green.circle.outline.link.icon").click(function (e) {
    var id = $(e.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val();
    var tableData = $(this).parent().parent().children("td").map(function () {
        return $(this).text();
    }).get();
    console.log(id);
    $("#fecha_salida").text($.trim(tableData[0]));
    $("#solicitante").text($.trim(tableData[1]));
    $("#pasajeros").text($.trim(tableData[2]));
    $("#mision_folo").text($.trim(tableData[3]));
    document.getElementById("foloA_id").value = id;
    document.getElementById("fecha_folo").value = $.trim(tableData[0]);
    var tabla = document.getElementById("div_table");
    tabla.style.display = "none";
    var div = document.getElementById("data-hidden");
    div.style.display = "block";
    document.getElementById("bAsignar").disabled = false;
    document.getElementById("license_type").disabled = false;
    document.getElementById("cant").disabled = false;
});

$(".ui.left.floated.animated.button").click(function (e) {
    $("#fecha_salida").text('---');
    $("#solicitante").text('---');
    $("#pasajeros").text('---');
    $("#mision_folo").text('---');
    document.getElementById("foloA_id").value = "";
    document.getElementById("fecha_folo").value = "";
    var tabla = document.getElementById("div_table");
    tabla.style.display = "block";
    var div = document.getElementById("data-hidden");
    div.style.display = "none";
    document.getElementById("bAsignar").disabled = true;
    var cars = document.getElementById("license_type");
    cars.disabled = true;
    cars.getElementsByTagName('option')[0].selected = true;
    document.getElementById("cant").disabled = true;
});

function drawTableCells() {
    $('#mytable').html(tableCells);
};

function fillApproveButton() {
    $('.file.alternate.outline.icon').click(function (event) {
        showLoadingDimmer();
        var id_folo = parseInt($(event.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val()); /* se busca el id y se asigna al form */
        console.log("Usted desea Mostrar el folo:" + id_folo);
        //$('.segment').dimmer('set disabled');

        //$('#delete_modal').modal('show');
        $('#show_modal')
            .modal({
                closable: false,
                onShow: function () {
                    $('.segment').dimmer('hide');
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
                        $('#addressTable1').find('tbody').detach();
                        $('#addressTable1').append($('<tbody>'));
                        console.log(data.folo.fplaces);
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
                    })
                }
            }).modal('show')
    });
};

$(function () {
    fillApproveButton();
});

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
};
$('#container').css('display', 'block');

$('.ui.form').form({
    //revalidate: true,
    inline: true,
    on: 'blur',
    fields: {
        license_type: {
            identifier: 'license_type',
            rules: [{
                type: 'empty',
                prompt: 'Seleccione un lugar frecuente de la lista'
            }, {
                type: 'not[Vehiculo || Placa]',
                prompt: 'Seleccione un lugar frecuente de la lista'
            }]
        },
        cant: {
            identifier: 'cant',
            rules: [{
                    type: 'empty',
                    prompt: 'Ingrese una cantidad, sea: 0 o mayores'
                },
                {
                    type: 'integer',
                    prompt: 'Ingrese un número válido de pasajeros'
                },
                {

                }
            ]
        },
    }
});

/* function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("cant"), function (value) {
    return /^\d*$/.test(cant); // Allow digits and '.' only, using a RegExp
}); */