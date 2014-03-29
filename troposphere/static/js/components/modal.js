define(['react', 'modal'], function(React, Modal) {

    var ModalComponent = React.createClass({
        getInitialState: function() {
            return {
                modal: React.DOM.div({}),
                visible: false
            };
        },
        componentDidMount: function() {
            Modal.events.on('alert', function(e) {
                this.setState({modal: e(this.close), visible: true});
            }.bind(this));
        },
        close: function() {
            this.setState({'visible': false});
        },
        render: function() {
            var className = 'modal fade' + (this.state.visible ? ' in' : '');
            return React.DOM.div({
                id: 'application-modal',
                className: className,
                tabIndex: '-1',
                role: 'dialog',
                'aria-hidden': !this.state.visible,
                style: {display: this.state.visible ? 'block' : 'none'}
            }, this.state.modal);
        }
    });

    return ModalComponent;
});
