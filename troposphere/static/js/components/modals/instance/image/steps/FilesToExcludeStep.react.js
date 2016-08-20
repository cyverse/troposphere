import React from 'react';
import FileToExclude from '../components/FilesToExclude.react';


export default React.createClass({
    displayName: "ImageWizard-FilesToExcludeStep",

    propTypes: {
      filesToExclude: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        filesToExclude: ""
      };
    },

    getInitialState: function () {
      return {
        filesToExclude: this.props.filesToExclude
      }
    },

    isSubmittable: function () {
      return true;
    },

    onPrevious: function () {
      this.props.onPrevious({
        filesToExclude: this.state.filesToExclude
      });
    },

    onNext: function () {
      this.props.onNext({
        filesToExclude: this.state.filesToExclude
      });
    },

    onFilesChange: function (newFilesToExclude) {
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
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext}
                    disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }
});
