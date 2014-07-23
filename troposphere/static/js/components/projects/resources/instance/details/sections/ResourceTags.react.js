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
        onTagsChanged: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        return {
          isEditingTags: false
        }
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
           .chosen()
           .trigger('chosen:updated')
           .change(this.onTagsChanged);
      },

      //

      onEditTags: function(e){
        e.preventDefault();
        this.setState({isEditingTags: true});
      },

      onDoneEditingTags: function(e){
        e.preventDefault();
        this.setState({isEditingTags: false});
      },

      //

      onCreateNewTag: function(e){
        e.preventDefault();
        TagActions.create();
      },

      onTagsChanged: function(text){
        var tags = $(text.currentTarget).val();
        this.props.onTagsChanged(tags);
      },

      renderReadableTags: function(){
        var tags = this.props.activeTags.map(function(tag){
          return (
            <li key={tag} className="tag">
                <a href="#">{tag}</a>
            </li>
          );
        });

        var content;
        if(tags.length > 0){
          content = tags;
        }else{
          content = (
            <span>This instance has not been tagged.</span>
          )
        }

        return (
          <ul className="tags">
            {content}
          </ul>
        );
      },

      renderEditableTags: function(){
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
      },

      render: function () {

        var link;
        if(this.state.isEditingTags){
          link = (
            <a href="#" onClick={this.onDoneEditingTags}>Done editing</a>
          );
        }else{
          link = (
            <a href="#" onClick={this.onEditTags}>Edit tags</a>
          );
        }

        return (
          <div className="resource-tags">
            <span>Instance Tags:</span>
            {link}
            {this.state.isEditingTags ? this.renderEditableTags() : this.renderReadableTags()}
          </div>
        );
      }

    });

  });
