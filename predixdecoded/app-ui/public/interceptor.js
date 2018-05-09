var Interceptor = $q => {

  var _request = config => {
    //
    //config.headers['Content-Type'] = 'application/json';
    //
    //if(CLIENT && CLIENT.uuid) {
    //  config.headers.tenant = CLIENT.uuid;
    //}
    //
    //if(TOKEN && TOKEN.token_type) {
    //  config.headers.Authorization = TOKEN.token_type + ' ' + TOKEN.access_token;
    //}
    //
    //if (config.method === 'PATCH') {
    //  config.method = 'POST';
    //  //config.headers["X-HTTP-Method-Override"] = 'PATCH';
    //}
    return config;
  };

  var _response = config => {
    return config;
  };

  var _requestError = rejection => {
    return $q.reject(rejection);
  };

  var _responseError = rejection => {
    //console.log('_responseError - rejection', rejection);
    return $q.reject(rejection);
  };

  return {
    request:       _request,
    response:      _response,
    requestError:  _requestError,
    responseError: _responseError
  };
};

Interceptor.$inject = ['$q'];

export default Interceptor;
