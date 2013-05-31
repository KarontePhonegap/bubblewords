var activarPhoneGap = true;
var tipoDispositivo = "";
var existeFoto = false;
var anchoFoto = 0;
var altoFoto = 0;
var mostrarTutorial;
var accessToken;
var idiomaPrincipal;
var idiomaSecundario;
var idiomaSistema;
var hayConexion;
var intervaloNormal, intervaloSinConexion, intervaloComprobarConexion;
var networkState;
var numTraducciones = 0;
var alertMostrado = false;
var uid, facebookAccessToken, estadoFacebook;
var intervaloSwipe = null;
var filtramosFavoritos=false;//la establecemos para saber cuando estamos visualizando los favoritos o no

function inicializar() {
    /*
     * En Android desactivamos las transiciones para evitar los incomodos 
     * parapadeos
     */
    if (device.platform == "Android") {
        $.mobile.defaultPageTransition = 'none';
        $.mobile.defaultDialogTransition = 'none';
    }else if (device.platform == "iOS") {
    	$.mobile.touchOverflowEnabled = true;
    }
    // Abre la base de datos
    
    
    ObtenerIdiomaSistema();
    AbrirBDD();
    ObtenerIdiomas();
    //cargarIdiomas();	
    comprobarTablas();
    ObtenerAppData();

    //Declaramos los event handlers para cuando se obtiene o pierde la conexion.
    document.addEventListener("offline", sinConexion, false);
    document.addEventListener("online", conConexion, false);
    document.addEventListener("resume", checkConnection, false);

    //Aplicamos estilos mediante jquery
    $('div.ContenidoTutorial > p').addClass("letraMediana");
    //ocultamos los divs de imagenes del formulario de nuevo bubble
    $('div.imagenFormulario').hide();

    $('#PaginaCategorias').on('pageshow', function () {
        //update($(this).find('.jtextfill span'));
        if (listaCategorias.length == 0 && mostrarTutorial) {
            navigator.notification.alert(res_guia_1, alertCallBack, res_guia_1_titulo, res_Aceptar);
        }
    });

    $('#PaginaNuevaCategoria').on('pageshow', function () {
        //update($(this).find('.jtextfill span'));
        if (listaCategorias.length == 0 && mostrarTutorial) {
            navigator.notification.alert(res_guia_2, alertCallBack, res_guia_2_titulo, res_Aceptar);
        }

    });
    $('#PaginaDetalleCategoria').on('pageshow', function () {
        //update($(this).find('.jtextfill span'));
        if (listaCategorias.length > 0 && listaTarjetas.length == 0 && mostrarTutorial) {
            navigator.notification.alert(res_guia_3, alertCallBack, res_guia_3_titulo, res_Aceptar);
        }
    });

    function alertCallBack() {
        console.log("Se ha cerrado el alert");
    }

    $('#PaginaDetalleTarjeta').on('pagebeforeshow', function () {
        compruebaSonido();
        /* Desactivamos Facebook
        if (device.platform.toUpperCase() == "IOS") {
            if (estadoFacebook != null && estadoFacebook === "connected") {
                $('#btnCompartirFB i').removeClass('desactivado');
                $('#btnCompartirFB').removeClass('btn-desactivado').on('click', publishStory);
            } else {
                $('#btnCompartirFB i').addClass('desactivado');
                $('#btnCompartirFB').addClass('btn-desactivado').off('click', publishStory);
            }
        } else {
            $('#btnCompartirFB').on('click', publishStory);
        }
        */

        console.log("Hay " + tarjetasPorCategoria.length + " tarjetas en esta categoria");
        if (listaCategorias.length > 0 && tarjetasPorCategoria.length == 2 && mostrarTutorial) {
            $('#TutorialTarjetas div p').html(res_tutorial_tarjetas);
            $('#TutorialTarjetas img').css('left', '-' + $(this).width() / 2 + 'px');
            //$('#PaginaDetalleTarjeta_content a').css('position','relative').css('left','-'+window.innerWidth/2+'px');
            var animaImagenSwipe = function () {
                    $('#TutorialTarjetas img').animate({
                        left: (window.innerWidth - ($(this).width() / 4)).toString() + 'px'
                    }, 2000, 'linear', function () {
                        $(this).animate({
                            left: '-' + $(this).width() / 2 + 'px'
                        }, 2000, 'linear');
                    });

/*$('#PaginaDetalleTarjeta_content a').animate({left:(window.innerWidth/2).toString()+'px'},2000,'linear',function(){
					$(this).animate({left:'-'+window.innerWidth/2+'px'},2000,'linear');					
				});
				*/
                }
            animaImagenSwipe();
            intervaloSwipe = setInterval(function () {
                animaImagenSwipe();
            }, 4000);

            $('#TutorialTarjetas').fadeIn().css('z-index', '200');
            $(window).on('touchstart', cerrarTutorial);
        }
    });

    $('#PaginaDetalleTarjeta').on('pageshow', function () {
        //update($(this).find('.jtextfill span'));
        $('.jtextfill').textfill({
            maxFontPixels: 200
        });
    }).on('swipeleft', function (event) {
        for (var i = 0; i < tarjetasPorCategoria.length; i++) {
            if (tarjetasPorCategoria[i].id > tarjetaActual.id) {
                console.log("Encontramos la proxima tarjeta");
                animaBubble(event, $(this), 'left', i);
                tarjetaActual = tarjetasPorCategoria[i];
                break;
            }
        }
    }).on('swiperight', function (event) {
        for (var i = tarjetasPorCategoria.length - 1; i >= 0; i--) {
            if (tarjetasPorCategoria[i].id < tarjetaActual.id) {
                console.log("Encontramos la tarjeta anterior");
                animaBubble(event, $(this), 'right', i);
                tarjetaActual = tarjetasPorCategoria[i];
                break;
            }
        }
    });

    $('#PaginaReversoTarjeta').on('pageshow', function () {
        console.log("Hay " + tarjetasPorCategoria.length + " tarjetas en favoritas");
        $('.jtextfillReverso').textfill({
            maxFontPixels: 200
        });
    }).on('swipeleft', function (event) {
        for (var i = 0; i < tarjetasPorCategoria.length; i++) {
            if (tarjetasPorCategoria[i].id > tarjetaActual.id) {
                console.log("Encontramos la proxima tarjeta");
                animaBubble(event, $(this), 'left', i);
                tarjetaActual = tarjetasPorCategoria[i];
                break;
            }
        }
    }).on('swiperight', function (event) {
        for (var i = tarjetasPorCategoria.length - 1; i >= 0; i--) {
            if (tarjetasPorCategoria[i].id < tarjetaActual.id) {
                console.log("Encontramos la tarjeta anterior");
                animaBubble(event, $(this), 'right', i);
                tarjetaActual = tarjetasPorCategoria[i];
                break;
            }
        }
    });

    document.addEventListener("backbutton", onBackButton, false);
    // Detección del dispositivo
    DetectarDimensiones();
    navigator.splashscreen.hide();
    //Inicializamos Facebook
    /*
    try {
        //Inicializamos el Plugin de Facebook El appId es el appid de la aplicacion de facebook
        FB.init({
            appId: "191807040969117",
            nativeInterface: CDV.FB,
            useCachedDialogs: false
        });
        //Obtenemos el estado del usuario
        FB.getLoginStatus(handleStatusChange);
        //Autorizamos la aplicacion
        authUser();
        updateAuthElements();
	*/
	
        /*
         * En Android el plugin da error al hacer login teniendo instalada la aplicación de Facebook, por lo que se deshabilita.
         * Cuando se intente compartir un  bubble automáticamente pedirá que iniciesmo sesión,
         * por lo contrario en iOS hay que hacer login porque si no falla, es por ello que se desactiva el botón de compartir en facebook 
         * en caso de que el usuario no esté logueado en facebook.
         * 
         * Cambiamos el botón para hacer login en caso de que el sistema sea iOS
         * o para quitar permisos en caso de que sea Android
         */
        /*
        if (device.platform == "Android") {
            $('#btnFBLogin').addClass('boton-Rojo').on('click', uninstallApp).html("<i class='icon-facebook-sign'></i>  " + res_eliminar_permisos);
        } else if (device.platform == "iOS") {
            $('#btnFBLogin').addClass('boton-Azul').on('click', promptLogin).html("<i class='icon-facebook-sign'></i>  Log in");
        }

    } catch (e) {
        console.error("Error loading Facebook Plugin: " + e);
    }
    */
}
/*
 * Oculta la guia que informa que se puede hacer slide entre las bubbles
 */

function cerrarTutorial() {
    //Ocultamos la guia
    $('#TutorialTarjetas').fadeOut();
    //Paramos el intervalo de la animación				
    clearInterval(intervaloSwipe);
    intervaloSwipe = null;
    mostrarTutorial = false;
    //Guardamos en la BD que ya se ha mostrado esta guia
    bwBD.transaction(function (tx) {
        console.log("Intentamos insertar registro en appdata");
        tx.executeSql("INSERT INTO AppData VALUES('FALSE')");
    }, errorBD, ComprobacionCorrecta);
    /*
     * Deshabilitamos el evento anterior que ejecutaba cerrarTutorial cada vez que se pulsara la
     * pantalla (para que solo se produzca una vez)
     */
    $(window).off('touchstart', cerrarTutorial);
}
/*
 * Si la tarjeta actual dispone de un sonido activamos el botón,
 * en caso contrario lo desactivamos
 */

function compruebaSonido() {
    if (tarjetaActual.sonido == "") {
        $('#btnTarjetaSonido i').addClass('desactivado');
        $('#btnTarjetaSonido').addClass('btn-desactivado');
    } else {
        $('#btnTarjetaSonido i').removeClass('desactivado');
        $('#btnTarjetaSonido').removeClass('btn-desactivado');
    }
}

/*
 * Funcion que realiza la animación a la hora de cambiar de bubble y actualiza la información.
 * 
 * @param evento: 	El evento que recibió su funcion anterior 
 * @param elemento: El elemento al cual se aplicará la animación, 
 * @param hacia: 	Hacia que lado se transicionará 
 * @param i:		Id del elemento a cargar
 */

function animaBubble(event, elemento, hacia, i) {
    if (hacia === 'left') {
        elemento.animate({
            left: '-' + elemento.css('width').toString()
        }, 500, 'swing', function () {
            CargarTarjeta(event, tarjetasPorCategoria[i].id, true);
            compruebaSonido();
            elemento.css('left', elemento.css('width'));
            elemento.animate({
                left: '0px'
            }, 500);
        });
    } else if (hacia === 'right') {
        elemento.animate({
            left: elemento.css('width').toString()
        }, 500, 'swing', function () {
            CargarTarjeta(event, tarjetasPorCategoria[i].id, true);
            compruebaSonido();
            elemento.css('left', '-' + elemento.css('width').toString());
            elemento.animate({
                left: '0px'
            }, 500);
        });
    }
}

/* 
 * Comprueba el estado de la conexión al iniciar la aplicación para notificar si las funciones de traducción
 * estarán disponibles ,se ejecuta despues de cargar los recursos de idiomas.
 */

function checkConnection() {
    networkState = navigator.connection.type;
    if (networkState == Connection.NONE) {
        sinConexion();
    } else {
        conConexion();
    }
}


/*
 * Devuelve un mensaje cuando se pierde la conexión y establece hayConexion a false
 */

function sinConexion() {
    console.log("Sin Conexion");
    hayConexion = false;
    navigator.notification.alert(res_conexion_no_disponible, '', res_titulo_conexion, res_Aceptar);
}
/*
 * Solicitamos un token de acceso al reestablecerse la conexión y creamos el intervalo de peticion normal
 */

function conConexion() {
    hayConexion = true;
    console.log("Existe o se ha reestablecido la conexion solicitamos el AccessToken");
    clearInterval(intervaloNormal);
    getAccessToken();
    //Obtener un token cada 9 minutos
    intervaloNormal = setInterval(getAccessToken, 9 * 60 * 1000);
}

/*
 * Este método controla la pulsación del botón atrás en los dispositivos que lo tengan disponible
 * y en caso de pulsarse estando en la pagina inicial termina la aplicación
 */

function onBackButton(event) {
    if ($('.ui-page-active').attr('id') == "PaginaInicial") {
        navigator.app.exitApp();
    } else {
        cerrarTutorial();
        Volver(event);
    }
}

/**
 * DetectarDimensiones. Detecta cuales son las dimensiones de la pantalla, para saber qué tamaños de imágenes tiene 
 * que aplicar a las tarjetas.
 */

function DetectarDimensiones() {
    if (window.innerWidth >= 768) {
        tipoDispositivo = "tablet";
    } else {
        if (window.innerWidth >= 640) {
            tipoDispositivo = "iPhone4";
        } else {
            tipoDispositivo = "iPhone3";
        }
    }
}
/*
 *	Funcion que muestra un confirm para actualizar a la versión completa de la aplicación.
 * 	Recibe el mensaje que queremos mostrar (esto se ha hecho asi para no tener que repetir varias 
 * 	veces el código ya que hay varios límites distintos (bubbles,categorias,traducciones) pero lo unico
 *  que cambiamos es el mensaje.
 */

function mensajeActualizar(mensaje) {
    navigator.notification.confirm(mensaje, function (buttonIndex) {
        if (buttonIndex == 1) {
            switch (device.platform.toUpperCase()) {
            case "ANDROID":
                window.open("https://play.google.com/store/apps/details?id=es.karonte.BubbleWordsTalkPro", '_system');
                break;
            case "IOS":
                window.open("https://itunes.apple.com/es/app/id641448326?mt=8", '_system');
                break;
            }
        }

    }, res_lite_actualizar, res_lite_botones);
}
/**
 * Volver. Retrocede una posición en la historia (para el botón 'Atrás')
 */

function Volver(e) {
    tarjetaEnEdicion = false;
    if (categoriasEnEdicion == true) {
        reiniciaCategorias();
    }
    e.stopPropagation();
    e.preventDefault();
    history.back();
}

function Volver2Veces(e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-2);
}

/**
 * PararEvento. Para la propagación del evento pasado como parámetro.
 * @param	event		evento que se desea parar
 */

function PararEvento(event) {
    event.stopPropagation();
    event.preventDefault();
}

/**
 * TieneCaracteres. Comprueba si el campo cuyo identificador es pasado como parámetro, tiene algún carácter.
 *
 * @param	campo	identificador del campo
 * @return	booleano que indica si el campo tiene caracteres
 */

function TieneCaracteres(campo) {
    var resultado = false;

    if ($(campo).attr('value').toString().length > 0) {
        resultado = true;
    }
    return resultado;
}

/**
 * ComprobarEliminarTodo. Se comprueba si el usuario ha seleccionado la eliminación de todo el contenido guardado.
 *
 * @param	evento		datos del botón pulsado
 */

function ComprobarEliminarTodo(evento) {
    if (parseInt(evento) == 1) {
        EliminarTodo();
        EliminarListaTarjetas();
        EliminarListaCategorias();
    }
}

/**
 * LimpiadoFormularioNuevaTarjeta. Elimina los valores previamente introducidos del formulario de Nueva tarjeta
 */

function LimpiadoFormularioNuevaTarjeta() {
    $('#lblTituloNuevaTarjeta').html(res_TituloNuevaTarjeta);
    $('#btnCrearBubble').html(res_InsertarNuevaTarjeta);

    $('#inputTituloTarjeta').val('');
    $('#inputTitulo2Tarjeta').val('');

    // Panel con la foto de la galería
    $('#pnlMostrarTextoFotoGaleria').addClass('in').show();
    $('#pnlMostrarImagenGaleria').removeClass('in').hide();

    // Panel con la foto de la cámara
    $('#pnlMostrarTextoFotoCamara').addClass('in').show();
    $('#pnlMostrarImagenCamara').removeClass('in').hide();


    // Panel para el fondo de la tarjeta
    $('#pnlMostrarTextoFondo').addClass('in').show();
    $('#pnlMostrarImagenFondo').removeClass('in').hide();


    // Panel para el sonido de la tarjeta
    $('#lblMostrarTextoSonido').html(res_ExplicacionSonido1);
    $('#pnlGrabacionSonido').removeClass('in').hide();
    $('#imgGrabacionSonido').attr('src', 'img/sound_add.png');

    $('#pnlMostrarTextoFondo').addClass('in').show();

    $('#lblTraduccionObtenida').html("");

    RepresentarCategorias();


    // Quitar cualquier foto anterior
    $('#imgPrincipalTarjetaGaleria').attr('src', '');
    $('#imgPrincipalTarjetaCamara').attr('src', '');
    $('#imgFondoTarjeta').attr('src', '');
    existeFoto = false;
    anchoFoto = 0;
    altoFoto = 0;
    nombreArchivoAudio = "";
    traduccionSugerida = "";
}


/*--- CONTROLADORES DE LOS COMPONENTES DE LA PÁGINA ---*/

/*--- PÁGINA: Inicial ---*/
$('#lnkNuevaTarjetaPrincipal').on('touchStart click', function (event) {

    var maxId = 0;
    $.each(listaTarjetas, function (i, item) {
        if (item.id > maxId) {
            maxId = item.id;
        }
    });
    /*
     * Comprobamos que en caso de ser la versión lite, no se hayan alcanzado el numero amximo de bubbles
     */

    if ((!liteVersion) || (liteVersion && maxId < maxBubbles)) {
        // Se comprueba si hay alguna categoria
        LimpiadoFormularioNuevaTarjeta(event);
        //console.log("Nº de categorías: " + listaCategorias.length);
        if (listaCategorias.length == 0) {
            navigator.notification.alert(res_SinCategoria);
        } else {
            // Activa la selección de categoría    
            ActivarSeleccionCategorias();
            $.mobile.changePage($('#PaginaNuevaTarjeta'), {
                changeHash: 'false'
            });
        }
    } else if (maxId > 0) {
        /*
         * Si se ha llegado al limite de bubbles en la versión lite mostramos el mensaje
         */
        mensajeActualizar(res_lite_bubbles);
    }
});

/*--- PÁGINA: PaginaCategorias ---*/
$('#btnEditarCategorias').on('touchStart click', function (event) {
    CambiarModoEdicionCategorias();
    PararEvento(event);
});


$('#btnAnadirCategoria').on('touchStart click', function (event) {
    var maxId = 0;
    $.each(listaCategorias, function (i, item) {
        if (item.id > maxId) {
            maxId = item.id;
        }
    });
    /*
     * Si se ha superado el limite de categorias en la version lite mostramos un mensaje para que actualize a la version completa
     */
    if ((!liteVersion) || (liteVersion && maxId < maxCategorias)) {
        $.mobile.changePage($('#PaginaNuevaCategoria'));
    } else if (maxId > 0) {
        mensajeActualizar(res_lite_categorias);
    }
});

/* PÁGINA: PaginaNuevaCategoría */
$('#btnInsertarCategoria').on('touchStart click', function (event) {
    if (TieneCaracteres('#inputNombreCategoria')) {
        var nombre = $('#inputNombreCategoria').val();
        var descripcion = $('#inputDescripcionCategoria').val()
        $('#PaginaNuevaCategoria').find(':input').val("");
        NuevaCategoria(nombre, descripcion);
        // Vuelve a la página anterior
        Volver(event);
    }
    PararEvento(event);
});

/*--- PÁGINA: PaginaDetalleCategoria ---*/
$('#lnkNuevaTarjeta').on('touchStart click', function (event) {

    var maxId = 0;
    $.each(listaTarjetas, function (i, item) {
        if (item.id > maxId) {
            maxId = item.id;
        }
    });

    /*
     * Si se ha superado el limite de bubbles en la version lite mostramos un mensaje para que actualize a la version completa
     */

    if ((!liteVersion) || (liteVersion && maxId < maxBubbles)) {
        // Ocultar la selección de categoría
        DesactivarSeleccionCategorias();
        LimpiadoFormularioNuevaTarjeta(event);
        $.mobile.changePage($('#PaginaNuevaTarjeta'), {
            changeHash: 'false'
        });
    } else if (maxId > 0) {
        mensajeActualizar(res_lite_bubbles);
    }
});

/*--- PÁGINA: PaginaNuevaTarjeta ---*/
$('#pnlResultadoTraduccion').on('touchStart click', function (event) {
    //navigator.notification.alert("Hemos obtenido la traduccion: "+traduccionSugerida)
    AplicarTraduccion(event);
    PararEvento(event);
});

$('#btnImagenTarjetaGaleria').on('touchStart click', function (event) { // Obtiene la foto de la tarjeta desde el albúm de fotos del dispositivo
    navigator.camera.getPicture(function (imageData) {
        $("<img />").attr("src", imageData).on('load', function () {
            MostrarImagenDeGaleria(imageData, tipoDispositivo);
            //console.log("Foto seleccionada. Ancho: " + anchoFoto + ", alto: " + altoFoto);
        });

    }, function (message) {
        //navigator.notification.alert("Error al obtener la fotografía: " + message);
        //console.log("No se ha seleccionado ninguna fotografía desde la galería");
        existeFoto = false;
    }, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        targetWidth: 100,
        correctOrientation: true
    });
    PararEvento(event);
});

$('#btnImagenTarjetaCamara').on('touchStart click', function (event) {
    // Obtiene la foto de la tarjeta desde la cámara directamente   
    navigator.camera.getPicture(function (imageURI) {
        $("#imgPrincipalTarjetaCamara").attr("src", imageURI).on('load', function () {
            MostrarImagenDeCamara(imageURI, tipoDispositivo);
        });
    }, function (error) {
        console.log(error.target.error.code);
    }, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 2000,
        targetHeight: 1000,
        correctOrientation: true,
        saveToPhotoAlbum: false
    });
    //}
    PararEvento(event);
});

$('#btnImagenFondoTarjeta').on('touchStart click', function (event) {
    // Construcción de la lista de fondos de tarjetas
    for (var i = 1; i <= 15; i++) {
        var imagen = "<img src=\'img/texturas/muestras/textura" + i + ".jpg\' />";
        $('#lstFondosParaTarjeta').append("<div><a href='javascript:;' onClick=\"SeleccionarFondoTarjeta(event, '" + i + "','" + tipoDispositivo + "',true)\">" + imagen + "</a></div>");

    }
    $.mobile.changePage($('#PaginaElegirFondo'), {
        changeHash: 'false'
    });
    PararEvento(event);
});

$('#btnObtenerSonido').on('touchStart click', function (event) {
    ComprobarEstadoGrabacion(event);
});

$('#btnCrearBubble').on('touchStart click', function (event) {
    var fondo = "";
    var foto = "";
    var sonido = "";
    var cat = 0;
    var fuente = "";
    var tamanioFuente = 3;
    var nombreBubble = "";
    var traduccionBubble = "";

    //Hacemos visibles todos los textos    	
    $('#pnlMostrarTextoFotoCamara').addClass("in").show();
    $('#pnlMostrarTextoFotoGaleria').addClass("in").show();
    $('#pnlMostrarTextoFondo').addClass("in").show();

    //console.log("Entro en btnCrearBubble");
    if (tarjetaEnEdicion) { // ACTUALIZACIÓN DE LA TARJETA
        // Se comprueba si los campos obligatorios están correctos
        if ((TieneCaracteres('#inputTituloTarjeta')) && (TieneCaracteres('#inputTitulo2Tarjeta'))) {
            tarjetaActual.categoria = categoriaActual.id;

            tarjetaActual.titulo1 = $.trim($('#inputTituloTarjeta').attr('value'));
            tarjetaActual.titulo2 = $.trim($('#inputTitulo2Tarjeta').attr('value'));

            // Comprobar si se ha seleccionado una foto de la galería o una foto de la cámara
            if ($('#imgPrincipalTarjetaGaleria').attr('src') != null && $('#imgPrincipalTarjetaGaleria').attr('src').length > 0) {
                tarjetaActual.foto = $('#imgPrincipalTarjetaGaleria').attr('src');
                tarjetaActual.anchoFoto = anchoFoto;
                tarjetaActual.altoFoto = altoFoto;
            }
            if ($('#imgPrincipalTarjetaCamara').attr('src') != null && $('#imgPrincipalTarjetaCamara').attr('src').length > 0) {
                tarjetaActual.foto = $('#imgPrincipalTarjetaCamara').attr('src');
                tarjetaActual.anchoFoto = anchoFoto;
                tarjetaActual.altoFoto = altoFoto;
            }

            // Se comprueba si no se ha seleccionado una foto válida
            if (tarjetaActual.foto.length == 0) {
                tarjetaActual.foto = "img/imagen_no_disponible.jpg";
            }

            //Refrescamos la imagen si se produjo un cambio
            RepresentarListaTarjetas(categoriaActual);


            // Fondo
            tarjetaActual.fondo = fondoActual;

            // Sonido
            tarjetaActual.sonido = nombreArchivoAudio;

            // Fuente
            tarjetaActual.fuente = $('#inputFuente').attr('value');

            // Tamaño de la fuente
            //tarjetaActual.tamanioFuente = $('#inputTamanioFuente').attr('value');
            // Comprobación definitiva para la actualización
            if ((tarjetaActual.titulo1.length > 0) && (tarjetaActual.titulo2.length > 0)) {

                ActualizarTarjeta(event, tarjetaActual);
                tarjetaEnEdicion = false;
                Volver(event);
            } else {
                // Se le indica al usuario que no están todos los campos obligatorios
                navigator.notification.alert(res_CamposObligatorios);
            }
        }
    } else {
        if ((TieneCaracteres('#inputTituloTarjeta')) && (TieneCaracteres('#inputTitulo2Tarjeta'))) {
            console.log("El fondo actual es: " + fondoActual);
            console.log("El fondo seleccionado es:" + $('#imgFondoTarjeta').attr('src'));
            fondo = fondoActual;

            nombreBubble = $.trim($('#inputTituloTarjeta').attr('value'));
            traduccionBubble = $.trim($('#inputTitulo2Tarjeta').attr('value'));

            // Categoría relacionada
            if (seleccionarCategorias) {
                cat = $('#inputCategoriaRelacionada').attr('value');
            } else {
                cat = categoriaActual.id;
            }

            // Se comprueba si está activado el PhoneGap para obtener las fotos del dispositivo, o poner la foto por defecto
            if (activarPhoneGap) {
                if ($('#imgPrincipalTarjetaGaleria').attr('src') != null && $('#imgPrincipalTarjetaGaleria').attr('src').length > 0) {
                    foto = $('#imgPrincipalTarjetaGaleria').attr('src');
                }
                if ($('#imgPrincipalTarjetaCamara').attr('src') != null && $('#imgPrincipalTarjetaCamara').attr('src').length > 0) {
                    foto = $('#imgPrincipalTarjetaCamara').attr('src');
                }
                sonido = nombreArchivoAudio;
            } else {
                foto = "img/imagen_no_disponible.jpg";
                anchoFoto = 250;
                altoFoto = 167;
                sonido = '';
            }

            // Se comprueba si no se ha seleccionado una foto válida
            if (foto.length == 0) {
                foto = "img/imagen_no_disponible.jpg";
            }
            //console.log("Foto a insertar: " + foto);
            // Fuente de la tarjeta
            fuente = $('#inputFuente').attr('value');

            // Tamaño de la fuente
            //tamanioFuente = $('#inputTamanioFuente').attr('value');
            NuevaTarjeta(cat, nombreBubble, traduccionBubble, fondo, foto, sonido, anchoFoto, altoFoto, fuente);

            fondoActual = 1;

            $.mobile.changePage($('#PaginaDetalleCategoria'));

            // Se vuelven a establecer los valores por defecto de estos campos
            LimpiadoFormularioNuevaTarjeta(event);
        } else {
            // No se han establecido los elementos necesarios para la inserción de un nuevo Bubble
            navigator.notification.alert(res_CamposObligatorios);
        }
    }

    PararEvento(event);
});

//Nuevo btnCancelar
//Cancelamos la creacion del Bubble y volvemos hacia atrás
$('#btnCancelarBubble').on('touchStart click', function (event) {
    LimpiadoFormularioNuevaTarjeta(event);
    Volver(event);
});

/*--- PÁGINA: PaginaDetalleTarjeta ---*/
$('#btnTarjetaEditar').on('touchStart click', function (event) {
    //console.log("Entro en btnTarjetaEditar");
    // Se indica que la tarjeta está en edición
    tarjetaEnEdicion = true;

    //Hacemos visibles todos los textos    	
    $('div.imagenFormulario').hide();
    $('#pnlMostrarTextoFondo').addClass('in').show();
    $('#pnlMostrarTextoSonido').addClass('in').show();
    $('#pnlMostrarTextoFotoCamara').addClass('in').show();
    $('#pnlMostrarTextoFotoGaleria').addClass('in').show();


    try {
        // Carga de la información en los campos de página de inserción de la tarjeta
        DesactivarSeleccionCategorias();
        LimpiadoFormularioNuevaTarjeta(event);

        // Cambio en el título de la página y del boton insertar(cambia a actualizar)
        $('#lblTituloNuevaTarjeta').html(res_TituloActualizarTarjeta);

        $('#inputTituloTarjeta').attr('value', tarjetaActual.titulo1); // Nombre
        $('#inputTitulo2Tarjeta').attr('value', tarjetaActual.titulo2); // Traducción
        $('#inputFuente option[value=' + tarjetaActual.fuente + ']').attr("selected", true); // Fuente de la tarjeta
        //$('#inputTamanioFuente option[value=' + tarjetaActual.tamanioFuente + ']').attr("selected", true);    // Tamaño de la fuente
        // Obtención de la foto asociada a la tarjeta
        MostrarImagenDeGaleria(tarjetaActual.foto, tipoDispositivo);

        // Obtención del fondo de la tarjeta
        SeleccionarFondoTarjeta(event, tarjetaActual.fondo, tipoDispositivo, false);
        fondoActual = tarjetaActual.fondo;

        nombreArchivoAudio = tarjetaActual.sonido;

        // Texto del botón de ACTULIZAR
        $('#btnCrearBubble').html(res_TituloActualizarTarjeta);


        // Ir a la página de inserción de tarjetas
        $.mobile.changePage($('#PaginaNuevaTarjeta'), {
            changeHash: 'false'
        });
    } catch (e) {
        //console.log(e.message);
    }

    PararEvento(event);
});

$('#btnEliminaTarjeta').on('touchStart click', function (event) {
    navigator.notification.confirm(
    res_ConfirmarEliminaTarjeta, // Mensaje
    ComprobarEliminarTarjeta, // Función
    res_TituloEliminaTarjeta, // Título
    'Ok, Cancel');
    PararEvento(event);
});

$('#btnCambiarTarjetaFavorita').on('touchStart click', function (event) {
    navigator.notification.vibrate(50);
    if (tarjetaActual.favorita == 0) {
        tarjetaActual.favorita = 1;
        $('#btnCambiarTarjetaFavorita').addClass("ui-btn-favorito");
        //console.log("Tarjeta cambiada a favorita");
        ActualizarTarjeta(event, tarjetaActual);
    } else {
        tarjetaActual.favorita = 0;
        $('#btnCambiarTarjetaFavorita').removeClass("ui-btn-favorito");
        ActualizarTarjeta(event, tarjetaActual);
        //Si estamos en la seccion favoritos recargamos y redireccionamosa la categoria
        if (filtramosFavoritos) {
        	CargarCategoria(event, 0, true);
        }
    }
    PararEvento(event);
});

/*--- PÁGINA: PaginaAjustes ---*/
// Detección del campo de selección en los campos select
$('#lstIdiomaPrincipal').on('change', function (event) {
    $('#lstIdiomaPrincipal').selectmenu('refresh');
    comprobarIdioma();
    CambiarIdiomas($('#lstIdiomaPrincipal').attr('value'), $('#lstIdiomaSecundario').attr('value'));
});
$('#lstIdiomaSecundario').on('change', function (event) {
    $('#lstIdiomaSecundario').selectmenu('refresh');
    CambiarIdiomas($('#lstIdiomaPrincipal').attr('value'), $('#lstIdiomaSecundario').attr('value'));
});
$('#btnEliminarTodo').on('touchEvent click', function (event) {
    navigator.notification.confirm(
    res_DescripcionEliminarTodo, // Mensaje
    ComprobarEliminarTodo, // Función	
    res_EliminarInformacion, // Título
    'Ok, Cancel');

    EliminarTodo();
    PararEvento(event);
});

/*--- PÁGINA: PaginaTutorial1 ---*/
$('#PaginaTutorial1').on('swipeleft', function (event) {
    $.mobile.changePage($('#PaginaTutorial3'));
    PararEvento(event);
});

/*--- PÁGINA: PaginaTutorial3 ---*/
$('#PaginaTutorial3').on('swipeleft', function (event) {
    $.mobile.changePage($('#PaginaTutorial4'));
    PararEvento(event);
}).on('swiperight', function (event) {
    Volver(event);
});

/*--- PÁGINA: PaginaTutorial4 ---*/
$('#PaginaTutorial4').on('swipeleft', function (event) {
    $.mobile.changePage($('#PaginaTutorial5'));
    PararEvento(event);
}).on('swiperight', function (event) {
    Volver(event);
});

/*--- PÁGINA: PaginaTutorial5 ---*/
$('#PaginaTutorial5').on('swipeleft', function (event) {
    $.mobile.changePage($('#PaginaTutorial6'));
    PararEvento(event);
}).on('swiperight', function (event) {
    Volver(event);
});

/*--- PÁGINA: PaginaTutorial6 ---*/
$('#PaginaTutorial6').on('swiperight', function (event) {
    Volver(event);
});