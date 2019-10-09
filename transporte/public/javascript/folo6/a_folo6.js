 /*****ANIMACIÓN,SETTINGS INICIALES Y VALIDACIONES******/
 var id_employee = 3;
 var motorista;
 var emp, unit;
 const url_request_employee = 'empleado/' + id_employee;

 $.ajax({
     url: url_request_employee,
     async: true,
     type: 'GET',
     dataType: 'json',
     success: (data) => {
         console.log(typeof (data.emp));
         emp = data.emp;
         unit = data.unit
         console.log(emp);
         console.log(unit);
     }
 }).done(function () {
     $("#name_lb").text(emp.first_name + ", " + emp.last_name);
     $("#unidad_lb").text(unit.name_unit);
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
 //Para setting de los labels
 $("#date_lb").text(('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear());

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
             // return day + '/' + month + '/' + year; DD/MM/YYYY
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
 }).calendar('focus');
 /*--Checkbox motorista--*/
 $('.ui.checkbox').checkbox('enable');
 $('#driver_cb').checkbox({
     onChecked: function () {
         motorista = 1;
         $('#n_driver_i').prop('disabled', true);
         $('#license_ls_id').prop('disabled', true);
         $('.ui.form').form('remove fields', ['name_driver_i', 'license_ls']);
         $(".ui.form").form('validate field', 'name_driver_i');
         $(".ui.form").form('validate field', 'license_ls');
         $('#license_ls_id').prop('selectedIndex', 0);
         $('#n_driver_i').val('');
     },
     onUnchecked: function () {
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
 })
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
 //Funciones para crear el PDF del Folo-06.
 function printPDF() {
     event.preventDefault();


     //Recolección de datos.
     fechaSolicitud = $('#date_lb').text();
     unidadSolicitante = $('#unidad_lb').text();
     fechaSalida = $('#calendar1').val();
     horaSalida = $('#time').val();
     horaRetorno = $('#time1').val();
     var motorista; //1 = no ; 0 = sí
     if ($('#driver_i').is(":checked")) {
         motorista = 0;
     } else {
         motorista = 1;
     }
     cantidadPasajeros = $('#passengers_i').val();
     personaConducir = $('#n_driver_i').val();
     tipoLicencia = $('#license_ls_id option:selected').text();
     tablaDirecciones = document.getElementById('addressTable');
     mision = $('#mision_i_id').val();
     observaciones = $('#details_i').val();
     var c1, c2, c3, c4, direccion, b;
     var direcciones = [];
     /*La propiedad 'length' en JS comienza en 1.
     La primera fila es el encabezado, a partir de la segunda van direcciones.
     Si solo hay una dirección, se asigna a la variable 'dirección'.
     Si hay más se asignan al array 'direcciones'. */
     if (tablaDirecciones.rows.length == 2) {
         //Sin embargo, internamente las filas y las celdas siempre comienzan en 0.
         //Fila 0 es el encabezado, fila 1 en adelante son las direcciones.
         c1 = tablaDirecciones.rows[1].cells[0].innerHTML;
         c2 = tablaDirecciones.rows[1].cells[1].innerHTML;
         c3 = tablaDirecciones.rows[1].cells[2].innerHTML;
         c4 = tablaDirecciones.rows[1].cells[3].innerHTML;
         direccion = c1 + ', ' + c2 + ', ' + c3 + ', ' + c4 + ".";
         b = 0; //No crea listado de direcciones
     } else {
         direccion = "Ver listado de direcciones en página anexo.";
         b = 1; //Crea listado de direcciones
     };
     for (var i = 1; i < tablaDirecciones.rows.length; i++) {
         c1 = tablaDirecciones.rows[i].cells[0].innerHTML;
         c2 = tablaDirecciones.rows[i].cells[1].innerHTML;
         c3 = tablaDirecciones.rows[i].cells[2].innerHTML;
         c4 = tablaDirecciones.rows[i].cells[3].innerHTML;
         direcciones.push("\n" + i + " - " + c1 + ', ' + c2 + ', ' + c3 + ',' + c4 + ".");
     };
     //Convierto el array en un string.
     direcciones = direcciones.toString();

     $.post('/solicitud/createPDF', { //Petición ajax post.
             fechaSolicitud,
             unidadSolicitante,
             fechaSalida,
             horaSalida,
             horaRetorno,
             motorista,
             cantidadPasajeros,
             personaConducir,
             tipoLicencia,
             direccion,
             direcciones,
             mision,
             observaciones,
             b
         },
         //Abre el pdf en una nueva ventana.
         function (result) {
             // e.g This will open an image in a new window
             console.log("voy a imprimir el folo")
             debugBase64(result);
             // window.open(result);
         });


     /* Solo funciona en Mozilla Firefox, en Google Chrome se abre una pestaña en blanco.
     En IE 11 ni siquiera abre la ventana. No tengo Edge para probar ahí.
     Tampoco es posible cambiar el nombre con el que se descarga el PDF.*/
 }

 function debugBase64(base64URL) {
     var win = window.open();
     win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
     win.document.close()
 }

 $('#save_print_btn').on('click', function () {
     if ($('.ui.form').form('is valid')) {
         event.preventDefault();
         showDimmer();
         $.when(printPDF()).then(guardarFolo6());
         // setTimeout(guardarFolo6(), 30000);
     }
 });
 //Animación patanlla negra y muestra el loader: "guardando..."
 function showDimmer() {
     $('body').dimmer({
         displayLoader: true,
         loaderVariation: 'slow blue medium elastic',
         loaderText: "Ingresando solicitud...",
         closable: false,
     }).dimmer('show');
 }

 function guardarFolo6() {

     //Convierte el formulario a un array unidimensional donde cada atributo del form es un elemento del array es decir {campoX,CampoY} esto se hizo así ya que
     //Si se coloca .serializeArray() crea una matriz de la siguiente forma: [{name:campox,value:valorCampox},{name:campoY,value:valorCampoY}...]
     var form = $(".ui.form").serializeArray().reduce(function (a, z) {
         a[z.name] = z.value;
         console.log(a);
         return a;
     }, {});
     var fplaces = [];
     var address = [];
     if ($('#createdAddress option').length) {
         $('#createdAddress option').each(function () {
             address.push($(this).val());
         });
     } else {
         console.log("No se enviara direcciones")
     }
     if ($('#selectedFPlace option').length) {
         $('#selectedFPlace option').each(function () {
             fplaces.push($(this).val());
         });
     } else {
         console.log("No se enviara lugares frecuentes")
     }

     console.log("Se enviaran estos lugares: " + fplaces + " Direcciones: " + address)
     //Valores del json que serán enviados en el ajax para guardar el folo6
     var jsonReq = {
         form: JSON.stringify(form),
         emp: JSON.stringify(emp),
         motorista: JSON.stringify(motorista),
         fplaces: JSON.stringify(fplaces),
         address: JSON.stringify(address)
     }
     console.log("Enviará:" +
         "form:" + JSON.stringify(form) + "emp:" + JSON.stringify(emp) + "fplaces: " + JSON.stringify(fplaces) + "address:" + JSON.stringify(address));
     console.log("Empaquetado" + typeof (jsonReq));
     $.ajax({
         type: "POST",
         async: true,
         url: '/solicitud_nueva/add',
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

 //Muestra mensaje de exito
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

 //MANEJO DE DIRECCIONES EN EL FOLO 6
 //Esconde los dropdown.
 $('#createdAddress').hide();
 $('#selectedFPlace').hide();

 //Función que guarda las direcciones que se van ingresando a la tabla.
 $('#addAddress').click(function () {

     event.preventDefault();
     var idSelDepto = $('#departamento').val();
     var idSelMun = $('#municipio').val();
     var selectedPlace = $('#fplaces').val();
     var destinyPlace = $('#destiny_place_i').val(); //Obtengo todos los valores
     var direction = $('#direction_txt').val();
     var selectedPlaceTxt = $('#fplaces option:selected').text();
     var dirCreadas = $('#createdAddress'); //Obtengo el dropdown de direcciones que está oculto
     var selectedFPlace = $('#selectedFPlace'); //Dropdown que tiene solo los lugares frecuentes ingresados
     if (selectedPlaceTxt == 'Otro') {
         $.post('/direccion/add', { //Hago la petición post
                 idSelDepto,
                 idSelMun,
                 selectedPlace,
                 destinyPlace,
                 direction,
                 selectedPlaceTxt
             }, //Agrego al dropdown el id de la dirección creada
             function (dir) {
                 if (dir != null && !jQuery.isEmptyObject(dir)) {
                     dirCreadas.append($('<option/>', {
                         value: dir.id,
                         text: dir.id
                     }));
                 };
             });
     }
     if (selectedPlaceTxt != 'Otro') {
         selectedFPlace.append($('<option/>', {
             value: selectedPlace,
             text: selectedPlaceTxt,
         }));
     }
     //Agrego el lugar frecuente seleccionado al dropdown
     //console.log(dirCreadas); //Muestro el dropdown en consola (navegador) para verificar su contenido.
     //console.log(selectedFPlace);
 });

 //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
 $('#addAddress').click(function () {
     event.preventDefault();
     $('#n_dir').text("Si");
     //Obtiene los valores de los combobox
     var selectedPlace = $('#fplaces option:selected').text();
     var selectedDepartamento = $('#departamento option:selected').text();
     var selectedMunicipio = $('#municipio option:selected').text();
     var destinyPlace = $('#destiny_place_i').val();
     var direction = $('#direction_txt').val();
     //Si el usuario elige la opción "Otro" del combobox de lugares frecuentes
     if (selectedPlace == "Otro") {
         //Inserción de elementos a la tabla
         $('#addressTable tbody').append("<tr>" +
             "<td>" + destinyPlace + "</td>" +
             "<td>" + direction + "</td>" +
             "<td>" + selectedDepartamento + "</td>" +
             "<td>" + selectedMunicipio + "</td>" +
             "</tr>");
         //Reinicia los combobox
         $('#fplaces').val("");
         $('#departamento').val("");
         $('#municipio').val("");
         $('#destiny_place_i').val("");
         $('#direction_txt').val("");
     } else { //Si el usuario selecciona un lugar frecuente
         //Inserción de elementos a la tabla
         $('#addressTable tbody').append("<tr>" +
             "<td>" + selectedPlace + "</td>" +
             "<td></td>" +
             "<td>" + selectedDepartamento + "</td>" +
             "<td>" + selectedMunicipio + "</td>" +
             "</tr>");
         //Reinicia los combobox
         $('#fplaces').val("");
         $('#departamento').val("");
         $('#municipio').val("");
     };
 });

 /*Función que habilita los campos "Nombre del destino" y "Detalle de dirección"
 si el usuario seleccionó la opción "Otro" del combobox de lugares frecuentes.*/
 $('#fplaces').change(function () {
     if ($('#fplaces').val() == 10000) {
         $('#destiny_place_i').prop('disabled', false);
         $('#direction_txt').prop('disabled', false);
     };
 });