define(['react'], function(React) {

    return {
        componentDidMount: function() {
            this.model().then(function(data) {
                this.setState({model: data});
            }.bind(this));
        },
        render: function() {
            if (this.state && this.state.model)
                return this.renderContent();
            else
                return React.DOM.div({className: 'loading'});
        }
    };

});
