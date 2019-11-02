$(function(){
    /*Bind de los eventos para poder abir el modal correspondiente*/
    $('#modalCancelar').modal('attach events', '.btnCancelar', 'show');
    
    $('#btnSiguiente').addClass('disabled');       /* Deshabilita el boton siguiente*/
    
    $('.switch').click(function(){          /* Funcion que valida el boton siguiente, sin no hay ningun switch seleccioando se deshabilita el boton */

        var indice=0;       /* variable que almacenara la cantidad de switch seleccionados*/

            if ($("input[type='checkbox']").is(':checked') == true) {       
                
                indice = indice + 1;
            }else
                {
                    indice = indice + 0;
                }
            
            if (indice>0) {
                $('#btnSiguiente').removeClass('disabled');
            }else 
                $('#btnSiguiente').addClass('disabled');
    });
});