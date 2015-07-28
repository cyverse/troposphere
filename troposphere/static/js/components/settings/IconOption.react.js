
define(function (require) {
    var _ = require("underscore"),
        React = require("react"),
        Gravatar = require('components/common/Gravatar.react');

    return React.createClass({
      render: function () {
        var onClick = _.partial(this.props.onClick, this.props.type);

        return (
          <li className={this.props.selected ? 'selected' : ''}>
            <a href="#" onClick={onClick}>
              <Gravatar hash='4dada4e6ac8298336c7063ae603ea86d' type={this.props.type}/>
              <br/>
              {this.props.text}
            </a>
          </li>
        );
      }
    });

  });
