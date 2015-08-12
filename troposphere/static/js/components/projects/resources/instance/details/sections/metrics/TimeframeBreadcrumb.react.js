define(function(require) {
  var React = require('react');

  return React.createClass({
    render: function() {
      var me = this;

      var breadcrumbs = ["1 hour", "1 day", "1 week"].map(function(content) {
        var selectableElement = React.DOM.li({}, React.DOM.a({
          href: "javascript:void(0);",
          onClick: me.props.onTimeFrameClick,
          ref: "selectedAnchorContent"
        }, content));

        var selectedElement = React.DOM.li({
          id: content,
          className: "active metrics"
        }, content)

        if (content == me.props.timeframe) {
          return selectedElement
        }
        return selectableElement
      });

      return (
          <div className="metrics breadcrumb">{ breadcrumbs }</div>
           )
    }
  });
})
