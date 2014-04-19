define(['react', 'backbone'], function(React, Backbone) {

    var AdvancedOptions = React.createClass({
        render: function() {
            var display = this.props.visible ? "block" : "none";
            return React.DOM.div({style: {display: display}, className: 'well advanced-search-options'},
                "Advanced stuff, here, man");
        }
    });
    
    var SearchContainer = React.createClass({
        getDefaultProps: function() {
            return {query: ""};
        },
        getInitialState: function() {
            return {
                showAdvancedOptions: false,
                query: this.props.query
            }
        },
        statics: {
            handleSearch: function(query) {
                var queryUrl = "images/search/" + encodeURIComponent(query);
                Backbone.history.navigate(queryUrl, {trigger: true});
            }
        },
        toggleAdvancedOptions: function(e) {
            e.preventDefault();
            this.setState({showAdvancedOptions: !this.state.showAdvancedOptions});
        },
        handleChange: function(e) {
            this.setState({query: e.target.value});
        },
        handleKeyUp: function(e) {
            if (e.keyCode == 13 && this.state.query.length)
                SearchContainer.handleSearch(this.state.query);
        },
        render: function() {
            return React.DOM.div({id: 'search-container'},
                React.DOM.input({
                    type: 'text',
                    className: 'form-control search-input',
                    placeholder: 'Search by Image Name, Tag, OS, and more',
                    onChange: this.handleChange,
                    value: this.state.query,
                    onKeyUp: this.handleKeyUp,
                }), 
                React.DOM.a({
                    onClick: this.toggleAdvancedOptions,
                    href: '#'}, 
                    (this.state.showAdvancedOptions ? "Hide" : "Show") + 
                        " Advanced Search Options"),
                AdvancedOptions({visible: this.state.showAdvancedOptions}),
                React.DOM.hr({}));
        }
    });

    return SearchContainer;

});
