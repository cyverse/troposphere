
define(function (require) {
    var _ = require('underscore'),
      globals = require('globals'),
        React = require('react/addons');

    var resources = [
      {
        title: "User Manual",
        href: "http://jetstream-cloud.org/training.php",
        description: "Documentation for using Atmosphere"
      },
      {
        title: "Knowledge Base",
        href: "http://jetstream-cloud.org/kb-search.php",
        description: "Get answers from IU Knowledge Base"
      },
      {
        title: "Contact the team",
        href: "http://jetstream-cloud.org/contact-jetstream.php",
        description: "Request help or information from the Jetstream team"
      }
    ];

    return React.createClass({
      displayName: "HelpPage",

      render: function () {

        var resourceElements = _.map(resources, function (resource) {
          return (
            <li key={resource.title}>
              <a href={resource.href} target="_blank">{resource.title}</a>
              <span>{" " + resource.description}</span>
            </li>
          );
        });

        return (
          <div className="container">
            <h2>External resources</h2>
            <ul>
              {resourceElements}
            </ul>
            <div>
              <h2>Contact</h2>

              <p>
                {"You can contact the Atmosphere support staff by clicking on the "}
                <strong>{"Feedback & Support"}</strong>
                {" button at the bottom of the page (to enter a help request online) or by sending an email to "}
                <a href={`mailto:${globals.SUPPORT_EMAIL}`}>{globals.SUPPORT_EMAIL}</a>
              </p>
            </div>
          </div>
        );
      }
    });
});
