var mediaRec;		// Variable que servirá para manejar las grabaciones de sonidos desde el dispositivo
var nombreArchivoAudio = ''; 	// Variable donde se guardará el nombre que se le ha dado al archivo de Audio actual
var extensionArchivo;	// Variable que indicará la extensión a utilizar en el archivo de sonido (depende del dispositivo)
var estadoGrabacion = "SinIniciar";		// Estado de la grabación de un sonido: SinIniciar, Preparado, Grabando, Finalizado

function ComprobarEstadoGrabacion(event){
	//console.log("Entro en ComprobarEstadoGrabacion");
	$('#pnlGrabacionSonido').addClass('in').show();
	switch(estadoGrabacion){
		case "SinIniciar":
			estadoGrabacion = "Preparado";
			
			// Cambiar la explicación de la grabación
			$('#lblMostrarTextoSonico').html(res_ExplicacionSonido2);
			
			//$('#imgGrabacionSonido').css('height', '128px');
			
			// Mostrar la capa con el icono de grabación
			
			PararEvento(event);
			break;	
			
		case "Preparado":		// Se ha pulsado sobre el botón de grabación del sonido
			estadoGrabacion = "Grabando";
			
			// Modificación de la explicación
			$('#lblMostrarTextoSonido').html(res_ExplicacionSonido3);
			
			// Modificación del icono de la grabación
			$('#imgGrabacionSonido').attr('src', 'img/sound_on.gif');
			
			GrabarSonido(event);			
			break;
			
		case "Grabando":
			estadoGrabacion = "Finalizado";
			
			// Modificación de la explicación
			$('#lblMostrarTextoSonido').html(res_ExplicacionSonido4);
			
			// Modificación del icono de la grabación
			$('#imgGrabacionSonido').attr('src', 'img/sound_accept.png');
			
			PararGrabacionSonido(event);
			PararEvento(event);
			break;
			
		case "Finalizado":		// Si el sonido ya se ha guardado, se vuelve a iniciar el proceso
			estadoGrabacion = "Preparado";
			
			// Cambiar la explicación de la grabación
			$('#lblMostrarTextoSonido').html(res_ExplicacionSonido2);
			
			// Mostrar la capa con el icono de grabación
			$('#pnlGrabacionSonido').addClass('in').show();
			$('#imgGrabacionSonido').attr('src', 'img/sound_add.png');
			PararEvento(event);
			break;	
	}
}

function GrabarSonido(event){
	var fechaHoy = new Date();
	
	switch(device.platform.toUpperCase()){
		case "ANDROID":
			extensionArchivo = ".3gp";
			break;
		case "BLACKBERRY":
			extensionArchivo = ".amr";
			break;
		case "IOS":
			extensionArchivo = ".wav";
			break;
		default:
			extensionArchivo = ".amr";
			break;
	}
	
	nombreArchivoAudio = fechaHoy.getTime().toString() + extensionArchivo;
	//console.log("Nombre del archivo de audio: " + nombreArchivoAudio);
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
         fileSystem.root.getDirectory("BubbleWords-Sonidos", {create:true, exclusive:false}, function(directorio){
                //console.log("Se crea o se accede al directorio BubbleWords-Sonidos");
                // Una vez accedido al directorio BubbleWords-Sonidos, hay que crear el archivo
                //console.log("La version de OS es "+device.platform.toUpperCase());
                if(device.platform.toUpperCase()=="IOS"){
                     directorio.getFile(nombreArchivoAudio, {create:true, exclusive:false}, function(fichero){
                         //console.log("Se ha creado el archivo " + nombreArchivoAudio);                         
                         mediaRec = new Media(fichero.fullPath, onSuccessGrabacion, onErrorGrabacion);
                         mediaRec.startRecord();
                    }, function(error3){
                         //console.log("No se ha podido crear el archivo " + nombreArchivo + ": " + error3.code);
                    });            
                }else{
                     //Creamos un archivo .nomedia para que los sonidos no aparezcan en el reproductor de musica de ANDROID  
                    directorio.getFile(".nomedia", {create:true, exclusive:false}, function(fichero){
                        //console.log("Se ha creado el archivo .nomedia");
                    }, function(error3){
                        //console.log("No se ha podido crear el archivo .nomedia: " + error3.code);
                    });
                    //console.log("Comenzamos a grabar");
                    var src="BubbleWords-Sonidos/"+nombreArchivoAudio;
                    //console.log("El archivo es: "+src);
                    mediaRec = new Media(src, onSuccessGrabacion, onErrorGrabacion);
                    mediaRec.startRecord();                
                }                            
            }, function(error2){
                //console.log("Imposible crear el directorio de Sonidos para BubbleWords");
            });        
	}, function(error){
		//console.log("Error ----> "+error.target.error.code);
	});
	
	PararEvento(event);
}

/*
function GrabarSonido(event){
	var fechaHoy = new Date();
	
	switch(device.platform.toUpperCase()){
		case "ANDROID":
			extensionArchivo = ".amr";
			break;
		case "BLACKBERRY":
			extensionArchivo = ".amr";
			break;
		case "IOS":
			extensionArchivo = ".wav";
			break;
		default:
			extensionArchivo = ".amr";
			break;
	}
	
	nombreArchivoAudio = fechaHoy.getTime().toString() + extensionArchivo;
	//console.log("Nombre del archivo de audio: " + nombreArchivoAudio);
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
         fileSystem.root.getDirectory("BubbleWords-Sonidos", {create:true, exclusive:false}, function(directorio){
                                      //console.log("Se crea o se accede al directorio BubbleWords-Sonidos");
                                      
                                      // Una vez accedido al directorio BubbleWords-Sonidos, hay que crear el archivo
                                      directorio.getFile(nombreArchivoAudio, {create:true, exclusive:false}, function(fichero){
                                                         //console.log("Se ha creado el archivo " + nombreArchivoAudio);
                                                         
                                                         mediaRec = new Media(fichero.fullPath, onSuccessGrabacion, onErrorGrabacion);
                                                         mediaRec.startRecord();
                                                         }, function(error3){
                                                         //console.log("No se ha podido crear el archivo " + nombreArchivo + ": " + error3.code);
                                                         });
                                      
                                      }, function(error2){
                                      //console.log("Imposible crear el directorio de Sonidos para BubbleWords");
                                      });
         }, function(error){
         //console.log(error.target.error.code);
         });

	PararEvento(event);
}
*/
function PararGrabacionSonido(event){
	mediaRec.stopRecord();
}

function onSuccessGrabacion(){
	//console.log("Se ha guardado el audio correctamente");	
}

function onErrorGrabacion(error){
	//console.log("Error	en la grabación del audio: " + error.code + ", mensaje=" + error.message);
}

function ReproducirSonido(event){	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		fileSystem.root.getDirectory("BubbleWords-Sonidos", {create:false, exclusive:false}, function(directorio){
			//console.log("Se accede o se accede al directorio BubbleWords-Sonidos");
			
			// Una vez accedido al directorio BubbleWords-Sonidos, hay que obtener el archivo a reproducir
			directorio.getFile(tarjetaActual.sonido, {create:false, exclusive:false}, function(fichero){
				//console.log("Se accede al achivo " + tarjetaActual.sonido);
				//console.log("Su ruta completa es: "+fichero.fullPath);
				$('#btnTarjetaSonido').addClass('ui-btn-favorito');
				mediaRec = new Media(fichero.fullPath, onSuccessReproduccion, onErrorReproduccion);
				var mediaTimer=null;
				mediaRec.play();
				/*
				 * Creamos un intervalo y lo establecemos a 200ms
				 * este intervalo comprueba la posicion de la reproduccion actual, y en caso de que
				 * la posicion sea menor que 0 significará que se ah terminado la reproducción
				 * por lo que podemos quitar la clase al boton de reproduccion.
				 */
				if (mediaTimer == null) {
                	mediaTimer = setInterval(function() {
                    	// get my_media position
                    	mediaRec.getCurrentPosition(
	                        // success callback
	                        function(position) {
	                        	//console.log("El audio esta en la posicion: "+position+" sec")
	                            if (position < 0 ) {
	                            	$('#btnTarjetaSonido').removeClass('ui-btn-favorito');
	                            	clearInterval(mediaTimer);
	                            }
	                        },
	                        // error callback
	                        function(e) {
	                            console.log("Error getting sound pos=" + e);	                            
	                        }
	                    );
	                }, 200);
	            }

				
				
			}, function(error3){
				//console.log("No se ha podido abrir el archivo " + tarjetaActual.sonido + ": " + error3.code);
			});
			
		}, function(error2){
			//console.log("Imposible acceder al directorio de Sonidos para BubbleWords");
		});
	}, function(error){
		//console.log(error.target.error.code);
	});

	PararEvento(event);	
}

function obtenerRuta() {

    var ruta = window.location.pathname;
    ruta = ruta.substr( ruta, ruta.length - 10 );
    return 'file://' + ruta;

};

function ReproducirSonidoEstatico(){
	var src ="click.wav"; 
	if(device.platform.toUpperCase()=="ANDROID"){
		src = obtenerRuta() + 'click.wav';
	}    
    //console.log("La ruta del archivo a reproducir es: "+src);    
	mediaRec = new Media(src, onSuccessReproduccion, onErrorReproduccion);
	mediaRec.play();
	navigator.notification.vibrate(50);
}

function onSuccessReproduccion(){
	//console.log("Se ha reproducido el archivo correctamente");	
	/*navigator.notification.alert(
    'Reproducido con exito!',     // mensaje (message)
    '',
    '',            // titulo (title)
    'Cerrar'                // nombre del botón (buttonName)
	);
	*/

}

function onErrorReproduccion(error){
	//console.log("Error en la reproducción del archivo actual: " + error.code + ", mensaje=" + error.menssage);	
	
	/*navigator.notification.alert(
    'Se ha producido un error al reproducir el archivo: '+ error.code + ", mensaje=" + error.menssage,     // mensaje (message)
    '',
    '',            // titulo (title)
    'Cerrar'                // nombre del botón (buttonName)
	);
	*/
}