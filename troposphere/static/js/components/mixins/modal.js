define(['react'], function(React) {

    var Modal = {
        getInitialState: function() {
            return {visible: true};
        },
        close: function() {
            this.setState({visible: false});
        },
        componentWillReceiveProps: function() {
            this.setState({visible: true});
        },
        render: function() {
            var dialog = React.DOM.div({className: 'modal-dialog'},
                React.DOM.div({className: 'modal-content'},
                    React.DOM.div({className: 'modal-header'},
                        React.DOM.button({
                            type: 'button',
                            className: 'close',
                            onClick: this.close,
                            'aria-hidden': 'true'
                            }, '\u00d7'),
                        React.DOM.h4({
                            className: 'modal-title'
                            }, this.renderTitle())),
                    React.DOM.div({className: 'modal-body'},
                        this.renderBody()),
                    React.DOM.div({className: 'modal-footer'},
                        this.renderFooter())));

            var className = 'modal fade' + (this.state.visible ? ' in' : '');
            return React.DOM.div({
                id: 'application-modal',
                className: className,
                tabIndex: '-1',
                role: 'dialog',
                'aria-hidden': !this.state.visible,
                style: {display: this.state.visible ? 'block' : 'none'}
            }, dialog);
        }
    };

    return Modal;

});
