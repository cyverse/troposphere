import ScriptConstants from 'constants/ScriptConstants';
import Script from 'models/Script';
import Utils from '../Utils';

export default {

    create: function(params){
      if(!params.title) throw new Error("Missing title");
      if(!params.type) throw new Error("Missing type");
      if(!params.text) throw new Error("Missing text");

      var title = params.title,
          script_type = params.type,
          text = params.text;

      var script = new Script({
        title: title,
        type: script_type,
        text: text
      });

      // Add the script optimistically
      Utils.dispatch(ScriptConstants.ADD_SCRIPT, {script: script}, {silent: false});

      script.save().done(function () {
        Utils.dispatch(ScriptConstants.UPDATE_SCRIPT, {script: script}, {silent: false});
      }).fail(function () {
        Utils.dispatch(ScriptConstants.REMOVE_SCRIPT, {script: script}, {silent: false});
      });
      return script;
    }

  };
