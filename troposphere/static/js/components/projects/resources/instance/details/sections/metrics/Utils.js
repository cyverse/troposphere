
let fetch = function(uuid, urlParams, onSuccess, onError) {
    var api = API_V2_ROOT + "/metrics";

    // Request extra datapoints to account for occasional null data at
    // front/end
    var extra = 2;

    var req = api + "/" + uuid + ".json" +
      "?field=" + urlParams.field +
      "&res="   + urlParams.res   +
      "&size="  + (urlParams.size + extra);

    if (urlParams.fun) {
      req += "&fun=" + urlParams.fun;
    }

    d3.json(req)
      .header("Authorization", "Token " + access_token)
      .get(function(error, json) {

        if (!json) return onError && onError();
        var data = json[0].datapoints

        // Trim initial/final null values
        if (data[0][0] == null) {
          data.splice(0, 1);
        }

        data.length = urlParams.size;

        onSuccess(data.map(function(arr) {
          return { x: arr[1] * 1000, y: arr[0] };
        }));

    })
}


let bytesToString = function (bytes) {
    var fmt = d3.format('.0f'),
      isNegative = bytes < 0,
      output = "";

    bytes = Math.abs(bytes);
    if (bytes < 1024) {
      output = fmt(bytes) + 'B';
    } else if (bytes < 1024 * 1024) {
      output = fmt(bytes / 1024) + 'kB';
    } else if (bytes < 1024 * 1024 * 1024) {
      output = fmt(bytes / 1024 / 1024) + 'MB';
    } else {
      output = fmt(bytes / 1024 / 1024 / 1024) + 'GB';
    }
    return isNegative ? "-" + output : output;
}

let get = function(name) {
    return function(obj) {
      return obj[name];
    };
};

export default {
    get: get,
    fetch: fetch,
    bytesToString: bytesToString
}
