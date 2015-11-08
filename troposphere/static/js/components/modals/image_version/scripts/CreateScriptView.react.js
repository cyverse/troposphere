import React from 'react/addons';
import Backbone from 'backbone';
import actions from 'actions';
import EditDescriptionView from 'components/images/detail/description/EditDescriptionView.react';

let ENTER_KEY = 13;

export default React.createClass({
    displayName: "CreateScriptView",

    propTypes: {
      onCreateScript: React.PropTypes.func.isRequired,
      scriptTitle: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        scriptTitle: this.props.scriptTitle || "",
        scriptType: "URL",
        scriptURL: "",
        scriptText: "",
      }
    },
    isSubmittable: function () {
      if (!this.state.scriptTitle) {
        return false;
      } else if (this.state.scriptType == "URL") {
        if( this.state.scriptURL.search("https?://") < 0) {
          return false
        }
        //NOTE: Implicit 'full-text' type test
      } else if (this.state.scriptText.length < 4) {
        return false;
      }
      //Tests passed
      return true;
    },
    onCreateScript: function(e) {
      var params = {
        title: this.state.scriptTitle,
        type: this.state.scriptType,
        text: (this.state.scriptType == "URL") ? this.state.scriptURL : this.state.scriptText
      };
      this.props.onCreateScript(params);
    },
    onScriptInputTypeChange: function (e) {
      var script_type = e.target.value;
      if (script_type == "URL") {
        this.setState({scriptType: script_type});
      } else {
        this.setState({scriptType: "Full Text"});
      }
    },
    onScriptURLChange: function (e) {
      var url_text = e.target.value;
      this.setState({scriptURL: url_text})
    },
    onScriptTextChange: function (e) {
      var full_text = e.target.value;
      this.setState({scriptText: full_text})
    },
    onScriptTitleChange: function (e) {
      var title = e.target.value;
      this.setState({scriptTitle: title})
    },
    renderScriptSelection: function () {
      if (this.state.scriptType == "URL") {
        return (
          <div className='form-group'>
            <label htmlFor='version-version'>Script URL</label>
            <input type='text' className='form-control'
                   value={this.state.scriptURL} onChange={this.onScriptURLChange}/>
          </div>
        );
      } else {
        //"Full Text"
        return (<EditDescriptionView
          title={"Full Text"}
          value={this.state.scriptText}
          onChange={this.onScriptTextChange}
          />)
      }
    },
    renderScriptInputRadio: function () {
      var urlRadio, fullTextRadio;

      //NOTE: There must be a better way ..? -Steve
      if (this.state.scriptType == "URL") {
        urlRadio = (
          <label className="radio-inline">
            <input checked="checked" type="radio"
                   name="inlineScriptOptions"
                   id="scriptTypeURL" value="URL"
                   onChange={this.onScriptInputTypeChange}/>
            URL
          </label>);
        fullTextRadio = (
          <label className="radio-inline">
            <input type="radio" name="inlineScriptOptions"
                   id="scriptTypeText" value="Full Text"
                   onChange={this.onScriptInputTypeChange}/>
            Full Text
          </label>);
      } else {
        urlRadio = (
          <label className="radio-inline">
            <input type="radio" name="inlineScriptOptions"
                   id="scriptTypeURL" value="URL"
                   onChange={this.onScriptInputTypeChange}/>
            URL
          </label>);
        fullTextRadio = (
          <label className="radio-inline">
            <input checked="checked"
                   type="radio" name="inlineScriptOptions"
                   id="scriptTypeText" value="Full Text"
                   onChange={this.onScriptInputTypeChange}/>
            Full Text
          </label>);
      }

      return (
      <div className="scriptRenderRadio">
        <label htmlFor="scriptTypeSelect">Input Type</label>
        <div className="form-group">
          {urlRadio}
          {fullTextRadio}
        </div>
      </div>
      );
    },
    renderScriptTitle: function () {
      return (<div className="form-group">
          <label htmlFor="scriptTitle">Script Title</label>
          <input type="text" className="form-control" id="scriptTitle"
                 placeholder="Title" value={this.state.scriptTitle}
                 onChange={this.onScriptTitleChange}/>
        </div>
      );
    },
    render: function () {
      return (

        <div className="new-script-form new-item-form">

          <div className="script-input-type-container">
            {this.renderScriptTitle()}
            {this.renderScriptInputRadio()}
            {this.renderScriptSelection()}
          </div>
          <div className="new-item-form-header form-group clearfix" style={{"border": "black 1px"}}>
            <button disabled={!this.isSubmittable()} onClick={this.onCreateScript} type="button"
                    className="btn btn-primary btn-sm pull-right"
                    style={{marginTop:"20px"}}>
                    {"Create and Add"}
            </button>
          </div>
        </div>
      );
    }
});
