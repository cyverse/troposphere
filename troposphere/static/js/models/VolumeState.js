define(
  [
    'underscore',
    'backbone'
  ],
  function (_, Backbone) {

    var get_percent_complete = function(state) {

      // Number represents percent task *completed* when in this state
      var states = {
        'detaching': 50,
        'attaching': 50,
        'available': 100,
        'in-use': 100
      };

      return states[state];
    };

    return Backbone.Model.extend({

      isInFinalState: function(){
        var finalStates = [
          'available',
          'in-use'
        ];

        var isInFinalState = finalStates.indexOf(this.get('status_raw')) >= 0;
        return isInFinalState;
      },

      isDeployError: function(){
        return false;
      },

      getPercentComplete: function(){
        var status = this.get('status');
        var percentComplete = 100;
        if(status) {
          percentComplete = get_percent_complete(status);
        }
        return percentComplete;
      },

      initialize: function(attributes, options){
        this.set('status', attributes.status_raw);
      }

    });

  });
