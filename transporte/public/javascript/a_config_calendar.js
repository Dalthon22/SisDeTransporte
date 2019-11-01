$(function(){
    /*Bind de los eventos para poder abir el modal correspondiente*/
    $('#modalCancelar').modal('attach events', '.btnCancelar', 'show');
    
    $('#btnSiguiente').addClass('disabled');
    
    $('.switch').click(function(){

        var indice=0;

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