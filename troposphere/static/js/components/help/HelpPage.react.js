/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './FeedbackForm.react',
    'context'
  ],
  function (React, PageHeader, FeedbackForm, context) {

    var resources = [
      {
        title: "User Manual",
        href: "https://pods.iplantcollaborative.org/wiki/x/Iaxm",
        description: "Complete documentation for using Atmosphere"
      },
      {
        title: "User Forums",
        href: "http://ask.iplantcollaborative.org",
        description: "Get answers from iPlant users and staff"
      },
      {
        title: "FAQs",
        href: "https://pods.iplantcollaborative.org/wiki/x/Iaxm",
        description: "Atmosphere's most frequently asked questions"
      },
      {
        title: "VNC Viewer Tutorial",
        href: "https://pods.iplantcollaborative.org/wiki/x/Iaxm",
        description: "Instructions for downloading and using VNC Viewer"
      }
    ];

    return React.createClass({

      render: function () {

        var resourceElements = _.map(resources, function (resource) {
          return (
            <li>
              <a href={resource.href} target="_blank">{resource.title}</a>
              <span>{" " + resource.description}</span>
            </li>
          );
        });

        var feedbackSection = (
          <div>
            <h2>Atmosphere staff support</h2>
            <p>
              {
                "Are you experiencing a problem with Atmosphere to which you " +
                "can't find a solution? Do you have a feature request or bug " +
                "report? Let us know!"
              }
            </p>
            <FeedbackForm/>
          </div>
        );

        return (
          <div>
            <div className="container">
              <h2>External resources</h2>
              <ul>
                {resourceElements}
              </ul>
              {context.profile ? feedbackSection : null}
            </div>
          </div>
        );
      }
    });

  });
