function sendsms(to, msg, $http, glancesms){
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      var res = glancesms.save({"to":to,"msg":msg});
      forge.logging.log("SMS Sent : "+JSON.stringify(res));
}