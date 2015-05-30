define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      FileToExclude = require('../request_image/ImageFilesToExclude.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      return {
        filesToExclude: ""
      }
    },

    isSubmittable: function(){
      return true;
    },

    onNext: function(){
      this.props.onNext({
        filesToExclude: this.state.filesToExclude
      });
    },

    onFilesChange: function(newFilesToExclude){
      this.setState({
        filesToExclude: newFilesToExclude
      });
    },

    renderBody: function () {
      return (
        <div>
          <p>
            {
              "Please list any files or folders you would like to include. Be default, " +
              "we exclude the following directories during the image process:"
            }
          </p>
          <p>/folder1</p>
          <p>/folder2/sub-folder</p>
          <p>/folder3/sub-folder/sub-sub-folder</p>
          <p>/folder4/sub-folder/sub-sub-folder</p>

          <FileToExclude
            value={this.state.filesToExclude}
            onChange={this.onFilesChange}
          />
        </div>
      );
    },

    render: function () {
      return (
        <div>
          <div className="modal-body">
            {this.renderBody()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.props.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
