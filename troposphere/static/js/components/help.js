define(['react', 'components/page_header'], function(React, PageHeader) {

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
        },
    ];

    var FeedbackForm = React.createClass({
        getInitialState: function() {
            return {
                content: ""
            };
        },
        onSubmit: function(e) {
            e.preventDefault();
            console.log(e);
            console.log(this.state.content);
            /* TODO: Send support request */
        },
        handleChange: function(e) {
            this.setState({content: event.target.value});
        },
        render: function() {
            return React.DOM.form({onSubmit: this.onSubmit},
                React.DOM.div({className: 'form-group'}, 
                    React.DOM.textarea({
                        className: 'form-control',
                        rows: 5,
                        value: this.state.content, 
                        onChange: this.handleChange})),
                React.DOM.div({className: 'form-group'}, 
                    React.DOM.input({className: 'btn btn-primary', type: 'submit', value: "Send"})));
        }
    });

    return React.createClass({
        render: function() {
            return React.DOM.div({},
                PageHeader({title: "Help"}),
                React.DOM.h2({}, "External resources"),
                React.DOM.ul({}, _.map(resources, function(resource) {
                    return React.DOM.li({},
                        React.DOM.a({href: resource.href, target: "_blank"}, resource.title),
                        " ",
                        resource.description);
                })),
                React.DOM.h2({}, "Atmosphere staff support"),
                React.DOM.p({}, "Are you experiencing a problem with Atmosphere to which you can't find a solution? Do you have a feature request or bug report? Let us know!"),
                FeedbackForm({}));
        }
    });

});
