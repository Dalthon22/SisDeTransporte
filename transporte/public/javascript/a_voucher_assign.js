/*Bind de los eventos para poder abir el modal correspondiente*/
$('#modalCancelar').modal('attach events', '.btnCancelar', 'show');
$('#modalGuardar').modal('attach events', '.btnGuardar', 'show');

/*para abrir el toast con el evento click*/
document.getElementById("btnGuar").addEventListener('click', function () {
    $('body')
        .toast({
            class: 'success',
            displayTime: 1000,
            title: 'Información',
            message: 'Vales asignados correctamente',
            showProgress: 'bottom'
        });
})

$(document).ready(function () {
    $('#selectroutes').DataTable({
        /* "scrollY": "500px",
        "scrollCollapse": true, */
    });
});