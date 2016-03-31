import React from 'react';
import stores from 'stores';
import Router from 'react-router';
import Glyphicon from 'components/common/Glyphicon.react';
import context from 'context';


export default React.createClass({
    displayName: "SecondaryRequestNav",


    renderRoute: function (name, linksTo, icon) {

      return (
        <li key={name}>
          <Router.Link to={linksTo}>
            <Glyphicon name={icon}/>
            <span>{name}</span>
          </Router.Link>
        </li>
      )
    },

    render: function () {
      return (
        <div>
          <div className="secondary-nav">
            <div className="container">
              <ul className="secondary-nav-links">
                {this.renderRoute("Resource Requests", "my-requests-resources", "circle-arrow-up")}
                {this.renderRoute("Imaging Requests", "my-requests-images", "floppy-open")}
              </ul>
            </div>
          </div>
        </div>
      );
    }
});
