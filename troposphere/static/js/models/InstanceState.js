import _ from "underscore";
import Backbone from "backbone";

// InstanceState manages the status/activity of an instance. An instance would
// have an status/activity of active/rebooting for example.

var InstanceState = Backbone.Model.extend({

  isInFinalState: function () {
    var validStates = [
      "active",
      "error",
      "active - deploy_error",
      "active - user_deploy_error",
      "suspended",
      "shutoff"
    ];

    if (this.get('status') === "build")
        return false;
    return _.contains(validStates, this.get('status_raw'));
  },

  // This method is a slight hack, there is a larger problem with how we keep
  // track of state. It is documented in ATMO-1120.
  isDeployError: function () {
    var status = this.get('status');
    var activity = this.get('activity');

    return status === "active" && (activity === "deploy_error" || activity === "user_deploy_error");
  },

  getPercentComplete: function () {
    var status = this.get('status');
    var activity = this.get('activity');
    var percentComplete = 100;
    if (status && activity) {
      percentComplete = get_percent_complete(status, activity);
    }
    return percentComplete;
  },

  initialize: function (attributes, options) {
    var tokens = attributes.status_raw.split('-').map(s => s.trim());
    var status = tokens[0];
    var activity = attributes.activity;

    this.set('status_raw', attributes.status_raw);
    this.set('status', status);
    this.set('activity', activity);
  }

});

var get_percent_complete = function (state, activity) {
  var lookup,
    states = {
      // Number represents percent task *completed* when in this state
        'build': {
            'block_device_mapping': 10,
            'scheduling': 20,
            'networking': 30,
            'spawning': 40,
            'deleting': 50,
        },
        'active': {
            'powering-off': 50,
            'image_uploading': 50,
            'deleting': 50,
            'suspending': 50,
            'initializing': 50,
            'networking': 60,
            'deploying': 70,
            'running_boot_script': 90
        },
        'hard_reboot': {
            'rebooting-hard': 50
        },
        'reboot': {
            'rebooting': 50
        },
        'shutoff': {
            'powering-on': 50
        },
        'suspended': {
            'resuming': 50
        },
        'error': {}
  };

  lookup = states[state];

  if(!lookup) {
    lookup = {};
    console.error("Unknown state (%s) representation passed", state);
  }
  if(state === 'error') {
    console.log("Error state processed: activity = %s", activity);
  }

  // Note: 100 is graphically similar to 0
  return lookup[activity] || 100;
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
  else if (activity === 'user_deploy_error') {
    return 'user_deploy_error';
  }
  else if (activity === 'deploy_error') {
    return 'deploy_error';
  }
  else {
    // Applies for: build, shutoff, and suspended
    return 'active';
  }
};

export default InstanceState;
