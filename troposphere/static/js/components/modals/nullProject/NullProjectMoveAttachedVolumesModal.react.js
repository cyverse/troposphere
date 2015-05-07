/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, BootstrapModalMixin) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

      //
      // Render Helpers
      // --------------
      //

      renderMovedVolume: function(movedVolumeData){
        var volume = movedVolumeData.volume;
        var instance = movedVolumeData.instance;
        var oldProject = movedVolumeData.oldProject;
        var newProject = movedVolumeData.newProject;
        var message;

        if(oldProject){
          message = (
            <div>
              <span>{"Moved the volume "}</span>
              <strong>{volume.get('name')}</strong>
              <span>{" from the project "}</span>
              <strong>{oldProject.get('name')}</strong>
              <span>{" and into the project "}</span>
              <strong>{newProject.get('name')}</strong>
            </div>
          );
        }else{
          message = (
            <div>
              <span>{"Moved the volume "}</span>
              <strong>{volume.get('name')}</strong>
              <span>{" into the project "}</span>
              <strong>{newProject.get('name')}</strong>
            </div>
          );
        }

        return (
          <li>{message}</li>
        )
      },

      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <div role='form'>
            <div className='form-group'>
              <p>
                {
                  "Howdy! It looks like you had some volumes that were outside the project of the " +
                  "instances they were attached to.  This can sometimes happen when switching back " +
                  "and forth between the Atmosphere beta interface and the current interface.  No " +
                  "worries though!  We've detected the problem and fixed it for you."
                }
              </p>
              <p>{"Here are a list of the changes we've made for you:"}</p>
              <ul>
                {this.props.movedVolumesArray.map(this.renderMovedVolume)}
              </ul>
            </div>
          </div>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <strong>Move Volumes</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
