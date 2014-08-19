if(window.location.hostname === 'localhost'){
  Atmo.API_ROOT = '/api/v1';
}else{
  Atmo.API_ROOT = 'https://atmobeta.iplantc.org:443/api/v1';
}
