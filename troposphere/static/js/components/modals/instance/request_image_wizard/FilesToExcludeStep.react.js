define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      FileToExclude = require('../request_image/ImageFilesToExclude.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      filesToExclude: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        filesToExclude: ""
      };
    },

    getInitialState: function(){
      return {
        filesToExclude: this.props.filesToExclude
      }
    },

    isSubmittable: function(){
      return true;
    },

    onPrevious: function(){
      this.props.onPrevious({
        filesToExclude: this.state.filesToExclude
      });
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
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
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
