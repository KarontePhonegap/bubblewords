/*--- PROPIEDADES ---*/
var listaCategorias = [];
var categoriaActual = null;
var categoriasEnEdicion = false;
var seleccionarCategorias = false;
var tarjetasPorCategoria = [];

/*--- MÉTODOS RELACIONADOS ---*/

/**
 * RepresentarCategorias. Realiza la maquetación de la lista de las categorias en el componente HTML destinado a mostrarlas.
 */
function RepresentarCategorias(){	
	// Limpieza de la lista de categorías
	
	$('#lstCategorias').empty();
	$('#inputCategoriaRelacionada').empty();

	// Inclusión de las categorías en la lista correspondiente
	$.each(listaCategorias, function(i, item){
		//$('#lstCategorias').append("<li data-theme=\'c\'><a href=\'javascript:;\' onClick=\'CargarCategoria(event, " + item.id + ",false)\' onTouchStart=\'CargarCategoria(event," + item.id + ",false)\' class=\'ui-link-inherit\'><h3>" + item.nombre + "</h3><p>" + item.descripcion + "</p><span class=\'ui-li-count\'>" + ContarTarjetasPorCategoria(parseInt(item.id)) + "</span></a></li>");
		console.log("Añadimos las categorias");
		$('#lstCategorias').append("<li><a href=\'javascript:;\' onClick=\'CargarCategoria(event, " + item.id + ",false)\' class=\'ui-link-inherit\'><h3>" + item.nombre + "</h3><p>" + item.descripcion + "</p><span class=\'ui-li-count\'>" + ContarTarjetasPorCategoria(parseInt(item.id)) + "</span></a></li>");

		console.log("Número de tarjetas por categoría (" + item.id + ") = " + ContarTarjetasPorCategoria(item.id));

		$('#inputCategoriaRelacionada').append("<option value=\'" + item.id + "\'>" + item.nombre + "</option>");
		
		// Selecciona como primer elemento el SPAN asociado al campo 'inputCategoriaRelacionada'
		$('#lblCategoriaRelacionada').html(item.nombre);
	});
	

	// Actualización de la lista de categorías
	if ($('#lstCategorias').hasClass('ui-listview')) {
		$('#lstCategorias').listview('refresh');	
	}
	
	// Inclusión de valores en el campo de selección de categoría
	$('#inputCategoriaRelacionada').selectmenu();
    // Se comprueba si hay más de una categoría, para seleccionar el elemento inicial en la lista de categorías
    if (listaCategorias.length > 0){
        $('#inputCategoriaRelacionada option[value=' + listaCategorias[0].id + ']').attr('selected', true);   
    }
}

/**
 * CambiarModoEdicionCategorias. Cambia el modo de edición de las categorías para que se puedan eliminar.
 */
function CambiarModoEdicionCategorias(){
	if (listaCategorias.length > 0) {
		if (!categoriasEnEdicion) {
			categoriasEnEdicion = true;
			// Iconos de 'menos' en la lista
			$('#lstCategorias li div span.ui-icon').removeClass('ui-icon-arrow-r', 1000).addClass('ui-icon-minus', 1000);			
			// Cambiar la palabra del botón de Edición
			$('#btnEditarCategorias span.ui-btn-text').html('<i class="icon-ok"></i>');
		}
		else {
			categoriasEnEdicion = false;
			// Iconos de 'siguiente' en la lista
			$('#lstCategorias li div span.ui-icon')	.removeClass('ui-icon-minus', 1000).addClass('ui-icon-arrow-r', 1000);
			// Cambiar la palabra del botón de Edición
			$('#btnEditarCategorias span.ui-btn-text').html('<i class="icon-remove"></i>');
		}	
	}
}

function reiniciaCategorias(){	
	categoriasEnEdicion = false;
	// Iconos de 'siguiente' en la lista
	$('#lstCategorias li div span.ui-icon')	.removeClass('ui-icon-minus', 1000).addClass('ui-icon-arrow-r', 1000);
	// Cambiar la palabra del botón de Edición
	$('#btnEditarCategorias span.ui-btn-text').html('<i class="icon-remove"></i>');
}

/**
 * NuevaCategoria. Inserta una nueva categoría con los datos pasados a la función.
 * 
 * @param	nombre		nombre de la categoría
 * @param	descripcion	descripción de la categoría
 */
function NuevaCategoria(nombre, descripcion){
	var maxId = 0;
	
	$.each(listaCategorias, function(i, item){
		if (item.id > maxId) {
			maxId = item.id;
		}
	});
	
	listaCategorias.push({'id': maxId+1, 'nombre':nombre, 'descripcion':descripcion});
	console.log("Nueva categoria insertada: " + listaCategorias[listaCategorias.length-1]);
	
	// Inserción de la categoría en la base de datos
	var sql = "insert into Categorias(id,nombre,descripcion) values(" + (maxId+1) + ",\'" + nombre + "\',\'" + descripcion + "\')";
	bwBD.transaction(function(tx){
		tx.executeSql(sql);
	}, errorBD);	
	RepresentarCategorias();	
	CargarCategoria(null,listaCategorias[listaCategorias.length-1].id,false);
}

/**
 * SeleccionarCategoriaPorId. Iguala la variable 'categoriaActual' a la categoría de 'listaCategorias' cuyo identificador es 
 * pasado como parámetro.
 *
 * @param	id		identificador de la categoría
 * @result	booleano que indica si se ha encontrado la categoría
 */
function SeleccionarCategoriaPorId(id){
	var encontrada = false;
	
	$.each(listaCategorias, function(i, item){
		if (item.id == id) {
			categoriaActual = item;
			encontrada = true;
		}
	});
	return encontrada;
}

/**
 * CargarCategoria. Realiza la carga de la categoría seleccionada o pregunta por su eliminación en caso de que se esté en modo Edición.
 *
 * @param		event		Evento que se ha disparado al llamar esta función
 * @param		id			Identificador de la categoría
 * @param		favoritas	Booleano que indica si hay que mostrar solamente las tarjetas favoritas
 */
function CargarCategoria(event, id , favoritas){
	if (favoritas) {
		ObtenerTarjetasFavoritas();
		$('#h1NombreCategoria').html("Favoritas");
		categoriasEnEdicion = false;
		
		RepresentarListaTarjetas(0, favoritas);
		
		// Ocultar el botón de nueva tarjeta en la página de la lista de tarjetas
		$('#lnkNuevaTarjeta').parents('div:eq(1)').hide();
		
		// Cambiar a la página con la lista de tarjetas
		$.mobile.changePage($('#PaginaDetalleCategoria'));
		
		//Cambiamos el funcionamiento del boton atrás para que no nos devuelva a la lista de categorias
		//y nos envie directamente al menu principal
		$('#PaginaDetalleCategoria a:eq(0)').on('click',function(event){
			PararEvento(event);
			//Redirigimos al menu principal			
			if (favoritas){
				$.mobile.changePage($('#PaginaInicial'));
				favoritas=false;
			}else{
				$.mobile.changePage($('#PaginaCategorias'));	
			}				
			$('#PaginaDetalleCategoria a:eq(0) span.ui-btn-text').html('<i class="icon-chevron-left"></i>');	
		});
		$('#PaginaDetalleCategoria a:eq(0) span.ui-btn-text').html('<i class="icon-chevron-left"></i><i class="icon-home"></i>');

	}
	else {
		ObtenerTarjetasPorCategoria(id);
		// Búsqueda de la categoría seleccionada 
		if (SeleccionarCategoriaPorId(id)){
			$('#h1NombreCategoria').html(categoriaActual.nombre);
			//ObtenerTarjetasPorCategoria(id);
		}
		
		// Se comprueba si la lista de categorías está en el modo edición o no, para mostrar la categoría en sí
		// o mostrar el cuadro de diálogo que indica si desea eliminar la categoría de la lista de categorías
		if (!categoriasEnEdicion) {		
			// Carga de las tarjetas relacionadas con la categoría actual
			RepresentarListaTarjetas(categoriaActual,favoritas);
			
			// Mostrar el botón de nueva tarjeta en la página de la lista de tarjetas
			$('#lnkNuevaTarjeta').parents('div:eq(1)').show();
		
			$.mobile.changePage($('#PaginaDetalleCategoria'));	
		}
		else {
            // Se le pregunta al usuario si desea eliminar la categoría seleccionada
            navigator.notification.confirm(
                res_ConfirmarEliminaCategoria,      // mensaje
                EliminaCategoriaActual,             // función
                res_PaginaConfirmarFin_titulo,      // título
                'Ok,Cancel'                         // botones de acción
            );
           
           // if (event!=null){
            	PararEvento(event);
           // }
		}	
	}
	
	//if (event!=null){
		PararEvento(event);
	//}
}

/**
 * EliminaCategoriaActual. Elimina la categoría actual seleccionada, tanto de la lista de categorías como de la BD.
 */
function EliminaCategoriaActual(event){
	var listaTemp = [];
	EliminarTarjetasPorCategoria(categoriaActual.id);
    
    if (parseInt(event) == 1) {
        try{
            // Eliminación de la categoría de la lista actual ...
            $.each(listaCategorias, function(i, item){
                if (item.id != categoriaActual.id) {
                    listaTemp.push(item);	
                }
            });
            listaCategorias = listaTemp;
            
            var sql = "delete from Categorias where id=" + categoriaActual.id;
            // ..., eliminación de la categoría de la BD ...
            bwBD.transaction(function(tx){
                tx.executeSql(sql);
            }, errorBD);
            
            // ... y actualización de la lista de categorías en la App
            RepresentarCategorias();
            categoriaActual = null;
            
            //Volver(event);		
        }
        catch (e){
            console.log("Error en EliminarCategoriaActual: " + e.message);
        }   
    }
    //$('#lstCategorias li div span.ui-icon').removeClass('ui-icon-arrow-r', 1000).addClass('ui-icon-minus', 1000);
    categoriasEnEdicion = false;
	$('#btnEditarCategorias span.ui-btn-text').html('<i class="icon-remove"></i>');
    
}

/**
 * EliminarListaCategorias. Elimina la lista de categorias actual.
 */
function EliminarListaCategorias(){
	listaCategorias = [];
	RepresentarCategorias();	
}

/**
 * ActivarSeleccionCategorias. Indica que se debe activar la selección de categorías, en el formulario de la nueva tarjeta
 */
function ActivarSeleccionCategorias(){
	console.log("Mostramos el select");
	
	seleccionarCategorias = true;	
    $('#pnlSeleccionDeCategoria').show();//.addClass('in');
    $('#inputCategoriaRelacionada').show();
}

function DesactivarSeleccionCategorias(){
	console.log("Ocultamos el select");
	seleccionarCategorias = false;
	/*
	$('#pnlSeleccionDeCategoria').removeClass('in').css('height', '0').css('display','none');
    $('#inputCategoriaRelacionada').css('height', '0');*/
    $('#pnlSeleccionDeCategoria').hide();//.addClass('in');
    $('#inputCategoriaRelacionada').hide();
}