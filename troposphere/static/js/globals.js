define([], function () {

  var servers = {
    MOCK: 'http://atmosphere.apiary-mock.com',
    PRODUCTION: '/api/v1',
    DEVELOPMENT: 'https://atmobeta.iplantc.org:443/api/v1'
  };

  function getApiServer(){
    if(window.location.hostname === 'localhost'){
      //return servers.MOCK;
      return servers.DEVELOPMENT;
    }else{
      return servers.PRODUCTION;
    }
  }

  return {
    servers: servers,

    API_ROOT: getApiServer(),

    slash: function(){
      if(getApiServer() === servers.MOCK){
        return ""
      }else{
        return ""
      }
    }
  }

});
