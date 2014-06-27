/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        resourceTypes: React.PropTypes.array.isRequired,
        selectedResourceType: React.PropTypes.object.isRequired,
        onResourceTypeChanged: React.PropTypes.func.isRequired
      },

      onResourceTypeChanged: function(resourceType, e){
        e.preventDefault();
        this.props.onResourceTypeChanged(resourceType)
      },

      render: function () {
        var resources = this.props.resourceTypes.map(function(resourceType){
          var className = "glyphicon glyphicon-" + resourceType.glyph;
          var isActive = this.props.selectedResourceType.name === resourceType.name;

          return (
            <li key={resourceType.name} className={isActive ? "active" : ""}>
              <div className="clickable-region" onClick={this.onResourceTypeChanged.bind(this, resourceType)}>
                <div className="icon-container">
                  <i className={className}></i>
                </div>
                <label>{resourceType.name}</label>
              </div>
            </li>
          );
        }.bind(this));

        return (
          <ul className="horizontal-list">
            {resources}
          </ul>
        );
      }

    });

  });
