/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/TagActions',
    './ChosenDropdown.react'
  ],
  function (React, Backbone, TagActions, ChosenDropdown) {

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

      setupChosenForm: function(){
        var el = this.getDOMNode();
        var $el = $(el);

        $el.find('.search-field input')
           .keyup(this.props.onEnterKeyPressed);
      },

      onCreateNewTag: function(e){
        e.preventDefault();
        TagActions.create();
      },


      onTagsChanged: function(arrayOfTagNames){
        this.props.onTagsChanged(arrayOfTagNames);
      },

      render: function () {

        var tags = this.props.tags.map(function(tag){
          var tagName = tag.get('name');
          return (
            <option key={tag.id} value={tagName}>{tagName}</option>
          );
        });

        return (
          <div className="tagger">
            <ChosenDropdown tags={this.props.tags}
                            activeTags={this.props.activeTags}
                            onTagsChanged={this.props.onTagsChanged}
            />
          </div>
        );
      }

    });

  });
