
define(
  [
    'react',
    'stores',
    'jquery',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, stores, $, BootstrapModalMixin) {

    function getState() {
      return {
        name: null,
        description: null,
        link: null
      }
    }

    return React.createClass({
      displayName: "ExternalLinkCreateModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        initialExternalLinkName: React.PropTypes.string
      },

      isSubmittable: function () {
        var hasName = !!this.state.name;
        var hasDescription = !!this.state.description;
        var hasLink = !!this.state.link;
        var external_linkExists = !!this.state.external_linkExists;
        return hasName && hasDescription && hasLink && !external_linkExists;
      },

      componentDidMount: function (){
        if (this.state.name) {
          var lower = this.state.name.toLowerCase();
          external_links = stores.ExternalLinkStore.getAll().filter(function (external_link) {
            return external_link.get('title').toLowerCase() === lower;
          });
          if(external_links.length > 0){
            this.setState({external_linkExists: true, existsText: "ExternalLink " + this.state.name + " already exists"});
          }
          else{
            this.setState({external_linkExists: false, existsText: ""});
          }
        }
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function () {
        return {
          name: this.props.initialExternalLinkName,
          description: null,
          link: null
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
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
        this.props.onConfirm($.trim(this.state.name), this.state.description, this.state.link);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onNameChange: function (e) {
        var newName = e.target.value;
        this.setState({name: newName});
        if (newName) {
          var lower = $.trim(newName.toLowerCase());
          external_links = stores.ExternalLinkStore.getAll().filter(function (external_link) {
            return external_link.get('title').toLowerCase() === lower;
          });
          if(external_links.length > 0){
            this.setState({external_linkExists: true, existsText: "ExternalLink with name \"" + newName + "\" already exists"});
          }
          else{
            this.setState({external_linkExists: false, existsText: ""});
          }
        }
      },

      onLinkChange: function (e) {
        var newLink = e.target.value;
        this.setState({link: newLink});
      },

      onDescriptionChange: function (e) {
        var newDescription = e.target.value;
        this.setState({description: newDescription});
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        var formattedExistsText = <p className="no-results text-danger">{this.state.existsText}</p>
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='linkName'>Link Title</label>
              <input type="text"
                     className="form-control"
                     value={this.state.name}
                     onChange={this.onNameChange}
                />
              {formattedExistsText}
            </div>

            <div className='form-group'>
              <label htmlFor='linkSize'>Link Description</label>
              <textarea id='project-description'
                        type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.description}
                        onChange={this.onDescriptionChange}
                />
            </div>

            <div className='form-group'>
              <label htmlFor='linkName'>Link URL</label>
              <input type="text"
                     className="form-control"
                     value={this.state.link}
                     onChange={this.onLinkChange}
                />
              {formattedExistsText}
            </div>

          </div>
        );
      },

      render: function () {
        var footerExistsText;

        if(this.state.external_linkExists){
          footerExistsText = <p className="text-danger">ExternalLink can not be created. Please fix errors above.</p>;
        }

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Create ExternalLink</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  {footerExistsText}
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Create Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
