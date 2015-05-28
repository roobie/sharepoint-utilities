(function module(global) {
  // Module
  var sputils = global.sputils = global.sputils || {};

  var STR = 'string';

  /*
   * Based off of
   * https://github.com/yanatan16/nanoajax
   * https://github.com/yanatan16/nanoajax/commit/4988099161ca0b8966bb2faae6dd18aeca55fd17
  **/
  function getRequest() {
    if (global.XMLHttpRequest) {
      return new global.XMLHttpRequest;
    } else {
      try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
    }

    throw new Error('This platform does not have a suitable XHR implementation.');
  }

  function setDefault(obj, key, value) {
    obj[key] = obj[key] || value
  }

  sputils.ajax = function (params, callback) {
    if (typeof params === STR) params = {url: params};
    var headers = params.headers || {}
      , body = params.body
      , method = params.method || (body ? 'POST' : 'GET')
      , withCredentials = params.withCredentials || false;

    var xhr = getRequest();

    // has no effect in IE
    // has no effect for same-origin requests
    // has no effect in CORS if user has disabled 3rd party cookies
    xhr.withCredentials = withCredentials;

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        callback(xhr.status, xhr.responseText, xhr);
      }
    }

    if (body) {
      setDefault(headers, 'X-Requested-With', 'XMLHttpRequest');
      setDefault(headers, 'Content-Type', 'application/json');
      setDefault(headers, 'Accept', 'application/json;odata=verbose');
    }

    xhr.open(method, params.url, true);

    for (var field in headers) {
      xhr.setRequestHeader(field, headers[field]);
    }

    xhr.send(body && typeof body !== STR ?
      JSON.stringify(body) :
      (body || null));

    return xhr;
  };

  var makeRequester = function (method) {
    return function doAjax(params) {
      // This promise could be a HTML5 Promise, or a Bluebird promise or a...
      return new global.Promise(function (resolve, reject) {
        function handler(status, response, request) {
          if (status < 300 && status >= 200) {
            resolve({
              data: response,
              status: status,
              request: request
            });
          } else {
            reject({
              error: new Error(response),
              status: status,
              request: request
            });
          }
        }

        params = typeof params === STR ? { url: params } : params;
        params.headers = params.headers || {};
        params.method = method.toUpperCase();

        var xhr = sputils.ajax(params, handler);
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", resolve);
      }).then(function toJSON(result) {
        try {
          result.data = JSON.parse(result.data);
        } catch (e) { }
        return result;
      });
    };
  };

  var api = ['get', 'post', 'put', 'delete'];
  api.forEach(function (method) {
    sputils.ajax[method] = makeRequester(method);
  });

})(window);
