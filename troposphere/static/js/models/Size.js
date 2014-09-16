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

    var Size = Base.extend({
      defaults: { 'model_name': 'size' },

      parse: function (attributes) {
        attributes.id = attributes.alias;
        attributes.mem = attributes.mem / 1024;
        return attributes;
      },

      formattedDetails: function () {
        var parts = [
          this.get('cpu') + ' CPUs',
          this.get('mem') + ' GB memory'
        ];
        if (this.get('disk'))
          parts.push(this.get('disk') + ' GB disk');
        if (this.get('root'))
          parts.push(this.get('root') + ' GB root');

        return this.get('name') + " (" + parts.join(', ') + ")";
      }
    });

    _.extend(Size.defaults, Base.defaults);

    return Size;

  });
