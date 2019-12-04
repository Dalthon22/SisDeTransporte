$('.ui.checkbox').checkbox('enable');
$(function () {

    $('#mytable').DataTable({
        "scrollCollapse": true,
    });

    $(".pencil.yellow.alternate.link.icon").click(function () {
        var id = $(this).attr("value");
        /* var route = $(this).closest("td").find("i.edit.yellow.icon").attr("value"); */
        url_list = encodeURI('rutas/gestionar?' + "route_id=" + id);
        console.log(url_list);
        location.href = url_list;
        /*SE MUEVE A LA DIRECCIÓN ESPECIFICADA POR REFERENCIA; POR TANTO,
        EN EL ROUTER NO ES POSIBLE HACER 'req.query.route_id'. CAMBIAR POR 'req.body'.
        Esto provoca que al editar en realidad se guarde un nuevo objeto con los cambios realizados.*/
    });

    //Validación del formulario
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                name: {
                    identifier: 'name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Ingrese el nombre de la ruta estándar.'
                    }, {
                        type: 'maxLength[40]',
                        prompt: 'El nombre debe ser menor a 40 caracteres'
                    }]
                },
                monday_frequency: {
                    identifier: 'monday_frequency',
                    depends: 'monday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                tuesday_frequency: {
                    identifier: 'tuesday_frequency',
                    depends: 'tuesday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                wednesday_frequency: {
                    identifier: 'wednesday_frequency',
                    depends: 'wednesday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                thursday_frequency: {
                    identifier: 'thursday_frequency',
                    depends: 'thursday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                friday_frequency: {
                    identifier: 'friday_frequency',
                    depends: 'friday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                saturday_frequency: {
                    identifier: 'saturday_frequency',
                    depends: 'saturday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
                sunday_frequency: {
                    identifier: 'sunday_frequency',
                    depends: 'sunday',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'Ingrese un valor entre 1 y 40.'
                    }]
                },
            }
        });

});