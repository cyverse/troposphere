define(['react', 'components/applications/search',
'components/page_header', 'components/mixins/loading', 'rsvp',
'controllers/applications', 'components/applications/cards'], function(React,
SearchBox, PageHeader, LoadingMixin, RSVP, Applications, Cards) {

    var Results = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            return Applications.searchApplications(this.props.query);
        },
        renderContent: function() {
            return Cards.ApplicationCardList({applications: this.state.model});
        }
    });

    var SearchResults = React.createClass({
        render: function() {
            return React.DOM.div({}, 
                PageHeader({title: "Image Search"}),
                SearchBox({query: this.props.query}),
                Results({query: this.props.query}))
        }
    });

    return SearchResults;

});
