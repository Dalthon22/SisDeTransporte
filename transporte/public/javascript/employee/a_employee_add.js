$(function () {
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                first_name: {
                    identifier: 'first_name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese el nombre del empleado'
                    }]
                },
                last_name: {
                    identifier: 'last_name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese los apellidos'
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: 'Ingrese el correo electrónico del empleado'
                    }, {
                        type: 'email',
                        prompt: 'Ingrese el un Email valido'
                    }]
                },
                password: {
                    identifier: 'password',
                    rules: [{
                            type: 'empty',
                            prompt: 'Ingrese la contraseña de usuario'
                        },
                        {
                            type: 'minLength[8]',
                            prompt: 'Su contraseña debe tener más de 8 caracteres'
                        }, {
                            type: 'maxLength[25]',
                            prompt: 'Su contraseña debe tener no más a 25 caracteres'
                        }
                    ]
                }
            }
        });
});

$('#pw_icon').click(function () {
    if ($(this).hasClass('slash')) {
        $('#password').attr('type', 'password');
        $(this).removeClass('slash');
    } else {
        $('#password').attr('type', 'text');
        $(this).addClass('slash');
    }
})