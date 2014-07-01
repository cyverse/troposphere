/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    '../instance_launch/IdentitySelect.react'
  ],
  function (React, Backbone, IdentitySelect) {

    function getState() {
      var state = {
        volumeName: null,
        volumeSize: null,
        identityId: null
      };

      this.state = this.state || {};

      // Use provided volume name or default to nothing
      state.volumeName = this.state.volumeName || "";

      // Use provided volume size or default to 1 GB
      state.volumeSize = this.state.volumeSize || 1;

      // Use selected identity or default to the first one
      state.identityId = this.state.identityId || this.props.identities.first().id;

      return state;
    }

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return getState.apply(this);
      },

      emitChange: function(){
        var isValid = this.state.identityId &&
                      this.state.volumeName.length > 0 &&
                      this.state.volumeSize;

        var resourceProps = {
          identityId: this.state.identityId,
          volumeName: this.state.volumeName,
          volumeSize: this.state.volumeSize
        };

        this.props.onChange(isValid, resourceProps);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProviderIdentityChange: function(e){
        var newIdentityId = e.target.value;
        this.state.identityId = newIdentityId;
        this.setState({identityId: newIdentityId});
        this.emitChange();
      },

      onVolumeNameChange: function(e){
        var newVolumeName = e.target.value;
        this.state.volumeName = newVolumeName;
        this.setState({volumeName: newVolumeName});
        this.emitChange();
      },

      onVolumeSizeChange: function(e){
        // todo: Don't let the user enter a value < 1, but doing it this way
        // doesn't let them hit backspace to remove the default 1 and start
        // typing a number.  Instead we should check for the onBlur event and
        // handle it then so it's only when they've left the input box.  But
        // probably better over all just to tell them the value has to be > 1
        // and don't magically change it for them.
        //if(e.target.value < 1) e.target.value = 1;
        var newVolumeSize = e.target.value;
        this.state.volumeSize = newVolumeSize;
        this.setState({volumeSize: newVolumeSize});
        this.emitChange();
      },

      getVolumeParams: function(){
        return {
          volumeName: this.state.volumeName,
          volumeSize: this.state.volumeSize,
          identityId: this.state.identityId
        };
      },

      //
      // Render
      // ------
      //

      render: function () {
        return (
          <form role='form'>

            <div className='form-group'>
              <label htmlFor='volumeName'>Volume Name</label>
              <input type="text" className="form-control" value={this.state.volumeName} onChange={this.onVolumeNameChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='volumeSize'>Volume Size</label>
              <input type="number" className="form-control" value={this.state.volumeSize} onChange={this.onVolumeSizeChange}/>
            </div>

            <div className='form-group'>
              <label htmlFor='identity'>Identity</label>
              <IdentitySelect
                  identityId={this.state.identityId}
                  identities={this.props.identities}
                  providers={this.props.providers}
                  onChange={this.onProviderIdentityChange}
              />
            </div>

          </form>
        );

      }

    });

  });
