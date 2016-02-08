
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react',
    'models/Instance',
  ],
  function (React, BootstrapModalMixin, Glyphicon, InstanceModel) {

    return React.createClass({
      displayName: "InstanceDeleteModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        instance: React.PropTypes.instanceOf(InstanceModel).isRequired,
        onConfirm: React.PropTypes.func.isRequired,
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

      renderBody: function () {
        var instance = this.props.instance;

        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong> WARNING</strong>
              {' Data will be'}
              <strong>{ ' lost.' }</strong>
            </p>
            <p>
                {'The following instance ' +
                 'will be shut down and all data will be permanently lost:'}
                <ul>
                <strong>{instance.get('name') + ' #' + instance.get('id')}</strong>
                </ul>
            </p>

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
                  <button type="button" className="btn btn-danger" onClick={this.hide}>
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
