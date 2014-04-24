define(['react'], function(React) {
    var ReportInstance = React.createClass({
        render: function() {
            return React.DOM.div({}, "Report " + this.props.instanceId);
        }
    });

    return ReportInstance;
});
