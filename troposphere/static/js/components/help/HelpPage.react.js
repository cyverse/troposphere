import _ from "underscore";
import React from 'react/addons';

let resources = [{
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
        href: "https://pods.iplantcollaborative.org/wiki/display/atmman/Atmosphere+FAQs",
        description: "Atmosphere's most frequently asked questions"
    },
    {
        title: "VNC Viewer Tutorial",
        href: "https://pods.iplantcollaborative.org/wiki/display/atmman/Using+VNC+Viewer+to+Connect+to+an+Atmosphere+VM",
        description: "Instructions for downloading and using VNC Viewer"
    }
];

export default React.createClass({
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
                <a href="mailto:support@iplantcollaborative.org">support@iplantcollaborative.org</a>
              </p>
            </div>
          </div>
        );
      }
});
