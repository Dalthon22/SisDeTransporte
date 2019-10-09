$(function () {

    $('#mytable').DataTable({
        "scrollCollapse": true,
    });

    $(".edit.yellow.icon").click(function () {
        var id = $(this).attr("value");
        /* var route = $(this).closest("td").find("i.edit.yellow.icon").attr("value"); */
        url_list = encodeURI('rutas/actualizar?' + "route_id=" + id);
        console.log(url_list);
        location.href = url_list;
    });

    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                name: {
                    identifier: 'name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Ingrese el nombre de la ruta estándar'
                    }, {
                        type: 'maxLength[40]',
                        prompt: 'El nombre debe ser menor a 40 caracteres'
                    }]
                }
            }
        });

});