define([], function () {

  var servers = {
    MOCK: 'http://atmosphere.apiary-mock.com',
    PRODUCTION: '/api/v1',
    DEVELOPMENT: 'https://atmobeta.iplantc.org:443/api/v1'
  };

  var servers_v2 = {
    PRODUCTION: '/api/v2',
    DEVELOPMENT: 'http://localhost:8000/api/v2'
  };

  function getApiServer(){
    if(window.location.hostname === 'localhost'){
      //return servers.MOCK;
      return servers.DEVELOPMENT;
    }else{
      return servers.PRODUCTION;
    }
  }

  function getApiV2Server(){
    if(window.location.hostname === 'localhost'){
      return servers_v2.DEVELOPMENT;
    }else{
      return servers_v2.PRODUCTION;
    }
  }

  return {
    servers: servers,

    API_ROOT: getApiServer(),
    API_V2_ROOT: getApiV2Server(),

    slash: function(){
      if(getApiServer() === servers.MOCK){
        return ""
      }else{
        return ""
      }
    }
  }

});
