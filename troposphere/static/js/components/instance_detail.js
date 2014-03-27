define(['react'], function(React) {
    return React.createClass({
        render: function() {
            var instance = this.props.instance;
            console.log(instance);
            return React.DOM.div({}, "instance!")
        }
    });
});
