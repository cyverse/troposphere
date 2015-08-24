define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    actions = require('actions'),
    EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react');

  var ENTER_KEY = 13;

  return React.createClass({
    displayName: "CreateTagView",

    propTypes: {
      onCreateTag: React.PropTypes.func.isRequired,
      tagName: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        tagName: this.props.tagName || "",
        tagDescription: "",
      }
    },
    isSubmittable: function () {
      return (this.state.tagName && this.state.tagDescription.length > 3);
    },
    onCreateTag: function(e) {
      var params = {
        name: this.state.tagName,
        description: this.state.tagDescription
      };
      this.props.onCreateTag(params);
    },
    onTagDescriptionChange: function (e) {
      var full_text = e.target.value;
      this.setState({tagDescription: full_text})
    },
    onTagNameChange: function (e) {
      var title = e.target.value;
      this.setState({tagName: title})
    },
    renderTagDescription: function () {
      return (<EditDescriptionView
        title={"Description"}
        value={this.state.tagDescription}
        onChange={this.onTagDescriptionChange}
        />);
    },
    renderTagName: function () {
      return (<div className="form-group">
          <label htmlFor="tagName">Tag Name</label>
          <input type="text" className="form-control" id="tagName"
                 placeholder="Name" value={this.state.tagName}
                 onChange={this.onTagNameChange}/>
        </div>
      );
    },
    render: function () {
      return (

        <div className="new-tag-form new-item-form">

          <div className="tag-input-type-container">
            {this.renderTagName()}
            {this.renderTagDescription()}
          </div>
          <div className="new-item-form-header form-group clearfix" style={{"border": "black 1px"}}>
            <button disabled={!this.isSubmittable()} onClick={this.onCreateTag} type="button"
                    className="btn btn-primary btn-sm pull-right"
                    style={{marginTop:"20px"}}>
                    {"Create and Add"}
            </button>
          </div>
        </div>
      );
    }
  });

});

