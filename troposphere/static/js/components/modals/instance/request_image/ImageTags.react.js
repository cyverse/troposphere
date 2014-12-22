/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',

    // plugins
    'chosen'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        onChange: React.PropTypes.func.isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      handleChange: function(e){
        this.props.onChange(e.target.value)
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]').chosen();
      },

      render: function () {
        var tags = this.props.tags.map(function(tag){
          var tagName = tag.get('name');
          return (
            <option key={tag.id} value={tagName}>{tagName}</option>
          );
        });

        return (
          <div className="form-group">
            <label htmlFor="tags" className="control-label">Image Tags</label>
            <div className="tagger_container">
              <div className="help-block">
                Please include tags that will help users decide whether this image will suit their
                needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
                NGS Viewers, MAKER, QIIME, etc.
              </div>
              <select name="tags" data-placeholder="Select tags to add..." multiple className="form-control">
                {tags}
              </select>
              <input type="hidden" name="tags" className="tag_input" />
            </div>
          </div>
        );
      }

    });

  });
