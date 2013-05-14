//////////////////////////
//
// Authentication
// See "Logging the user in" on https://developers.facebook.com/mobile
//
//////////////////////////

var user = [];

//Detect when Facebook tells us that the user's session has been returned
function authUser() {
  FB.Event.subscribe('auth.statusChange', handleStatusChange);
}

function handleStatusChange(session) {
    console.log('Got the user\'s session: ', session);
    
    if (session.authResponse) {        
        //Fetch user's id, name, and picture
        //Ponemos el boton de facebook como log out
          FB.api('/me', {
          fields: 'name, picture'
        },
        function(response) {
          if (!response.error) {
            user = response;            
            console.log('Got the user\'s name and picture, la respuesta es: ');
            console.log(response);
            
            //Update display of user name and picture
            
            if (document.getElementById('user-name')) {
              document.getElementById('user-name').innerHTML = user.name;
            }
            if (document.getElementById('user-picture')) {
              if (user.picture.data) {
                  document.getElementById('user-picture').src = user.picture.data.url;
              } else {
                  document.getElementById('user-picture').src = user.picture;
              }
            }
          }
          
          clearAction();
        });
    } else {             
      clearAction();
    }
}

//Prompt the user to login and ask for the 'email' permission
function promptLogin() {
  FB.login(null, {scope: 'email'});
}

//This will prompt the user to grant you acess to their Facebook Likes
function promptExtendedPermissions() {
  FB.login(function() {
    setAction("The 'user_likes' permission has been granted.", false);
    
    setTimeout('clearAction();', 2000);
    
    //document.body.className = 'permissioned';
  }, {scope: 'user_likes'});
}

//See https://developers.facebook.com/docs/reference/rest/auth.revokeAuthorization/
function uninstallApp() {    
    console.log("Entramos en uninstallApp");
  FB.api({method: 'auth.revokeAuthorization'},
    function(response) {
     // window.location.reload();
     // To clear the local storage cache and native session, call logout
     logout();
     console.log("Revocamos autorizacion");
    });
}

//See https://developers.facebook.com/docs/reference/javascript/FB.logout/
function logout() {
    console.log("Entramos en log out");
  FB.logout(function(response) {
    window.location.reload();
    console.log("Hacemos log out");
  });
}