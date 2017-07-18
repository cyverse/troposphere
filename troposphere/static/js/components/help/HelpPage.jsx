import React from "react";
import stores from "stores";
import globals from "globals";


let resources = [
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
    }
];

export default React.createClass({
    displayName: "HelpPage",

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
       stores.HelpLinkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
       stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    render: function() {
        var helpLinks = stores.HelpLinkStore.getAll();
        var resourceElements;

        if (!helpLinks) {
            return <div className="loading"></div>;
        }

        resourceElements = resources.map(function(resource) {
            var hyperlink = helpLinks.get(resource.link_key).get("href");
            return (
            <li key={resource.title}>
                <a href={hyperlink} target="_blank">
                    {resource.title}
                </a>
                <span>{" " + resource.description}</span>
            </li>
            );
        });

        return (
        <div style={{ paddingTop: "50px" }} className="container">
            <h1 className="t-display-1">Help Page</h1>
            <h2 className="t-title">External resources</h2>
            <ul>
                {resourceElements}
            </ul>
            <div>
                <h2 className="t-title">Contact</h2>
                <p>
                    {"You can contact the Atmosphere support staff by clicking on the "}
                    <strong>{"Feedback & Support"}</strong>
                    {" button at the bottom of the page (to enter a help request online) or by sending an email to "}
                    <a href={`mailto:${globals.SUPPORT_EMAIL}`}>
                        {globals.SUPPORT_EMAIL}
                    </a>
                    {"."}
                </p>
            </div>
        </div>
        );
    }
});
