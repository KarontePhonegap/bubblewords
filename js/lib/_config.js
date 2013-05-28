//////////////////////////
//
// Config
// Set your app id here.
//
//////////////////////////
var gAppID = '191807040969117';

//Initialize the Facebook SDK
//See https://developers.facebook.com/docs/reference/javascript/
window.fbAsyncInit = function() {
    FB.init({ 
        appId: gAppID,
        nativeInterface: CDV.FB,
        status: true,
        cookie: true,
        xfbml: true,
        frictionlessRequests: true,
        oauth: true,        
        useCachedDialogs: false
    });  
  authUser();
  updateAuthElements();
};
/*
// Load the SDK Asynchronously
(function(d){
 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement('script'); js.id = id; js.async = true;
 js.src = "//connect.facebook.net/es_ES/all.js";
 ref.parentNode.insertBefore(js, ref);
}(document));
*/