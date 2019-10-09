/*
Animaciones del Front del formulario de ingresar vehiculo 
20092019_DD
*/

//Rutas para ajax
var url_request_plate_exist;
var url_post_create = '/vehiculos/gestionar';
var url_get_lis = 'vehiculos';
var current_plate;
var data_type;


/*
Validacion del formulario del lado del cliente 
20092019_DD
*/
$(function () {
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                brand: {
                    identifier: 'brand',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese la marca del vehículo'
                    }]
                },
                chassis: {
                    identifier: 'chassis',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese información del chasis'
                    }]
                },
                state: {
                    identifier: 'state',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe seleccionar el estado del vehículo'
                    }]
                },
                model: {
                    identifier: 'model',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese el modelo'
                    }]
                },
                engine: {
                    identifier: 'engine',
                    rules: [{
                            type: 'empty',
                            prompt: 'Por favor ingrese número del motor'
                        },
                        {
                            type: 'minLength[10]',
                            prompt: 'La información del motor debe contener al menos caracteres 10'
                        }
                    ]
                },
                plate: {
                    identifier: 'plate',
                    rules: [{
                            type: 'empty',
                            prompt: 'Por favor ingrese el número de placa'
                        },
                        {
                            type: 'minLength[4]',
                            prompt: 'El numero de placa puede poseer menos de 4 caracteres'
                        },
                        {
                            type: 'maxLength[8]',
                            prompt: 'El numero de placa no puede poseer más de 8 caracteres'
                        },
                        {
                            type: 'regExp[/^[A-Z]{1,2}[0-9]{4,6}$/]',
                            prompt: 'El número de placa debe tener este este formato: AA999999'
                        }
                    ]
                },
                seats: {
                    identifier: 'seats',
                    rules: [{
                        type: 'integer[2..40]',
                        prompt: 'Le número de asientos del vehículo debe ser entre 2 y 40'
                    }]
                }
            }
        });

    if (!$('#vehicle_id').val()) {
        $('#add_btn').addClass('disabled');
    }

    current_plate = $('#vplate').val();
});

/*
Permite cerrar los mensajes emergentes
29092019_DD
 */
$(".close.icon").click(function () {
    $(this).parent().hide();
});

/*
Detona el proceso de insercion del vehiculo
28092019_DD 
*/
$("#add_btn").click(function () {
    if ($('#vehicle_id').val()) {
        update_vehicle();
    } else {
        insert_vehicle();
    }

});

/*
 Valida que la placa no esté vinculada a ningun otro vehiculo
 01102019_DD
*/
$('#validate_plate').click(function () {
    if (current_plate === $('#vplate').val() && $('#vehicle_id').val()) {
        $('#add_btn').removeClass('disabled');
        AddToast("Valor Integro", "orange", "El numero de placa: " + current_plate + " no ha cambiado");
    } else if (!$('#vplate').val()) {
        $('#fPlate').addClass('error');
        AddToast("Valor Nulo", "error", "Debe ingresar un matricula valida para poder validar");
    } else {
        validate_plate();
    }
})

/*
Logica del proceso de insercion con su respectivas validaciones
28092019_DD
*/
function insert_vehicle() {
    $('.ui.toast').remove();
    $('.ui.form').form('validate form');
    if ($('.ui.form').form('is valid')) {
        url_request_plate_exist = 'matricula_' + $('#vplate').val();
        $.ajax({
            url: url_request_plate_exist,
            async: false,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                if (data.type === 0) {
                    create_vehicle();
                } else {
                    AddToast('Error con la Matricula', 'warning', data.message);
                    $('#add_btn').addClass('disabled');
                }
            }
        });
    }
}

/*
Logica del proceso de insercion con su respectivas validaciones
01102019_DD
*/
function update_vehicle() {
    $('.ui.toast').remove();
    $('.ui.form').form('validate form');
    if ($('.ui.form').form('is valid')) {
        if (current_plate === $('#vplate').val()) {
            refresh_vehicle();
        } else {
            validate_plate();
            if (data_type === 0) {
                refresh_vehicle();
            }
        }
    }
}


/*
Verifica si el numero de placa existe
01102019_DD
*/
function validate_plate() {
    url_request_plate_exist = 'matricula_' + $('#vplate').val();
    $.ajax({
        url: url_request_plate_exist,
        async: false,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            data_type = data.type;
            if (data.type === 0) {
                AddToast('Matrícula valida', 'success', data.message);
                $('#add_btn').removeClass('disabled');
            } else {
                AddToast('Error con la Matricula', 'warning', data.message);
                $('#add_btn').addClass('disabled');
                $('#fPlate').addClass('error');
            }
        }
    });
}

/*
Metodo Ajax de insercion de vehiculo
28092019_DD 
*/
function create_vehicle() {
    $.ajax({
        url: "/vehiculos/gestionar",
        async: true,
        type: 'POST',
        dataType: 'json',
        data: $('.ui.form').serializeArray(),
        success: (data) => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                AddToast(data.title, 'error', data.message);
            }
        }
    });
}

/*
Metodo Ajax de actualizacion de vehiculo
28092019_DD 
*/
function refresh_vehicle() {
    $.ajax({
        url: "/vehiculos/gestionar",
        async: true,
        type: 'POST',
        dataType: 'json',
        data: $('.ui.form').serializeArray(),
        success: (data) => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                AddToast(data.title, 'error', data.message);
            }
        }
    });
}

/*
Funcion que muestra un mensaje a lado superior derecho
27092019_DD 
*/
function AddToast(_title, _class, _message) {
    $('body')
        .toast({
            title: _title,
            showIcon: true,
            class: _class,
            position: 'top right',
            displayTime: 0,
            closeIcon: true,
            message: _message,
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            }
        });
}