define(['react'], function(React) {

    return {
        getInitialState: function() {
            return {_loading: true, model: null};
        },
        componentDidMount: function() {
            this.model().then(function(data) {
                    this.setState({model: data, _loading: false});
                }.bind(this),
                function(msg) {
                    this.setState({_loading: false, _error: msg});
                }.bind(this));
        },
        render: function() {
            if (this.state.model)
                return this.renderContent();
            else if (this.state._loading === false) {
                if (typeof(this.renderError) === 'function')
                    return this.renderError();
                return React.DOM.div({className: 'alert alert-danger'}, "An unexpected error occured.");
            } else
                return React.DOM.div({className: 'loading'});
        }
    };

});
