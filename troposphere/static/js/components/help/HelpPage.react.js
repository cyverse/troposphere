
define(function (require) {
    var stores = require('stores'),
        globals = require('globals'),
        React = require('react/addons');

    var resources = [
      {
        title: "User Manual",
        link_key: "default",
        description: "Complete documentation for using Atmosphere"
      },
      {
        title: "User Forums",
        link_key: "forums",
        description: "Get answers from Atmosphere users and staff"
      },
      {
        title: "FAQs",
        link_key: "faq",
        description: "Atmosphere's most frequently asked questions"
      },
      {
        title: "VNC Viewer Tutorial",
        link_key: "vnc-viewer",
        description: "Instructions for downloading and using VNC Viewer"
      }
    ];

    return React.createClass({
      displayName: "HelpPage",

      render: function () {
        var helpLinks = stores.HelpLinkStore.getAll();

        if (!helpLinks) {
            return <div className="loading"></div>;
        }

        var resourceElements = resources.map(function (resource) {
            var hyperlink = helpLinks.get(resource.link_key).get('href');
            return (
                <li key={resource.title}>
                    <a href={hyperlink} target="_blank">{resource.title}</a>
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
                {"."}
              </p>
            </div>
          </div>
        );
      }
    });
});
