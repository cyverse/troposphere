define(['react', 'collections/applications', 'components/applications/cards', 'components/page_header'], 
    function(React, Applications, Cards, PageHeader) {

    var Favorites = React.createClass({
        getInitialState: function() {
            return {
                appliations: null
            };
        },
        updateApplications: function(apps) {
            if (this.isMounted()) {
                var favorites = new Applications(apps.filter(function(model) {
                    return model.get('favorite');
                }));
                this.setState({applications: favorites});
            }
        },
        componentDidMount: function() {
            var apps = new Applications();
            apps.on('sync', this.updateApplications);
            apps.fetch();
        },
        componentWillUnmount: function() {
            if (this.state.applications)
                this.state.applications.off('sync', this.updateApplications);
        },
        render: function() {
            var content = React.DOM.div({className: 'loading'});
            if (this.state.applications != null)
                content = Cards.ApplicationCardList({applications: this.state.applications});
            return React.DOM.div({}, 
                PageHeader({title: "Favorite Images"}),
                content);
        }
    });

    return Favorites;

});
