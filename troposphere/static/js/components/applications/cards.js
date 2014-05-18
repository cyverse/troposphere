define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    './Rating.react',
    './Tags.react',
    './Bookmark.react',
    './ApplicationCard.react'
  ],
  function (React, Gravatar, Backbone, URL, Rating, Tags, Bookmark, ApplicationCard) {

    var ApplicationCardList = React.createClass({
      render: function () {
        var apps = this.props.applications;
        return React.DOM.div({},
          React.DOM.h3({}, this.props.title),
          React.DOM.ul({className: 'app-card-list'}, apps.map(function (app) {
            return React.DOM.li({}, ApplicationCard({application: app}));
          })));
      }
    });

    return {
      "ApplicationCardList": ApplicationCardList,
      "ApplicationCard": ApplicationCard,
      "Rating": Rating,
      "Tags": Tags
    };

  });
