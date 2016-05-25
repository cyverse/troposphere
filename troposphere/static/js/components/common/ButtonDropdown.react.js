/* http://getbootstrap.com/components/#btn-dropdowns */
import React from 'react/addons';

export default React.createClass({
    displayName: "ButtonDropdown",

    getDefaultProps: function () {
      return {
        buttonType: 'default',
        buttonContent: '',
        disabled: false
      };
    },

    getInitialState: function () {
      return {open: false};
    },

    toggleOpen: function () {
      this.setState({open: !this.state.open});
    },

    render: function () {
      var className = 'btn-group';
      var buttonClassName = 'btn btn-' + this.props.buttonType + ' dropdown-toggle';
      if (this.state.open) className += ' open';

      return (
        <div className={className}>
          <button className={buttonClassName} onClick={this.toggleOpen} disabled={this.props.disabled}>
            {this.props.buttonContent}
            <span>{" "}</span>
            <span className='caret'></span>
          </button>
          <ul className='dropdown-menu' role='menu'>
            {this.props.children}
          </ul>
        </div>
      );
    }
});
