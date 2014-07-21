define([], function () {

  var servers = {
    APIARY_MOCK: 'http://atmosphere.apiary-mock.com',
    ALOM: '/api/v1',
    DALLOWAY: 'https://alom.iplantc.org:443/api/v1'
  };

  function getApiServer(){
    if(window.location.hostname === 'localhost'){
      //return servers.APIARY_MOCK;
      return servers.DALLOWAY;
    }else{
      return servers.ALOM;
    }
  }

  return {
    servers: servers,

    API_ROOT: getApiServer(),

    slash: function(){
      if(getApiServer() === servers.APIARY_MOCK){
        return ""
      }else{
        return ""
      }
    }
  }

});
