import React from 'react/addons';
import Backbone from 'backbone';
import VersionName from '../components/VersionName.react';
import VersionChanges from '../components/VersionChangeLog.react';
import stores from 'stores';
import $ from 'jquery';


export default React.createClass({
    displayName: "ImageWizard-VersionInfoStep",

    propTypes: {
      versionName: React.PropTypes.string.isRequired,
      versionChanges: React.PropTypes.string.isRequired,
      newImage: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        versionName: "",
        versionChanges: "",
        newImage: true,
      };
    },

    getInitialState: function(){
      return {
        name: this.props.name,
        versionChanges: this.props.versionChanges,
        versionName: this.props.versionName,
      }
    },

    isSubmittable: function(){
      var hasName        = !!($.trim(this.state.versionName));
      var hasVersionChanges = !!($.trim(this.state.versionChanges));
      return hasName && hasVersionChanges;
    },

    onPrevious: function(){
      this.props.onPrevious({
        versionName: this.state.versionName,
        versionChanges: this.state.versionChanges,
      });
    },

    onNext: function(){
      this.props.onNext({
        versionName: $.trim(this.state.versionName),
        versionChanges: $.trim(this.state.versionChanges),
      });
    },

    onVersionNameChange: function(newName){
      this.setState({versionName: newName});
    },
    onDescriptionChange: function(newVersionChanges){
      this.setState({versionChanges: newVersionChanges});
    },
    renderBody: function (instance) {
      return (
        <div>
          <p>
            {
              "Versioning can be an important part of the Imaging process." +
              "Use this area to help track how your image changes over time. " +
              "The information you provide here will be shown to users who wish to use your image."
            }
          </p>
          <p>
            {
              "Fields marked with * are required."
            }
          </p>
          <VersionName
            create={this.props.newImage}
            value={this.state.versionName}
            onChange={this.onVersionNameChange}
            />
            <hr />
          <VersionChanges
            value={this.state.versionChanges}
            onChange={this.onDescriptionChange}
          />
        </div>
      );
    },

    render: function () {
      var instance = this.props.instance;

      return (
        <div>
          <div className="modal-body">
            {this.renderBody(instance)}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button"
                    onClick={this.onNext} disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }
});
