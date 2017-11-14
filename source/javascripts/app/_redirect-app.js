function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  console.log('Query variable %s not found', variable);
}

var app = getQueryVariable('app');
if ( (window.location.pathname === '' ||window.location.pathname === '/' || window.location.pathname === '/doc-api/' )) {
  if(app && ['gfw', 'rw', 'aqueduct'].indexOf(app) >= 0) {
    window.location.href = 'index-'+app+'.html';
  } else {
    window.location.href = 'index-rw.html';
  }
}
