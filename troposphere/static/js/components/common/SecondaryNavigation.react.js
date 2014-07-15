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
        title: React.PropTypes.string.isRequired,
        routes: React.PropTypes.array.isRequired,
        currentRoute: React.PropTypes.string.isRequired,
        canEditTitle: React.PropTypes.bool,
        onTitleChanged: React.PropTypes.func
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
            <li className={className}>
              <a href={route.href}>
                <i className={'glyphicon glyphicon-' + route.icon}></i>
                {route.name}
              </a>
            </li>
          );
        }.bind(this));

        var titleContent;
        if(this.props.canEditTitle && this.state.isEditing){
          titleContent = (
            <EditableInputField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
          );
        }else{
          titleContent = (
            <h1 onClick={this.onEnterEditMode}>{this.state.title}</h1>
          );
        }

        return (
          <div className="secondary-nav">
            <div className="container">
              <div className="project-name">
                {titleContent}
              </div>
              <ul className="secondary-nav-links">
                {links}
              </ul>
            </div>
          </div>
        );
      }

    });

  });
