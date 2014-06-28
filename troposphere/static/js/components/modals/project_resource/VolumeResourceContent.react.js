/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    '../instance_launch/IdentitySelect.react'
  ],
  function (React, ProviderStore, IdentityStore, IdentitySelect) {

    function getState() {
      var state = {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll(),

        volumeName: null,
        identityId: null
      };

      this.state = this.state || {};

      // Use provided volume name or default to nothing
      state.volumeName = this.state.volumeName || "";

      // Use provided volume size or default to 1 GB
      state.volumeSize = this.state.volumeSize || 1;

      // Use selected identity or default to the first one
      if (state.identities) {
        state.identityId = this.state.identityId || state.identities.first().id;
      }

      return state;
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return getState.apply(this);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState.apply(this));
      },

      componentDidMount: function () {
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProviderIdentityChange: function(e){
        var newIdentityId = e.target.value;
        this.setState({identityId: newIdentityId});
      },

      onVolumeNameChange: function(e){
        var newVolumeName = e.target.value;
        this.setState({volumeName: newVolumeName});
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
        this.setState({volumeSize: newVolumeSize});
      },

      //
      // Render
      // ------
      //

      render: function () {
        var content;
        if(this.state.identities && this.state.providers){
          content = (
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
                    identities={this.state.identities}
                    providers={this.state.providers}
                    onChange={this.onProviderIdentityChange}
                />
              </div>

            </form>
          );
        }else{
          content = (
            <div className="loading"></div>
          );
        }

        return content;
      }

    });

  });
