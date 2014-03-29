define(['react'], function(React) {

    var Modal = {
        close: function() {
            console.log(this);
            if (this.props.onClose)
                this.props.onClose();
        },
        render: function() {
            return React.DOM.div({className: 'modal-dialog'},
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
        }
    };

    return Modal;

});
