
define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, BootstrapModalMixin, Glyphicon) {

    return React.createClass({
      displayName: "InstanceDeleteModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

      //
      // Render
      // ------
      //

      renderAttachedVolumes: function (volume) {
        return (
          <li><strong>{volume.get('name')}</strong></li>
        )
      },
      renderVolumeWarning: function () {
          return (
              <div>
                  <p>
                  {
                      "This instance currently has the following volumes attached to it:"
                  }
                  </p>
                  <ul>
                  {this.props.attachedVolumes.map(this.renderAttachedVolumes)}
                  </ul>
              </div>
          );
      },
      renderBody: function () {
        var instance = this.props.instance;
        
        var volumeWarningHeader = 
              (<span> 
                  { ' Deletion may' }
                  <strong>{ ' corrupt attached volumes.' }</strong>
              </span>);

        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong> WARNING</strong>
              {' Data will be'}
              <strong>{ ' lost.' }</strong>
              { this.props.attachedVolumes.length ? volumeWarningHeader : "" }
            </p>
            <p>
                {'The following instance ' +
                 'will be shut down and all data will be permanently lost:'}
                <ul>
                <strong>{instance.get('name') + ' #' + instance.get('id')}</strong>
                </ul>
            </p>

            { this.props.attachedVolumes.length ? this.renderVolumeWarning() : "" }

            <p>
              <em>Note:</em>
              {
                ' Your resource usage charts will not reflect changes until the ' +
                'instance is completely deleted and has disappeared ' +
                'from your list of instances.'
              }
            </p>
          </div>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Delete Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, delete this instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
