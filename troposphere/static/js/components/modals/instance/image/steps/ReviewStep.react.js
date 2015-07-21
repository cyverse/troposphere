define(function (require) {

  var React = require('react'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      imageData: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
      return {
        hasCheckedLicense: false
      }
    },

    isSubmittable: function () {
      var hasCheckedLicense = !!this.state.hasCheckedLicense;
      return hasCheckedLicense;
    },

    onLicenseChange: function (e) {
      this.setState({hasCheckedLicense: e.target.checked});
    },

    renderUsers: function (imageData) {
      if (imageData.visibility !== 'select') return;

      var users = imageData.imageUsers.map(function (user) {
        return user.get('username')
      });

      return (
        <div className="form-group">
          <label className="control-label col-sm-3">Users</label>

          <div className="help-block col-sm-9">
            {users.length > 0 ? users.join(", ") : "[no users selected]"}
          </div>
        </div>
      )
    },

    renderTags: function (imageData) {
      if (!imageData.imageTags || imageData.imageTags.length === 0) {
        return (
          <div className="form-group">
            <label className="control-label col-sm-3">Tags</label>

            <div className="help-block col-sm-9">[no tags selected]</div>
          </div>
        )
      }

      var tags = imageData.imageTags.map(function (tag) {
        return tag.get('name')
      });

      return (
        <div className="form-group">
          <label className="control-label col-sm-3">Tags</label>

          <div className="help-block col-sm-9">
            {tags.join(", ")}
          </div>
        </div>
      )
    },

    renderDataDump: function (imageData) {
      return (
        <p>{JSON.stringify(imageData, null, 4)}</p>
      );
    },

    renderFilesToExclude: function (imageData) {
      var filesToExclude = imageData.filesToExclude || "",
        files = filesToExclude.split("\n").map(function (file) {
          return <div>{file}</div>;
        });

      if (!filesToExclude) {
        return (
          <div className="form-group">
            <label className="control-label col-sm-3">Files to Exclude</label>

            <div className="help-block col-sm-9">[no files selected]</div>
          </div>
        )
      }

      return (
        <div className="form-group">
          <label className="control-label col-sm-3">Files to Exclude</label>

          <div className="help-block col-sm-9">
            {files}
          </div>
        </div>
      )
    },

    renderBody: function (imageData) {
      var provider = stores.ProviderStore.get(imageData.providerId),
        visibilityMap = {
          'public': 'Public (everyone can see the image)',
          'private': 'Private (only you can see the image)',
          'select': 'Select Users (only you and selected users can see the image)'
        };

      return (
        <div className="image-request-summary">
          <p>{"An image request will be submitted with the following information:"}</p>
          {
            //this.renderDataDump(imageData)
          }
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-sm-3">Name</label>

              <div className="help-block col-sm-9">{imageData.name}</div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-3">Description</label>

              <div className="help-block col-sm-9">{imageData.description}</div>
            </div>
            {this.renderTags(imageData)}
            <div className="form-group">
              <label className="control-label col-sm-3">Provider</label>

              <div className="help-block col-sm-9">{provider.get('name')}</div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-3">Visibility</label>

              <div className="help-block col-sm-9">{visibilityMap[imageData.visibility]}</div>
            </div>
            {this.renderUsers(imageData)}
            {this.renderFilesToExclude(imageData)}
          </div>
          <div className="checkbox col-sm-12">
            <br />
            <label className="checkbox">
              <input type="checkbox" onChange={this.onLicenseChange}/>

              <div>
                I certify that this image does not contain license-restricted software that is prohibited from being
                distributed within a virtual or cloud environment.
              </div>
            </label>
            <br />
          </div>
        </div>
      );
    },

    render: function () {
      var imageData = this.props.imageData;

      return (
        <div>
          <div className="modal-body">
            {this.renderBody(imageData)}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.props.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.props.onNext}
                    disabled={!this.isSubmittable()}>
              Request Image
            </button>
          </div>
        </div>
      );
    }

  });

});
