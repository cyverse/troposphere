define(['react', 'components/common/gravatar', 'backbone'], function(React, Gravatar, Backbone) {

    var Rating = React.createClass({
        render: function() {
            var repeatString = function(string, num) {
                return new Array( num + 1 ).join( string );
            };
            return React.DOM.div({className: 'star-rating'}, 
                repeatString("\u2605", this.props.rating) + 
                repeatString("\u2606", 5 - this.props.rating));
        }
    });

    var Bookmark = React.createClass({
        getInitialState: function() {
            return {
                isFavorite: this.props.image.get('favorite')
            };
        },
        updateFavorite: function(model) {
            this.setState({'isFavorite': model.get('favorite')});
        },
        componentDidMount: function() {
            this.props.image.on('change:favorite', this.updateFavorite);
        },
        componentWillUnmount: function() {
            this.props.image.off('change:favorite', this.updateFavorite);
        },
        toggleFavorite: function(e) {
            e.preventDefault();
            this.props.image.set('favorite', !this.props.image.get('favorite'));
        },
        render: function() {
            return React.DOM.a({
                className: 'bookmark ' + (this.state.isFavorite ? 'on' : 'off'),
                href: '#',
                onClick: this.toggleFavorite
            });
        }
    });

    var ApplicationCard = React.createClass({
        getDefaultProps: function() {
            return {
                showDetails: true,
                showLaunch: false
            }
        },
        onImageClick: function(e) {
            e.preventDefault();
            Backbone.history.navigate("images/" + this.props.application.id, {trigger: true});
        },
        render: function() {
            var app = this.props.application;

            var iconSize = 150;
            var icon;
            if (app.get('icon'))
                icon = React.DOM.img({
                    src: app.get('icon'),
                    width: iconSize,
                    height: iconSize
                });
            else
                icon = Gravatar({hash: app.get('uuid_hash'), size: iconSize});

            var imageUri = url_root + "/images/" + app.get('uuid');

            return React.DOM.div({className: 'app-card'}, 
                React.DOM.div({className: 'icon-container'}, React.DOM.a({
                        href: imageUri, 
                        onClick: this.onImageClick
                    }, icon)),
                React.DOM.div({className: 'app-name'}, React.DOM.a({
                        href: imageUri, 
                        onClick: this.onImageClick,
                        title: app.get('name_or_id')
                    }, app.get('name_or_id'))),
                Rating({rating: app.get('rating')}),
                React.DOM.button({
                    className: 'btn btn-primary btn-block launch-button', 
                    onClick: this.props.onLaunch}, "Launch"),
                Bookmark({image: app}));
        }
    });

    var ApplicationCardList = React.createClass({
        render: function() {
            var apps = this.props.applications;
            return React.DOM.div({},
                React.DOM.h2({}, this.props.title),
                React.DOM.ul({className: 'app-card-list'}, apps.map(function(app) {
                    return React.DOM.li({}, ApplicationCard({application: app}));
                })));
        }
    });

    return {
        "ApplicationCardList": ApplicationCardList,
        "ApplicationCard": ApplicationCard,
        "Rating": Rating
    }

});
