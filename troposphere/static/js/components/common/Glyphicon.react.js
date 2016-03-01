import React from 'react';

export default React.createClass({
    displayName: "Glyphicon",

    render: function () {
      return (
        <i className={'glyphicon glyphicon-' + this.props.name}/>
      );
    }
});
