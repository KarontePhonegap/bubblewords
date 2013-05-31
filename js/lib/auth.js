//////////////////////////
//
// Authentication
// See "Logging the user in" on https://developers.facebook.com/mobile
//
//////////////////////////

var user = [];

var permissions = ['user_status', 'publish_checkins', 'user_likes'];


//Detect when Facebook tells us that the user's session has been returned
function authUser() {
  FB.Event.subscribe('auth.statusChange', handleStatusChange);
}

// Handle status changes
function handleStatusChange(response) {	   
	estadoFacebook = response.status;
	if (response.status === 'connected') {
		// the user is logged in and has authenticated your
		// app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed
		// request, and the time the access token 
		// and signed request each expire
		
		/*
		 * Mostramos el botón de logout en los ajustes
		 */      	
		$('#btnFBLogin').removeClass('boton-Azul').addClass('boton-Rojo').off('click',promptLogin).on('click',uninstallApp).html("<i class='icon-facebook-sign'></i>  "+res_eliminar_permisos);	
		
	} else if (response.status === 'not_authorized') {
		// the user is logged in to Facebook, 
		// but has not authenticated your app
		if (device.platform == "iOS"){
			/*
		 	* Mostramos el botón de login en los ajustes
		 	*/
			
			$('#btnFBLogin').removeClass('boton-Rojo').addClass('boton-Azul').off('click',uninstallApp).on('click',promptLogin).html("<i class='icon-facebook-sign'></i>  Log in");
		}
		logout(); 
		
		navigator.notification.alert('Error getting user info: ' + JSON.stringify(response.error));
        console.log('Error getting user info: ' + JSON.stringify(response.error));
        navigator.notification.alert("The app was removed. Please log in again.");
	} else {
		console.log("No hay sesion de facebook");
		if (device.platform == "iOS"){
			/*
		 	* Mostramos el botón de login en los ajustes
		 	*/			
			$('#btnFBLogin').removeClass('boton-Rojo').addClass('boton-Azul').off('click',uninstallApp).on('click',promptLogin).html("<i class='icon-facebook-sign'></i>  Log in");
		}
	}
}
function getUserInfo(){
	FB.api('/me', function(me){
		console.log(JSON.stringify(me));
		if (me.id) {
	    	uid = me.id;
	        console.log(uid);
	    }
	});
}
//Check the current permissions to set the page elements.
//Pass back a flag to check for a specific permission, to
//handle the cancel detection flow.
function checkUserPermissions(permissionToCheck) {
  var permissionsFQLQuery = 'SELECT ' + permissions.join() + ' FROM permissions WHERE uid = me()';
  FB.api('/fql', { q: permissionsFQLQuery },
    function(response) {
      if (estadoFacebook == 'connected') {         
          if (permissionToCheck) {
            if (response.data[0][permissionToCheck] == 1) {
              navigator.notification.alert("The '" + permissionToCheck + "' permission has been granted.");
              return true;
            } else {
              navigator.notification.alert('You need to grant the ' + permissionToCheck + ' permission before using this functionality.');              
            } return false;
          }
          return true;
      }
  });
}

//Prompt the user to login and ask for the 'email' permission
function promptLogin() {
  FB.login(null, {scope: 'email'});
}

//This will prompt the user to grant you acess to a given permission
function promptPermission(permission) {
  FB.login(function(response) {
    if (response.authResponse) {
      checkUserPermissions(permission)
    }
  }, {scope: permission});
}

//See https://developers.facebook.com/docs/reference/api/user/#permissions
function uninstallApp() {
	navigator.notification.confirm(res_quitar_permisos_fb,
		function(buttonIndex){
			if (buttonIndex == 2){
				console.log("Boton 2 SI");
				FB.api('/me/permissions', 'DELETE',
			    	function(response) {
				      	//window.location.reload();
				      	// For may instead call logout to clear
				      	// cache data, ex: using in a PhoneGap app
				      	console.log('APP Uninstalled');
				      	estadoFacebook="not_connected";
				      	console.log("Hacemos log out");
						     
				        if (device.platform == "iOS"){
							$('#btnFBLogIn').removeClass('boton-Rojo').addClass('boton-Azul').on('click',promptLogin).html("Facebook Log in");
						}
						logout();
					});
			}			
	},
	res_titulo_permisos_fb,
	res_No+","+res_Si);
}

//See https://developers.facebook.com/docs/reference/javascript/FB.logout/
function logout() {
  FB.logout();
}
