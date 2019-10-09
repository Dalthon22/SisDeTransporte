/*
Animaciones del Front del formulario de ingresar Procu 
06102019_DD
*/

$(function () {

    $('#mytable').DataTable({
        "scrollCollapse": true,
    });

    $(".edit.yellow.icon").click(function () {
        var id = $(this).attr("value");
        /* var route = $(this).closest("td").find("i.edit.yellow.icon").attr("value"); */
        url_list = encodeURI('instituciones/gestionar?' + "procu_id=" + id);
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
                        prompt: 'Ingrese el nombre de la procuraduría'
                    }, {
                        type: 'maxLength[100]',
                        prompt: 'El nombre debe ser menor a 40 caracteres'
                    }]
                }
            }
        });

});