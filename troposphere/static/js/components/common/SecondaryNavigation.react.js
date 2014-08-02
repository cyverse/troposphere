/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './EditableInputField.react'
  ],
  function (React, Backbone, EditableInputField) {

    var ENTER_KEY = 13;

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string,
        routes: React.PropTypes.array.isRequired,
        currentRoute: React.PropTypes.string.isRequired,
        canEditTitle: React.PropTypes.bool,
        onTitleChanged: React.PropTypes.func,
        additionalContent: React.PropTypes.renderable
      },

      getInitialState: function(){
        return {
          isEditing: false,
          title: this.props.title
        }
      },

      onDoneEditing: function(text){
        this.setState({
          title: text,
          isEditing: false
        });
        this.props.onTitleChanged(text);
      },

      onEnterEditMode: function(e){
        this.setState({isEditing: true});
      },

      render: function () {

        var links = this.props.routes.map(function(route){
          var isCurrentRoute = (route.name.toLowerCase() === this.props.currentRoute);
          var className = isCurrentRoute ? "active" : null;
          return (
            <li key={route.name} className={className}>
              <a href={route.href}>
                <i className={'glyphicon glyphicon-' + route.icon}></i>
                {route.name}
              </a>
            </li>
          );
        }.bind(this));

        var titleContent;
        if(this.props.title) {
          if (this.props.canEditTitle && this.state.isEditing) {
            titleContent = (
              <EditableInputField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
              );
          } else {
            titleContent = (
              <h1 onClick={this.onEnterEditMode}>
              {this.state.title}
                <i className="glyphicon glyphicon-pencil"></i>
              </h1>
              );
          }
        }else{
          titleContent = null;
        }

        var titleClassName = "project-name";
        if(this.props.canEditTitle) titleClassName += " editable";

        var hasAdditionalContent = this.props.additionalContent;

        return (
          <div className="secondary-nav">
            <div className="container">
              <div className={titleClassName}>
                {titleContent}
              </div>
              <ul className="secondary-nav-links">
                {links}
              </ul>
             {hasAdditionalContent ? this.props.additionalContent : null}
            </div>
          </div>
        );
      }

    });

  });
