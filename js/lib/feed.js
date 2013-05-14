//////////////////////////
//
// News Feed
// See the "News Feed" section on https://developers.facebook.com/mobile
//
//////////////////////////

//Publish a story to the user's own wall


function publishStory() {   
    var contenido ="";
    var indice;
    if(idiomaPrincipal.toLowerCase() == "es"){
        indice=0;
       // navigator.notification.alert("El idioma principal es Español");
    }else{
        indice=1;
       // navigator.notification.alert("El idioma principal es Ingles");
    }
   // console.log("Tarjeta actual/ idioma de: "+tarjetaActual.idiomaDe+" idioma a: "+tarjetaActual.idiomaA);
    //console.log("Contenido del feed: "+res_Compartir+" "+objIdiomas[tarjetaActual.idiomaDe][indice]+" = "+tarjetaActual.titulo1+" / "+objIdiomas[tarjetaActual.idiomaA][indice]+" = "+tarjetaActual.titulo2)

    contenido =res_Compartir+" "+objIdiomas[tarjetaActual.idiomaDe][indice]+" = "+tarjetaActual.titulo1+" / "+objIdiomas[tarjetaActual.idiomaA][indice]+" = "+tarjetaActual.titulo2;
      if (tarjetaActual){
      FB.ui({
        method: 'feed',
        name: 'BubbleWords Talk',
        caption: res_Compartir_Subtitulo,
        description: contenido,
        link: 'http://www.bubblewords.info',
        picture: "http://www.bubblewords.info/img/Ico512x512.png",
        actions: [{ name: res_Descargar, link: 'https://play.google.com/store/apps/details?id=es.karonte.BubbleWordsTalkPro' }],
      }, 
      function(response) {
        //console.log('publishStory UI response: ', response);
      });
  }else{
      //navigator.notification.alert("Error al compratir tarjeta");
  }
}

//Publish a story to the user's friend's wall
function publishStoryFriend() {
  randNum = Math.floor ( Math.random() * friendIDs.length ); 

  var friendID = friendIDs[randNum];
  
  console.log('Opening a dialog for friendID: ', friendID);
  
  FB.ui({
    method: 'feed',
    to: friendID,
    name: 'I\'m using the Hackbook web app',
    caption: 'Hackbook for Mobile Web.',
    description: 'Check out Hackbook for Mobile Web to learn how you can make your web apps social using Facebook Platform.',
    link: 'http://apps.facebook.com/mobile-start/',
    picture: 'http://www.facebookmobileweb.com/hackbook/img/facebook_icon_large.png',
    actions: [{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }],
    user_message_prompt: 'Tell your friends about building social web apps.'
  }, 
  function(response) {
    console.log('publishStoryFriend UI response: ', response);
  });
}