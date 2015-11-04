define(function (require) {

  var React = require('react/addons');

  return React.createClass({
    displayName: "Glyphicon",

    render: function () {
      return (
        <i className={'glyphicon glyphicon-' + this.props.name}/>
      );
    }
  });

});
