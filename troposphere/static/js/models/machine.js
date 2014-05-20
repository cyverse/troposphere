define(
  [
    'underscore',
    'models/base'
  ],
  function (_, Base) {

    var Machine = Base.extend({
      defaults: { 'model_name': 'machine' },
      parse: function (response) {
        response.id = response.alias;
        response.start_date = new Date(response.start_date);
        return response;
      },
      computed: {
        pretty_version: function () {
          var parts = this.get('version').split('.');
          for (var i = 0; i <= 3 - parts.length; i++)
            parts.push("0");
          return parts.join(".");
        }
      }
    });

    _.extend(Machine.defaults, Base.defaults);

    return Machine;
  });
