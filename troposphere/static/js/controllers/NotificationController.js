define(
  [
    'toastr',
    'underscore'
  ],
  function (toastr, _) {

    toastr.options = {
      "timeOut": "3000",
      "extendedTimeOut": "3000"
    };

    var notify = function (type, title, message, options) {
      options = options || {};
      options = _.defaults(options, toastr.options);

      if (type === "success") {
        toastr.success(message, title, options);
      } else if (type === "info") {
        toastr.info(message, title, options);
      } else if (type === "error") {
        toastr.error(message, title, options);
      } else if (type === "warning") {
        toastr.warning(message, title, options);
      }

    };

    return {
      success: notify.bind(null, 'success'),
      info: notify.bind(null, 'info'),
      warning: notify.bind(null, 'warning'),
      error: notify.bind(null, 'error')
    };

  });
