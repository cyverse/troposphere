define(function(require) {

  var React = require('react/addons'),
      Backbone = require('backbone'),
      VersionName = require('../components/VersionName.react'),
      VersionChanges = require('../components/VersionChangeLog.react'),
      stores = require('stores');

  return React.createClass({
    displayName: "ImageWizard-VersionInfoStep",

    propTypes: {
      minMem: React.PropTypes.string.isRequired,
      minStorage: React.PropTypes.string.isRequired
    },

    getInitialState: function(){
      return {
        minMem: this.props.minMem,
        minStorage: this.props.minStorage
      }
    },

    isSubmittable: function(){
      return this.state.minMem && this.state.minStorage;
    },

    onPrevious: function(){
      this.props.onPrevious({
        versionName: this.state.versionName,
        versionChanges: this.state.versionChanges,
      });
    },

    handleMemChange: function(e){
      this.setState({minMem: e.target.value});
    },

    handleStorageChange: function(e){
      this.setState({minStorage: e.target.value});
    },

    onNext: function(){
      this.props.onNext({
        minStorage: this.state.minStorage,
        minMem: this.state.minMem
      });
    },

    onDescriptionChange: function(newVersionChanges){
      this.setState({versionChanges: newVersionChanges});
    },

    render: function () {

      return (
        <div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name" className="control-label">
                Minimum memory (GB):
              </label>
              <div className="help-block">
                Let other users know how much memory (RAM) is required to properly run an instance based on this image.
              </div>
              <input type="text" onChange={this.handleMemChange} value={this.state.minMem} />
              <hr />
              <label htmlFor="name" className="control-label">
                Minimum storage (GB):
              </label>
              <div className="help-block">
                Let other users know how much storage is required to properly run an instance based on this image.
              </div>
              <input type="text" onChange={this.handleStorageChange} value={this.state.minStorage} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
