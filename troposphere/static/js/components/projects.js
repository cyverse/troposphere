define(['react', 'underscore', 'components/page_header', 'components/intro'], function(React, _, PageHeader, Intro) {
    var Projects = React.createClass({
        render: function() {
            return React.DOM.div({},
                PageHeader({title: "Projects"}),
                React.DOM.p({}, "Welcome to Atmosphere!"),
                Intro()
            );
        }
    });

    return Projects;
});
