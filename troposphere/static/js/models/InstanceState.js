define(
  [
    'underscore',
    'backbone'
  ],
  function (_, Backbone) {

    var get_percent_complete = function(state, activiy) {

      // Number represents percent task *completed* when in this state
      var states = {
        'build': {
          'block_device_mapping': 10,
          'scheduling': 20,
          'networking': 30,
          'spawning': 40
        },
        'active': {
          'powering-off': 50,
          'image_uploading': 50,
          'deleting': 50,
          'suspending': 50,
          'initializing': 50,
          'networking': 60,
          'deploying': 70
        },
        'shutoff': {
          'powering-on': 50
        },
        'suspended': {
          'resuming': 50
        }
      };

      return states[state][activiy];
    };

    var get_final_state = function (activity) {
      // Check for the final state to prevent reverting if a queued task hasn't begun yet
      if (activity === 'powering-off') {
        return 'shutoff';
      }
      else if (activity === 'deleting') {
        return 'deleted';
      }
      else if (activity === 'suspending') {
        return 'suspended';
      }
      else if (activity === 'deploy_error') {
        return 'deploy_error';
      }
      else {
        // Applies for: build, shutoff, and suspended
        return 'active';
      }
    };

    return Backbone.Model.extend({

      isInFinalState: function(){
        var validStates = [
          "active",
          "error",
          "active - deploy_error",
          "suspended",
          "shutoff"
        ];

        if(this.get('status') === "build") return false;

        var isInFinalState = validStates.indexOf(this.get('status_raw')) >= 0;
        return isInFinalState;
      },

      getPercentComplete: function(){
        var status = this.get('status');
        var activity = this.get('activity');
        var percentComplete = 100;
        if(status && activity) {
          percentComplete = get_percent_complete(status, activity);
        }
        return percentComplete;
      },

      initialize: function(attributes, options){

        var statusTokens = attributes.status_raw.split('-');
        var state = statusTokens[0].trim();
        var activity = null;

        if(statusTokens.length === 2){
          activity = statusTokens[1].trim();
        }else if(statusTokens.length === 3){
          // Deal with Openstack Grizzly's hyphenated states "powering-on" and "powering-off"
          activity = statusTokens[1].trim() + '-' + statusTokens[2].trim();
        }

        this.set('status', state);
        this.set('activity', activity);
      }

    });

  });
