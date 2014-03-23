define(['react', 'components/page_header'], function(React, PageHeader) {
    return React.createClass({
        render: function() {
            var providers = this.props.providers;
            var items = providers.map(function(model) {
                return [
                    React.DOM.h2({}, model.get('location')),
                    React.DOM.p({}, model.get('description'))
                ];
            });
            return React.DOM.div({},
                PageHeader({title: "Cloud Providers"}),
                items);
        }
    });
});
