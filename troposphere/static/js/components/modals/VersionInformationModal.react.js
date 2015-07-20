/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    'moment',
    'globals'
  ],
  function (React, BootstrapModalMixin, stores, moment, globals) {

    // Example Usage from http://bl.ocks.org/insin/raw/8449696/
    // render: function(){
    // <div>
    //   ...custom components...
    //   <ExampleModal
    //      ref="modal"
    //      show={false}
    //      header="Example Modal"
    //      buttons={buttons}
    //      handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
    //      handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
    //      handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
    //      handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
    //    >
    //      <p>I'm the content.</p>
    //      <p>That's about it, really.</p>
    //    </ExampleModal>
    // </div>
    //

    // To show the modal, call this.refs.modal.show() from the parent component:
    // handleShowModal: function() {
    //   this.refs.modal.show();
    // }

    function getState() {
      return {
        version: stores.VersionStore.getVersion()
      };
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        onClose: React.PropTypes.func.isRequired
      },

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
        stores.VersionStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.VersionStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      close: function () {
        this.hide();
        this.props.onClose();
      },

      //
      // Render
      // ------
      //

      render: function () {
        var buttonArray = [
          {type: 'primary', text: "Close", handler: this.close}
        ];

        var buttons = buttonArray.map(function (button) {
          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content;
        if(this.state.version){
          var client = this.state.version.client;
          var clientVersion = client.get("git_branch") + " " + client.get("git_sha_abbrev");
          var clientLastUpdated = moment(client.get('commit_date')).format("MMM Do YYYY");

          var server = this.state.version.server;
          var serverVersion = server.get("git_branch") + " " + server.get("git_sha_abbrev");
          var serverLastUpdated = moment(server.get('commit_date')).format("MMM Do YYYY");

          var versionName = ' ' + globals.UI_VERSION;

          content = (
            <div role='form'>

              <div className='form-group'>
                <div>
                  <label>Version:</label>
                  {versionName}
                </div>
                <div>
                  <label>Client</label>
                  {", " + clientLastUpdated}
                  <p>{clientVersion}</p>
                </div>
                <div>
                  <label>Server</label>
                  {", " + serverLastUpdated}
                  <p>{serverVersion}</p>
                </div>
              </div>

            </div>
          );
        }else{
          content = (
            <div className="loading"></div>
          );
        }

        return (
          <div className="modal fade">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>{this.props.header}</strong>
                </div>
                <div className="modal-body">
                  {content}
                </div>
                <div className="modal-footer">
                  {buttons}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
