/*--- PROPIEDADES ---*/
var bwBD;

/*--- MÉTODOS RELACIONADOS ---*/
function AbrirBDD(){
	bwBD = window.openDatabase("bubbleWords", "1.0", "Bubble Words", 2000000);
	bwBD.transaction(crearTablas, errorBD, ComprobacionCorrecta);
	
	}
	
function crearTablas(tx){
	console.warn("Creamos las Tablas");	
	tx.executeSql('CREATE TABLE IF NOT EXISTS Categorias(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50), descripcion VARCHAR(200))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Tarjetas(id INTEGER PRIMARY KEY AUTOINCREMENT, categoria INTEGER, titulo1 VARCHAR(50), titulo2 VARCHAR(50), fondo VARCHAR(100), foto VARCHAR(100), sonido VARCHAR(100), favorita INTEGER, anchoFoto INTEGER, altoFoto INTEGER, fuente VARCHAR(50), idiomaDe CHAR(2), idiomaA CHAR(2))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS LangData(principal VARCHAR(2),secundario VARCHAR(2))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS AppData(mostrarTutorial BOOLEAN)');
	console.warn("Tablas creadas");

}
function comprobarTablas(){
	// Una vez abierta la base de datos, se comprueba que están las tablas con las categorías y tarjetas ...
	bwBD.transaction(comprobarBD, errorBD, ComprobacionCorrecta);
}

function comprobarBD(tx){	
		// Inserción de categorías y tarjetas de prueba
	/*tx.executeSql("INSERT INTO Categorias(id, nombre, descripcion) VALUES(1, 'Categoria 1', 'Prueba de categoría 1')");
	tx.executeSql("INSERT INTO Categorias(id, nombre, descripcion) VALUES(2, 'Categoria 2', 'Segunda categoría')");*/
	tx.executeSql("select * from Tarjetas", [], TarjetasObtenidas);	
	tx.executeSql("select * from Categorias", [], CategoriasObtenidas);

}

function errorBD(err){
	console.error("Error al procesar una consulta SQL: " + err.message + ", código: " + err.code);	
}

function ComprobacionCorrecta(){
	//console.error("Se ha creado o comprobado correctamente la base de datos");
}

/**
 * CategoriasObtenidas. Se obtiene la lista de categorías que está almacenada en la base de datos, para guardarla
 * en la variable 'listaCategorias'.
 */
function CategoriasObtenidas(tx, results){
	var len = results.rows.length;
	console.log("Numero de categorias: "+len);
	for (var i=0; i < len; i++) {
		var categoria = results.rows.item(i);
		listaCategorias.push({'id': categoria.id, 'nombre': categoria.nombre, 'descripcion': categoria.descripcion});
	}
	//console.error("Llego a Categorias obtenidas: " + len);
	if(results.rows.length>0){
		console.log(listaTarjetas);
		RepresentarCategorias();
	}else{
		console.log("Vaciamos la lista de categorias");
		$('#lstCategorias').empty();
		EliminarListaCategorias();
	}	
}

/**
 * TarjetasObtenidas. Se obtiene la lista de las tarjetas que están almacenadas en la base de datos, para representarlas
 * en la variable listaTarjetas.
 */
function TarjetasObtenidas(tx, results){
	console.log("Numero de tarjetas: "+results.rows.length);
	for (var i=0; i < results.rows.length; i++) {
		var tarjeta = results.rows.item(i);
		listaTarjetas.push({'id': tarjeta.id, 'categoria': tarjeta.categoria, 'titulo1': tarjeta.titulo1, 
		'titulo2': tarjeta.titulo2, 'fondo': tarjeta.fondo, 'foto': tarjeta.foto, 'sonido': tarjeta.sonido, 
		'favorita': tarjeta.favorita, 'anchoFoto': tarjeta.anchoFoto, 'altoFoto': tarjeta.altoFoto, 
		'fuente':tarjeta.fuente, 'tamanioFuente': tarjeta.tamanioFuente,'idiomaDe':tarjeta.idiomaDe,'idiomaA':tarjeta.idiomaA});
		//console.error("Tarjeta obtenida con ancho: " + tarjeta.anchoFoto + ", alto: " + tarjeta.altoFoto);
	}
	//console.error("Tarjetas de la BD obtenidas: " + results.rows.length);
	
	// Limpieza de la lista de categorías
	
	
	if(results.rows.length < 1){
		console.log("Vaciamos la lista de tarjetas");		
		$('#inputCategoriaRelacionada').empty();
		EliminarListaTarjetas();
	}
}

/**
 * EliminarTodo. Elimina toda la información de las tablas Categorias y Tarjetas.
 */
function EliminarTodo(){
	console.log("Contenido de las tablas antes de borrar");
	comprobarTablas();
	bwBD.transaction(function(tx){		
		tx.executeSql('DELETE FROM Tarjetas WHERE 1');
		tx.executeSql('DELETE FROM Categorias WHERE 1');
		//comprobarBD(tx);
		console.log("Contenido de las tablas despues de borrar");
		comprobarTablas();
	}, errorBD, ComprobacionCorrecta);
}

function ObtenerTarjetasPorCategoria(idCategoria){
	//navigator.notification.alert("Entramos en ObtenerIdiomas")
	bwBD.transaction(function(tx){
		//navigator.notification.alert("Llamamos a ConsultarIdiomas")
		
		tx.executeSql("select * from Tarjetas where categoria ="+idCategoria +" order by id", [], ConsultarTarjetasPorCategoria);
	}, errorBD, ComprobacionCorrecta);
	
}

function ObtenerTarjetasFavoritas(){
	//navigator.notification.alert("Entramos en ObtenerIdiomas")
	bwBD.transaction(function(tx){
		//navigator.notification.alert("Llamamos a ConsultarIdiomas")
		
		tx.executeSql("select * from Tarjetas where favorita = 1 order by id", [], ConsultarTarjetasPorCategoria);
	}, errorBD, ComprobacionCorrecta);
	
}

function ConsultarTarjetasPorCategoria(tx,results){  
	//navigator.notification.alert("Obtenemos las tarjetas por categorias")  
   if(results.rows.length > 0){
   		tarjetasPorCategoria = [];  
        for (var i=0; i < results.rows.length; i++) {
		var tarjeta = results.rows.item(i);
		tarjetasPorCategoria.push({'id': tarjeta.id, 'categoria': tarjeta.categoria, 'titulo1': tarjeta.titulo1, 
		'titulo2': tarjeta.titulo2, 'fondo': tarjeta.fondo, 'foto': tarjeta.foto, 'sonido': tarjeta.sonido, 
		'favorita': tarjeta.favorita, 'anchoFoto': tarjeta.anchoFoto, 'altoFoto': tarjeta.altoFoto, 'fuente':tarjeta.fuente,
		'idiomaDe':tarjeta.idiomaDe,'idiomaA':tarjeta.idiomaA});

		}
    }
}

//Consultamos si el tutorial se ha terminado
function ObtenerAppData(){
	bwBD.transaction(function(tx){	
		tx.executeSql("select * from AppData", [], ConsultarAppData);
	}, errorBD, ComprobacionCorrecta);	
}

function ConsultarAppData(tx,results){
	if (results.rows.length == 0){		
		mostrarTutorial= true;
		console.log("Mostramos el tutorial por primera vez tiene valor: "+mostrarTutorial);
	}else{		
		mostrarTutorial = false;		
		console.log("Mostramos el tutorial tiene valor: "+mostrarTutorial);
	}	
}

function ObtenerIdiomas(){
	//navigator.notification.alert("Entramos en ObtenerIdiomas")
	bwBD.transaction(function(tx){
		//navigator.notification.alert("Llamamos a ConsultarIdiomas")		
		tx.executeSql("select * from LangData", [], ConsultarIdiomas);
	}, errorBD, ComprobacionCorrecta);	
}

function ConsultarIdiomas(tx,results){  
	//navigator.notification.alert("Entramos en ConsultarIdiomas, obtenemos "+results.rows.length+" tuplas")  
    if (results.rows.length == 0){       
        console.error("No existe informacion de idiomas, El idioma del sistema es: "+idiomaSistema)
        if(idiomaSistema != "es"){
        	console.warn("##############3 El idioma del telefono es: Distinto de Español")
            principal = "en";
            secundario = "es";
        }else{
        	console.warn("##############3 El idioma del telefono es: Español")
        	principal = "es";
            secundario = "en";
        }
        //console.error("No existia informacion de idiomas, establecemos los idiomas por defecto: Principal: "+principal+" Secundario: "+secundario);
        //console.error("insertamos los idiomas por defecto");        
        tx.executeSql("INSERT INTO LangData(principal,secundario) VALUES('"+principal+"','"+secundario+"')");
        //navigator.notification.alert("insertamos registro por defecto de idioma");           
        //console.error("insertamos registros en langdata");
        idiomaPrincipal=principal;
        idiomaSecundario=secundario;
        InicializarIdiomas();
        //comprobarIdioma(); 

        //navigator.notification.alert("consultamos los idiomas");
        
        //tx.executeSql("select * from LangData", [], ObtenerIdiomas); 
        //console.error("Volvemos a cargar los idiomas");
        //console.error("Fin obtenerIdiomas idioma del Sistema: "+idiomaSistema+" Idioma principal: "+idiomaPrincipal+" Idioma Secundario: "+idiomaSecundario);
		//debugAlert("Fin obtener Idiomas idioma del Sistema: "+idiomaSistema+" Idioma principal: "+idiomaPrincipal+" Idioma Secundario: "+idiomaSecundario);	

        
    }else if(results.rows.length > 0){
    	idiomaPrincipal= results.rows.item(0).principal;
        idiomaSecundario= results.rows.item(0).secundario;
        //console.log("Obtenemos los idiomas guardados la consulta devuelve: "+results.rows.item(0).principal+" / "+results.rows.item(0).secundario);

        //console.log(" y los establecemos: "+idiomaPrincipal+" / "+idiomaSecundario);
		//comprobarIdioma();
		InicializarIdiomas();
    }
}
function CambiarIdiomas(principal,secundario){
	//bwBD = window.openDatabase("bubbleWords", "1.0", "Bubble Words", 2000000);
	if (principal == secundario){
		navigator.notification.vibrate(200);
   		navigator.notification.confirm(
            res_TextoIdiomasIguales,      // mensaje
            '',             // función
            res_TituloIdiomasIguales,      // título
            'Ok,Cancel'                         // botones de acción
        );
	}
	
	
    bwBD.transaction(function(tx){
        console.error("Cambiamos los idiomas: ")
        try{
        	//navigator.notification.alert("actualizar idiomas,recibimos parametros, principal: "+principal+" secundario: "+secundario);
        	//console.error("Procedemos a actualizar los idiomas,recibimos los siguientes parametros, principal: "+principal+" secundario: "+secundario);
            tx.executeSql("UPDATE LangData SET principal ='"+principal+"', secundario = '"+secundario+"'");
            
            idiomaPrincipal=principal;
            idiomaSecundario=secundario;
            comprobarIdioma();
        }catch(e){
            console.error("Error al actualizar los idiomas de la bd "+e);
            //navigator.notification.alert("Error al actualizar los idiomas de la bd "+e);
        }    
    }, errorBD, ComprobacionCorrecta);
   
}

