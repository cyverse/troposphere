define(['react'], function(React) {

    /*
     * The loading mixin can be used for components that require some
     * computation to be performed before any content is rendered. To use it,
     * include this class in a component's mixins attribute, and implement
     * (minimally), a method called "model" that returns a promise and method
     * called "renderContent" that will be called after the promise resolves.
     * In "renderContent", this.state.modal refers to the resolved promise.
     * Optionally, components may also implement a "renderError" method that
     * will be invoked if the promise rejects.
     */
    return {
        getInitialState: function() {
            return {_loading: true, model: null};
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState(this.getInitialState(), this._getModel);
        },
        _getModel: function() {
            this.model().then(function(data) {
                    this.setState({model: data, _loading: false});
                }.bind(this),
                function(msg) {
                    console.error(msg);
                    this.setState({_loading: false, _error: msg});
                }.bind(this));
        },
        componentDidMount: function() {
            this._getModel();
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
