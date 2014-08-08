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

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.array.isRequired,
        onTagsChanged: React.PropTypes.func.isRequired,
        onEnterKeyPressed: React.PropTypes.func.isRequired
      },

      componentDidMount: function(){
        this.updateChosenForm();
      },

      componentDidUpdate: function(){
        this.updateChosenForm();
      },

      updateChosenForm: function(){
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]')
           .chosen({
              no_results_text: "No tag found. Press Enter to create a new tag for"
            })
           .trigger('chosen:updated')
           .change(this.onTagsChanged);

        $el.find('.search-field input')
           .keyup(this.props.onEnterKeyPressed);
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

        return (
          <div>
            <select name="tags"
                    data-placeholder="Select tags to add..."
                    className="form-control"
                    multiple={true}
                    value={this.props.activeTags}
            >
              {tags}
            </select>
            <a className="btn btn-primary new-tag" href="#" onClick={this.onCreateNewTag}>+ New tag</a>
          </div>
        );
      }

    });

  });
