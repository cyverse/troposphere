define(function (require) {
  var React = require('react');
  var Project = require('./project');

  return React.createClass({
    render: function () {

      var items = this.props.projects.map(function (model) {
        return (
          <Project key={model.id} project={model} projects={this.props.projects}/>
        );
      }.bind(this));

      return (
        <ul id="project-list">
          {items}
        </ul>
      );
    }
  });

});
