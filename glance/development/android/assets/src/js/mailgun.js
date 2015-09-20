function sendverificationemail($http, glancemail, email, uid){
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      var res = glancemail.save({"mailid":email,"uid":uid});
      forge.logging.log("SMS Email : "+JSON.stringify(res));
}