import React from 'react/addons';

export default React.createClass({
    displayName: "Glyphicon",

    render: function () {
      return (
        <i className={'glyphicon glyphicon-' + this.props.name}/>
      );
    }
});
