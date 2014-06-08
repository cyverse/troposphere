define(
  [
    'underscore',
    'models/Base'
  ],
  function (_, Base) {

    /*
     {
     "occupancy": 0,
     "total": 1,
     "remaining": 1,
     "active": true,
     "alias": "1",
     "name": "tiny1",
     "provider": 4,
     "cpu": 1,
     "disk": 30,
     "root": 0,
     "mem": 4096
     }
     */

    var statics = {
      format_megabytes: function (mb) {
        var memoryScalar = mb;
        var memoryUnits = "MB";
        if (mb > 1024) {
          var digits = mb % 1024 == 0 ? 0 : 1;
          memoryScalar = (mb / 1024).toFixed(digits);
          memoryUnits = "GB";
        }
        return memoryScalar + " " + memoryUnits;
      }
    };

    var Size = Base.extend({
      defaults: { 'model_name': 'size' },

      parse: function (attributes) {
        attributes.id = attributes.alias;
        return attributes;
      },

      formattedDetails: function () {
        var parts = [this.get('cpu') + ' CPUs',
          Size.format_megabytes(this.get('mem')) + ' memory'];
        if (this.get('disk'))
          parts.push(this.get('disk') + ' GB disk');
        if (this.get('root'))
          parts.push(this.get('root') + ' GB root');

        return this.get('name') + " (" + parts.join(', ') + ")";
      }
    }, statics);

    _.extend(Size.defaults, Base.defaults);

    return Size;

  });
