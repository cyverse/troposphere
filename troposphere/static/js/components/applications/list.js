define(['react', 'components/page_header', 'collections/applications', 
    'components/applications/cards', 'components/applications/search'],
    function(React, PageHeader, Applications, Cards, ApplicationSearch) {

    var ApplicationsHome = React.createClass({
        getInitialState: function() {
            return {
                applications: null
            };
        },
        helpText: function() {
            return React.DOM.p({}, "Applications are cool. You are, too. Keep bein' cool, bro.");
        },
        render: function() {
            var content = React.DOM.div({className: "loading"});
            if (this.state.applications != null)
                content = [Cards.ApplicationCardList({
                    title: "Featured Images",
                    applications: new Applications(this.state.applications.filter(function(app) {
                        return app.get('featured');
                    }))
                })];

            return React.DOM.div({},
                PageHeader({title: 'Images', helpText: this.helpText}),
                ApplicationSearch(),
                React.DOM.div({className: 'view-selector'}, 'View:', 
                    React.DOM.a({className: 'btn btn-default'}, React.DOM.span({className: 'glyphicon glyphicon-th'}, '')),
                    React.DOM.a({className: 'btn btn-default'}, React.DOM.span({className: 'glyphicon glyphicon-th-list'}, ''))),
                content);
        },
        updateApplications: function(apps) {
            if (this.isMounted())
                this.setState({applications: apps});
        },
        componentDidMount: function() {
            var apps = new Applications();
            apps.on('sync', this.updateApplications);
            apps.on('change', this.forceUpdate.bind(this, null));
            apps.fetch();
        },
        componentWillUnmount: function() {
            if (this.state.applications)
                this.state.applications.off('sync', this.updateApplications);
        }
    });

    return ApplicationsHome;

});
