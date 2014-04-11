define(['react'], function(React) {

    var AdvancedOptions = React.createClass({
        render: function() {
            return React.DOM.div({style: {display: this.props.visible ? "block" : "none"}}, "Advanced stuff, here, man");
        }
    });
    
    var SearchContainer = React.createClass({
        getInitialState: function() {
            return {
                showAdvancedOptions: false,
                query: ""
            }
        },
        toggleAdvancedOptions: function(e) {
            e.preventDefault();
            this.setState({showAdvancedOptions: !this.state.showAdvancedOptions});
        },
        handleChange: function(e) {
            this.setState({query: e.target.value});
        },
        render: function() {
            return React.DOM.div({},
                React.DOM.input({
                    type: 'text',
                    className: 'form-control',
                    placeholder: 'Search by Image Name, Tag, OS, and more',
                    onChange: this.handleChange,
                    value: this.state.query
                }),
                React.DOM.a({
                    onClick: this.toggleAdvancedOptions,
                    href: '#'}, 
                    (this.state.showAdvancedOptions ? "Hide" : "Show") + 
                        " Advanced Search Options"),
                AdvancedOptions({visible: this.state.showAdvancedOptions}));
        }
    });

    return SearchContainer;

});
