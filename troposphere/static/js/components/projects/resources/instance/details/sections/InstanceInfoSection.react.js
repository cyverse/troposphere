/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/EditableInputField.react',
    'actions/InstanceActions',

    // jQuery plugins: need to make sure they're loaded, but they aren't called directly
    'chosen'
  ],
  function (React, Backbone, Time, EditableInputField, InstanceActions) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return {
          name: this.props.instance.get('name'),
          isEditing: false
        }
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]')
           .chosen()
           .change(this.onDoneEditingTags);
      },

      onEnterEditMode: function(e){
        this.setState({isEditing: true});
      },

      onDoneEditing: function(text){
        this.setState({
          name: text,
          isEditing: false
        });
        InstanceActions.updateInstanceAttributes(this.props.instance, {name: text})
      },

      onDoneEditingTags: function(text){
        // var el = this.getDOMNode();
        // var $el = $(el);
        // var tags = $el.find('select[name="tags"]').val();

        var tags = $(text.currentTarget).val();

//        this.setState({
//          isEditingTags: false
//        });
        InstanceActions.updateInstanceAttributes(this.props.instance, {tags: tags})
      },

      onEditInstanceDetails: function(e){
        e.preventDefault();
        alert("Editing instance details not yet implemented.");
      },

      renderTags: function(){
        var tags = this.props.tags.map(function(tag){
          var tagName = tag.get('name');
          return (
            <option key={tag.id} value={tagName}>{tagName}</option>
          );
        });

        return (
          <div className="control-group">
            <select name="tags"
                    data-placeholder="Select tags to add..."
                    className="form-control"
                    multiple={true}
                    value={this.props.instance.get('tags')}
            >
              {tags}
            </select>
          </div>
        );
      },

      render: function () {
        var tags = this.props.instance.get('tags').map(function(tag){
          return (
            <li key={tag} className="tag"><a href="#">{tag}</a></li>
          );
        });

        var nameContent;
        if(this.state.isEditing){
          nameContent = (
            <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditing}/>
          );
        }else{
          nameContent = (
            <h4 onClick={this.onEnterEditMode}>
              {this.state.name}
              <i className="glyphicon glyphicon-pencil"></i>
            </h4>
          );
        }

        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=113" width="113" height="113"/>
            </div>

            <div className="resource-info">
              <div className="resource-name editable">
                {nameContent}
              </div>
              <div className="resource-launch-date">Launched on <Time date={this.props.instance.get('start_date')}/></div>
              <div className="resource-tags">Instance Tags:</div>
              <ul className="tags">
                {tags.length > 0 ? tags : <span>This instance has not been tagged.</span>}
              </ul>

              {this.renderTags()}
            </div>

            <div className="edit-resource-link">
              <a href="#" onClick={this.onEditInstanceDetails}>Edit Instance Info</a>
            </div>

          </div>
        );
      }

    });

  });
