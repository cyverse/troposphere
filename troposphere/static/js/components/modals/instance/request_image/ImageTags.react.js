/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'components/common/tags/ChosenDropdown.react'
  ],
  function (React, Backbone, stores, ChosenDropdown) {

    return React.createClass({

      propTypes: {
        onChange: React.PropTypes.func.isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      handleChange: function(tagArray){
        var tags = stores.TagStore.getTagsFromArrayOfNames(tagArray);
        this.props.onChange(tags);
      },

      render: function () {
        return (
          <div className="form-group">
            <label htmlFor="tags" className="control-label">Image Tags</label>
            <div className="tagger_container">
              <div className="help-block">
                Please include tags that will help users decide whether this image will suit their
                needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
                NGS Viewers, MAKER, QIIME, etc.
              </div>
              <ChosenDropdown tags={this.props.tags}
                              activeTags={this.props.imageTags}
                              onTagsChanged={this.handleChange}
                              onEnterKeyPressed={function(){}}
                              width={"100%"}
              />
            </div>
          </div>
        );
      }

    });

  });
