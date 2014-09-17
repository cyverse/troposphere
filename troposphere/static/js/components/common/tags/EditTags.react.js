/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/TagActions',

    // jQuery plugins: need to make sure they're loaded, but they aren't called directly
    'chosen'
  ],
  function (React, Backbone, TagActions) {

    return React.createClass({
      display: "EditTags",

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onTagsChanged: React.PropTypes.func.isRequired,
        onEnterKeyPressed: React.PropTypes.func.isRequired
      },

      componentDidMount: function(){
        this.setupChosenForm();
      },

      componentDidUpdate: function(){
        this.updateChosenForm();
      },

      setupChosenForm: function(){
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]')
           .chosen({
              no_results_text: "No tag found. Press Enter to create a new tag for"
            })
           .change(this.onTagsChanged);

        $el.find('.search-field input')
           .keyup(this.props.onEnterKeyPressed);
      },

      updateChosenForm: function(){
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]')
           .trigger('chosen:updated');
      },

      onCreateNewTag: function(e){
        e.preventDefault();
        TagActions.create();
      },

      onTagsChanged: function(text){
        var tags = $(text.currentTarget).val();
        this.props.onTagsChanged(tags);
      },

      render: function () {

        var tags = this.props.tags.map(function(tag){
          var tagName = tag.get('name');
          return (
            <option key={tag.id} value={tagName}>{tagName}</option>
          );
        });

        var activeTagNames = this.props.activeTags.map(function(tag){
          return tag.get('name');
        });

        return (
          <div className="tagger">
            <select name="tags"
                    data-placeholder="Select tags to add..."
                    className="form-control"
                    multiple={true}
                    value={activeTagNames}
            >
              {tags}
            </select>
          </div>
        );
      }

    });

  });
