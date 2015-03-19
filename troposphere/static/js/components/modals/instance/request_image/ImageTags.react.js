define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ChosenDropdown = require('components/common/tags/ChosenDropdown.react');

  return React.createClass({

    propTypes: {
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var imageTags = this.props.imageTags,
          tags = stores.TagStore.getAll();

      if(!tags) return <div className="loading"/>;

      return (
        <div className="form-group">
          <label htmlFor="tags" className="control-label">Image Tags</label>
          <div className="tagger_container">
            <div className="help-block">
              Please include tags that will help users decide whether this image will suit their
              needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
              NGS Viewers, MAKER, QIIME, etc.
            </div>
            <ChosenDropdown
              tags={tags}
              activeTags={imageTags}
              onTagAdded={this.props.onTagAdded}
              onTagRemoved={this.props.onTagRemoved}
              onEnterKeyPressed={function(){}}
              width={"100%"}
            />
          </div>
        </div>
      );
    }

  });

});
