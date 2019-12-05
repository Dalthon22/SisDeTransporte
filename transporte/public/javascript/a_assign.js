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

})