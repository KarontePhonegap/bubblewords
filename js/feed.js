//////////////////////////
//
// News Feed
// See the "News Feed" section on https://developers.facebook.com/mobile
//
//////////////////////////

//Publish a story to the user's own wall
function publishStory() {
  if (tarjetaActual){
      FB.ui({
        method: 'feed',
        name: 'Estoy usando BubbleWords Talk para mejorar mis idiomas!',
        caption: 'BubbleWords Talk',
        description: 'Mira la tarjeta que he creado!\n'+idiomaSecundario.toUpperCase()+": "+tarjetaActual.titulo1+"\n"+idiomaPrincipal.toUpperCase()+": "+tarjetaActual.titulo2,
        link: 'http://www.bubblewords.info',
        picture: tarjetaActual.foto,
        actions: [{ name: 'Descargar en Google PLay', link: 'https://play.google.com/store/search?q=bubble+words+talk' }],
      }, 
      function(response) {
        console.log('publishStory UI response: ', response);
      });
  }else{
      navigator.notification.alert("Error al compratir tarjeta");
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