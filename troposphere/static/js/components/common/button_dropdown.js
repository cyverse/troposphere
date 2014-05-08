/* http://getbootstrap.com/components/#btn-dropdowns */
define(['react'], function(React) {
    return React.createClass({
        getDefaultProps: function() {
            return {
                buttonType: 'default',
                buttonContent: '',
                disabled: false
            };
        },
        getInitialState: function() {
            return {open: false};
        },
        toggleOpen: function() {
            this.setState({open:!this.state.open});
        },
        render: function() {
            var className = 'btn-group';
            if (this.state.open)
                className += ' open';
            return React.DOM.div({className: className},
                React.DOM.button({className: 'btn btn-' + this.props.buttonType + ' dropdown-toggle',
                                  onClick: this.toggleOpen,
                                  disabled: this.props.disabled},
                    this.props.buttonContent,
                    " ",
                    React.DOM.span({className: 'caret'})),
                React.DOM.ul({className: 'dropdown-menu', role: 'menu'}, this.props.children));
        }
    });
});
