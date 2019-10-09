 /*****ANIMACIÓN,SETTINGS INICIALES Y VALIDACIONES******/
 var id_employee = 3,
     motorista, emp, unit;

 $(document).ready(function () {
     console.log("Usted va a editar el folo No:" + $('#folo_id').val())
     id_employee = parseInt($('#employee_id').val());
     const url_request_employee = '/empleado/' + id_employee;
     $('.ui.checkbox').checkbox('enable');
     console.log("En el folo original el checkbox con motorista estaba: " + $('#driver_cb').checkbox('is checked'));
     if ($('#driver_cb').checkbox('is checked')) {
         console.log("detonamos true");
     } else {
         console.log("detonamos false");
         sinMotorista();
     }
     $.ajax({
         url: url_request_employee,
         async: false,
         type: 'GET',
         dataType: 'json',
         success: (data) => {
             console.log(typeof (data.emp));
             emp = data.emp;
             unit = data.unit
             console.log(emp);
             console.log(unit);

             //Para setting de los labels
             $("#name_lb").text(emp.first_name + ", " + emp.last_name);
             $("#unidad_lb").text(unit.name_unit);
         }
     });
 });

 //VALIDACION DEL FORM
 $('.ui.form').form({
     //revalidate: true,
     inline: true,
     fields: {
         calendar1: {
             identifier: 'calendar1',
             rules: [{
                 type: 'empty',
                 prompt: 'Seleccione una fecha de salida'
             }]
         },
         time: {
             identifier: 'time',
             rules: [{
                 type: 'empty',
                 prompt: 'Seleccione una hora de salida'
             }]
         },
         time1: {
             identifier: 'time1',
             rules: [{
                 type: 'empty',
                 prompt: 'Seleccione una hora de retorno'
             }]
         },
         passengers_i: {
             identifier: 'passengers_i',
             rules: [{
                     type: 'empty',
                     prompt: 'Seleccione un horario de salida'
                 },
                 {
                     type: 'integer',
                     prompt: 'Ingrese un número válido de pasajeros'
                 }
             ]
         },
         mision_i: {
             identifier: 'mision_i',
             rules: [{
                 type: 'empty',
                 prompt: 'Ingrese el motivo o misión de su viaje'
             }]
         },
     }
 });

 //Validación de campos si NO selecciona motorista
 //valida select de licencia
 $("#license_ls_id").change(function () {
     $(".ui.form").form('validate field', 'license_ls');
 });
 $("#n_driver_i").change(function () {
     $(".ui.form").form('validate field', 'name_driver_i');
 });
 //
 //valida input de misión
 $("#mision_i_id").keyup(function () {
     $(".ui.form").form('validate field', 'mision_i');
 });
 /*--Formato y setting de fecha--*/
 var today = new Date();
 var month_lb = today.getMonth() + 1;
 //$("#date_lb").text(('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear());

 $('#standard_calendar').calendar({
     monthFirst: false,
     type: 'date',
     minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
     onHide: function () {
         $(".ui.form").form('validate field', 'calendar1');
     },
     text: {
         days: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
         months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
     },
     formatter: {
         date: function (date, settings) {
             if (!date) return '';
             var day = date.getDate();
             var month = date.getMonth() + 1;
             var year = date.getFullYear();
             // return day + '/' + month + '/' + year;
             return (('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year);
         }
     },
     onSelect: function (date, mode) {
         //Verifica que la fecha de salida sea con 3 días de anticipación a partir de la fecha actual(día en que estamos)
         var days = date.getDate() - today.getDate();
         var months = (date.getMonth() + 1) - (today.getMonth() + 1);
         var years = date.getFullYear() - today.getFullYear();
         //Controlará si la fecha de salida es menor a tres días del día en que se llena y mes-año actual
         if (days < 3 && months === 0 && years === 0) {
             console.log("Solicitó con: " + days + " días hábiles, Tendrá que manejar por su cuenta");
             $('#driver_cb').checkbox('uncheck');
             $('.ui.checkbox').checkbox('disable');
             motorista = 0;
         } else {
             console.log("Solicitó con:" + days + " días hábiles, Puede solicitar motorista al área e logistica");
             $('#driver_cb').checkbox('check');
             $('.ui.checkbox').checkbox('enable');
             motorista = 1;
         }
     }
 });
 /*--Checkbox motorista--*/
 $('#driver_cb').checkbox({
     onChecked: function () {
         conMotorista();
     },
     onUnchecked: function () {
         sinMotorista();
     }
 })

 function conMotorista() {
     motorista = 1;
     $('#n_driver_i').prop('disabled', true);
     $('#license_ls_id').prop('disabled', true);
     $('.ui.form').form('remove fields', ['name_driver_i', 'license_ls']);
     $(".ui.form").form('validate field', 'name_driver_i');
     $(".ui.form").form('validate field', 'license_ls');
     $('#license_ls_id').prop('selectedIndex', 0);
     $('#n_driver_i').val('');
 }

 function sinMotorista() {
     console.log("Va a solicitar motorista");
     motorista = 0;
     $('#n_driver_i').prop('disabled', false);
     $('#license_ls_id').prop('disabled', false);
     $('.ui.form').form('add rule', 'name_driver_i', {
         rules: [{
             type: 'empty',
             prompt: 'Ingrese el nombre de la persona que conducirá'
         }]
     });
     $('.ui.form').form('add rule', 'license_ls', {
         rules: [{
             type: 'empty',
             prompt: 'Seleccione el tipo de licencia que posee el conductor'
         }]
     });
 }

 /* --TIMER´s--*/
 $('#time_calendar')
     .calendar({
         type: 'time',
         minTimeGap: '30',
         endCalendar: $('#time_calendar1'),
         onHide: function (date, text, mode) {
             $(".ui.form").form('validate field', 'time');
         },
         onchange: function (date, text, mode) {
             console.log("Hora de salida: " + date + " Formato string" + text + " y mode:" + mode);
         }
     });
 $('#time_calendar1')
     .calendar({
         type: 'time',
         minTimeGap: '30',
         startCalendar: $('#time_calendar'),
         onChange: function (date, text, mode) {
             var dat = new Date($('#time_calendar').calendar('get date'));
             console.log(dat.getHours() + ':' + dat.getMinutes());
             //$(".ui.form").form('validate field', 'time1');
         },
         onHide: function (date, text, mode) {
             $(".ui.form").form('validate field', 'time1');
         }
     });

 /*****FIN: ANIMACIÓN,SETTINGS INICIALES Y VALIDACIONES******/
 $('#save_print_btn').on('click', function () {
     if ($('.ui.form').form('is valid')) {
         event.preventDefault();
         showDimmer();
         updateFolo6();
     }
 });

 //Animación patanlla negra y muestra el loader: "guardando..."
 function showDimmer() {
     $('body').dimmer({
         displayLoader: true,
         loaderVariation: 'slow blue medium elastic',
         loaderText: "Guardando los cambios...",
         closable: false,
     }).dimmer('show');
 }
 //Actualizacion del folo
 function updateFolo6() {
     //Convierte el formulario a un array unidimensional donde cada atributo del form es un elemento del array es decir {campoX,CampoY} esto se hizo así ya que
     //Si se coloca .serializeArray() crea una matriz de la siguiente forma: [{name:campox,value:valorCampox},{name:campoY,value:valorCampoY}...]
     var form = $(".ui.form").serializeArray().reduce(function (a, z) {
         a[z.name] = z.value;
         return a;
     }, {});
     //Valores del json que serán enviados en el ajax para guardar el folo6
     var jsonReq = {
         form: JSON.stringify(form),
         emp: JSON.stringify(emp),
         motorista: JSON.stringify(motorista)
     }
     console.log("Enviará:" +
         "form:" + JSON.stringify(form) +
         " emp:" + JSON.stringify(emp));
     console.log("Empaquetado" + typeof (jsonReq));
     $.ajax({
         type: "POST",
         async: true,
         url: '/solicitud_nueva/edit',
         dataType: 'json',
         data: jsonReq,
         success: (data) => {
             console.log("data.type es:" + typeof (data.type) + " y trae: " + data);
             console.log("data.type es:" + typeof (data.type) + " y trae: " + data.type);
             if (data.type == 1) {
                 //Si hay error
                 console.log(data.message);
                 $('body')
                     .toast({
                         title: data.title,
                         showIcon: false,
                         class: 'error',
                         position: 'top right',
                         displayTime: 0,
                         closeIcon: true,
                         message: data.message,
                     });
                 hideDimmer();
             } else {
                 //Si se ingreso con exito
                 successAddToast(data.message);
                 setTimeout(window.location.href = data.redirect, 30000);
             }
         },
     }).done();
 }
 //Para poder animar los elementos cuando se envía un ingreso de vales

 function hideDimmer() {
     {
         //$('.segment').dimmer('set disabled');
         $('body').dimmer('hide');
         //enable_elements();
     }
 }

 function successAddToast(message) {
     hideDimmer();
     $('body').dimmer({
         displayLoader: true,
         loaderVariation: 'slow green medium elastic',
         loaderText: "Redireccionando...",
         closable: false,
     }).dimmer('create').dimmer('set active').dimmer('show').dimmer('set page dimmer');
     $('body')
         .toast({
             showIcon: true,
             class: 'success',
             showProgress: true,
             position: 'top right',
             displayTime: 25000,
             closeIcon: true,
             message: message,
             transition: {
                 showMethod: 'zoom',
                 showDuration: 100,
                 hideMethod: 'fade',
                 hideDuration: 500
             }
         });
 }