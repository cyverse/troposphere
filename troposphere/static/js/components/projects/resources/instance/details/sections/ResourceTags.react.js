/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/tags/EditTagsView.react',

    // jQuery plugins: need to make sure they're loaded, but they aren't called directly
    'chosen'
  ],
  function (React, Backbone, EditTagsView) {

    return React.createClass({

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onTagsChanged: React.PropTypes.func.isRequired,
        onCreateNewTag: React.PropTypes.func.isRequired
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

      render: function () {
        return (
          <div>
            <EditTagsView activeTags={this.props.activeTags}
                          tags={this.props.tags}
                          onTagsChanged={this.props.onTagsChanged}
                          onCreateNewTag={this.props.onCreateNewTag}
                          label={"Instance Tags:"}
            />
          </div>
        );
      }

    });

  });
