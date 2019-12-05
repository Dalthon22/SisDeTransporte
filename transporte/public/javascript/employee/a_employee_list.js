$(function () {
    $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });


})

/* Detona el metodo editar en el back mediante el id en un querystring */
$(".pencil.yellow.alternate.link.icon").click(function () {
    var id = $(this).attr("value");
    var url_list = encodeURI('empleados/gestionar?' + "user_id=" + id);
    console.log(url_list);
    location.href = url_list;
});