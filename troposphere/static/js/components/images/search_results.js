define(['react'], function(React) {
    var SearchResults = React.createClass({
        render: function() {
            return React.DOM.div({}, this.props.query);
        }
    });
    return SearchResults;
});
