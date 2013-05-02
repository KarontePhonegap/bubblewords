// JavaScript Document

/**
 * InicializarIdiomas. Realiza la inicialización del entorno para el tratamiento de los idiomas
 */
function InicializarIdiomas(){
	comprobarIdioma();
}

/**
 * comprobarIdioma. Comprueba cual es el idioma que hay almacenado, para seleccionarlo en la lista de idiomas disponibles.
 */
function comprobarIdioma(){
	if (idiomaPrincipal) {
		// Se selecciona el elemento por defecto
		if (idiomaPrincipal.toString().length > 0) {			
			//$('#lstIdiomaPrincipal option[value='+idiomaPrincipal+']').attr('selected', 'selected');
			//$('#lstIdiomaPrincipal').selectmenu('refresh');
			
			
			// Actualización del idioma actual y cambio de recursos
			$.localise('js/idiomas', {language: $('#lstIdiomaPrincipal').attr('value'), loadBase: true});
			console.log({language: $('#lstIdiomaPrincipal').attr('value'), loadBase: true});
			CargarEtiquetas();
		}
	}
	
	if (idiomaSecundario){
		// Se selecciona el idioma secundario guardado en la variable local
		if (idiomaSecundario.toString().length > 0){
			//$('#lstIdiomaSecundario option[value='+idiomaSecundario+']').attr('selected', 'selected');
			//$('#lstIdiomaSecundario').selectmenu('refresh');    
		}
	}
}

/*
function cargarIdiomas(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getDirectory("BubbleWordsData", {create:true}, function(directorio){
            directorio.getFile("languages", {create:true}, function(fichero){
                reader = new FileReader();
                reader.onloadend = function(e) {
                    console.log("El archivo contiene:");
                    console.log(e.target.result);
                    console.log("onloadend devuelve: "+e);
                    if (e.target.result==null){
                        fichero.createWriter(function(writer){
                            writer.onwrite = function(evt) {
                                console.log("El archivo de idiomas no existia y se ha creado");                                
                            };
                            var obj={idiomaPrincipal:'es',idiomaSecundario:'en'};
                            console.log("El Objeto json despues del stringify-> "+JSON.stringify(obj))
                            writer.write(JSON.stringify(obj));
                        }, fail);
                    }else{
                        console.log("Hemos leido el archivo lang.txt, y contiene: "+e.target.result);
                        var langObj = JSON.parse(e.target.result);
                        console.log("Objeto JSON "+langObj);
                    }
                }
                reader.readAsText(fichero);
                //console.log("Se ha creado el archivo .nomedia");
            }, function(error3){
                console.log("No se ha podido crear el archivo lang.txt: " + error3.code);
            });
        },function(error2){
            console.log("No se ha podido abrir el directorio: " + error2.code);
        });       
    },function(error1){
        console.log("No se ha podido acceder al almacenamiento: " + error1.code);
    });
    
}



var fail = function(evt) {
    console.log(error.code);
};
*/
function ObtenerIdiomaSistema(){
    var lang;
    if ( navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        lang = lang[1];
    }
    if (!lang && navigator) {
        if (navigator.language) {
                lang = navigator.language;
        } else if (navigator.browserLanguage) {
                lang = navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
                lang = navigator.systemLanguage;
        } else if (navigator.userLanguage) {
                lang = navigator.userLanguage;
        }
        lang = lang.substr(0, 2);
    }
    //console.log("Estamos en obteneridiomasistema y el idioma del sistema es: "+lang)
    idiomaSistema = lang;
}

/**
 * CargarEtiquetas. Realiza la asignación de cada uno de las variables de idioma a sus correspondientes etiquetas.
 */
function CargarEtiquetas(){
	// Definición de los botones de navegación
	//$('a[data-rel=\'back\'] span.ui-btn-text').html(res_Atras);
	$.mobile.page.prototype.options.backBtnText = res_Atras;
	
	// Página de inicio
	$('#lblInicio').html(res_Inicio);
	$('#lblNuevaTarjeta').html(res_NuevaTarjeta);
	$('#lblTutorial').html(res_Tutorial);
	$('#lblFavoritos').html(res_Favoritos);
	
	$('#h1NombreCategoria').html(res_Favoritos);
	$('#lblAjustes').html(res_Ajustes);
	
	// Página categorías
	$('#lblCategorias').html(res_Categorias);
	//$('#lblNuevaCategoria').html(res_NuevaCategoria);
	//$('#lblEditarCategoria').html(res_EditarCategoria);
	
	// Págiina nueva categoría
	$('#lblTituloNuevaCategoria').html(res_TituloNuevaCategoria);
	$('#inputNombreCategoria').attr('placeholder',res_NombreNuevaCategoria);
	$('#inputDescripcionCategoria').attr('placeholder',res_DescripcionNuevaCategoria);
	$('#btnInsertarCategoria').html(res_InsertarNuevaCategoria);

	
	// Página Confirmar Eliminar Categoría
	$('#lblPaginaConfirmarFin_titulo').html(res_PaginaConfirmarFin_titulo);
	$('#lblConfirmarEliminaCategoria').html(res_ConfirmarEliminaCategoria);
	$('#ConfirmarSi').html(res_Si);
	$('#ConfirmarNo').html(res_No);
	
	// Página Detalle Categoría
	//$('#lnkNuevaTarjeta').html(res_NuevaDetalleCategoria);
	
	// Página Detalle Tarjeta
	//$('#btnTarjetaEditar').html(res_TarjetaEditar);
	//$('#btnTarjetaSonido').html(res_TarjetaSonido);
	//$('#btnCambiarTarjetaFavorita').html(res_TarjetaFavorita);
	//$('#btnTarjetaEliminar').html(res_TarjetaEliminar);
	
	// Página Nueva Tarjeta
	
	
	$('#listaNuevaTarjeta_separador').html(res_SeparadorCategoria);	
	$('#lblSeleccioneCategoria').html(res_SeleccioneCategoria);	
	$('#lblTextosNuevaTarjeta').html(res_Textos);
	
	
	$('#inputTitulo2Tarjeta').attr('placeholder',res_TraduccionNuevaTarjeta);
	$('#inputTituloTarjeta').attr('placeholder',res_NombreNuevaTarjeta);
	$('#lblFotoGaleria').html(res_FotoGaleria);//*********
	$('#lblFotoCamara').html(res_FotoCamara);//*********
	$('#lblMostrarTextoFondo').html(res_FondoNuevaTarjeta);
	$('#lblSonidoNuevaTarjeta').html(res_SonidoNuevaTarjeta);
	$('#btnCrearBubble').html(res_InsertarNuevaTarjeta);
	$('#btnCancelarBubble').html(res_Cancelar);//***
	
	
	/*
	$('#lblTamanioFuente').html(res_TamanioLetra);
	$('#lblMuyPequenio').html(res_MuyPequenio);
	$('#lblPequenio').html(res_Pequenio);
	$('#lblNormal').html(res_Normal);
	$('#lblGrande').html(res_Grande);
	$('#lblMuyGrande').html(res_MuyGrande);
	*/
	$('#lblAplicar').html(res_Aplicar);
	
	// Página Elegir fondo
	$('#lblTituloElegirFondo').html(res_TituloElegirFondo);
	
	// Página Grabación de audio
	$('#lblTituloGrabarSonido').html(res_TituloGrabarSonido);
	$('#lblDescripcionGrabarSonido').html(res_DescripcionGrabarSonido);
	$('#lblGrabar').html(res_Grabar);
	$('#lblParar').html(res_Parar);
	$('#lblCancelar').html(res_Cancelar);
	
	// Página confirmar eliminar tarjeta
	$('#lblTituloEliminaTarjeta').html(res_TituloEliminaTarjeta);
	$('#lblConfirmarEliminaTarjeta').html(res_ConfirmarEliminaTarjeta);
	$('#ConfirmarEliminarTarjetaSi').html(res_Si);
	$('#ConfirmarEliminarTarjetaNo').html(res_No);
	
	// Página Ajustes
	$('#lblTituloAjustes').html(res_TituloAjustes);
	$('#lblIdiomas').html(res_Idiomas);
	$('#lblEliminarInformacion').html(res_EliminarInformacion);
	$('#btnEliminarTodo').html(res_EliminarTodo);
	$('#tituloIdiomaPrincipal').html(res_IdiomaPrincipal);
	$('#tituloIdiomaSecundario').html(res_IdiomaSecundario);	
	$('#lblExplicacionEliminarTodo').html(res_ExplicacionEliminarTodo);
	
	// Página Confirmar Eliminar todo
	$('#lblEliminarTodo').html(res_EliminarTodo);
	$('#lblDescripcionEliminarTodo').html(res_DescripcionEliminarTodo);
	$('#lblEliminarTodo_Si').html(res_Si);
	$('#lblEliminarTodo_No').html(res_No);
	
	//Tutorial
	$('#textoTutorial1').html(res_TextoTutorial1)
	$('#textoTutorial3').html(res_TextoTutorial3)
	$('#textoTutorial4').html(res_TextoTutorial4)
	$('#textoTutorial5').html(res_TextoTutorial5)
	$('#textoTutorial6').html(res_TextoTutorial6)
	
}

