//const moment = require("moment");

moment.locale("Es-SV");
//Var para verificar que el formulario esta listo para guardar
var data, tab;
var month, year;
var id_vehicle;

$("#car_information").on('change', function () {
    id_vehicle = $("#car_information :selected").val();
    tab.ajax.reload();
});

//Serializa la tabla
$(document).ready(function () {
    showDimmer();
    month = moment().month() + 1;
    year = moment().year();
    id_vehicle = $("#car_information :selected").val();
    $('#month_calendar_switch').calendar('set date', '' + month + '/' + year, true, false);
    fillTable();
    $('body').dimmer('hide');

});

//llenar tabla inicialmente
function fillTable() {

    console.log("año " + year + " mes " + month);
    tab = $('#mytable1').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        ajax: {
            url: '/vales/reporte_por_vehiculo/datos',
            type: 'GET',
            data: function (d) {
                d.month = month;
                d.year = year;
                d.id_vehicle = id_vehicle;
            },
        },
        "columns": [{
                "data": "assign_date"
            },
            {
                "data": "num_voucher"
            },
            {
                "data": "folo6_id"
            },
            {
                "data": "price"
            }
        ],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
            "emptyTable": "No hay facturas disponibles para el mes de " + moment().month(month).format("MMMM"),
            "zeroRecords": "No hay facturas disponibles para el mes seleccionado"
        },

    });
}

/* Calendario para switchear las facturas que se estan mostrando */
$('#month_calendar_switch')
    .calendar({
        type: 'month',
        text: {
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                //return (year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2));
                return (('0' + month).slice(-2) + '/' + year);
            }
        },
        onChange: function (date) {
            console.log("Cambio a la fecha" + date)
            month = date.getMonth() + 1;
            year = date.getFullYear();
            console.log("año " + year + " mes " + month);
            tab.ajax.reload();
            //Si la tabla esta vacía mostrará al usuario que no hay facturas para ese mes seleccionado
            /* $('#mytable1').on('draw.dt', function () {
                if (!tab.data().any()) {
                    $("#mytable1 td.dataTables_empty").each(function () {
                        $(this).innerText = "No hay facturas disponibles para el mes: " + moment().month(month).format("MMMM") + " del " + year;
                    });
                }
            }) */
        }
    });




function noAnimateAddButton() {
    {
        $('.approve.button')
            .api('remove loading');
        //$('.segment').dimmer('set disabled');
        $('.segment').dimmer('hide');
        //enable_elements();
    }
}

function successAddToast() {
    $('.segment').dimmer('hide');
    // $('.segment').dimmer('set disabled');

    $('body')
        .toast({
            //title: 'Error: número duplicado',
            showIcon: true,
            class: 'success',
            position: 'top right',
            displayTime: 4000,
            closeIcon: true,
            message: 'Vales registrados con exito',
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
    $('body').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "cargando los datos...",
        closable: false,
    }).dimmer('show');
}