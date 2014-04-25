define(['react', 'components/page_header', 'components/common/glyphicon'], function(React, PageHeader, Glyphicon) {

    var ReportInstanceForm = React.createClass({
        getInitialState: function() {
            return {
                ssh: false,
                vnc: false,
                pending: false,
                installErrors: false,
                metrics: false,
                other: false,
                details: ""
            };
        },
        updateCheckbox: function(key, e) {
            var state = {};
            state[key] = e.target.checked;
            this.setState(state);
        },
        updateDetails: function(e) {
            this.setState({details: e.target.value});
        },
        renderCheckbox: function(value, text) {
            return React.DOM.div({className: 'checkbox'},
                React.DOM.label({},
                    React.DOM.input({
                        type: 'checkbox',
                        name: 'problems',
                        id: 'problems-' + value,
                        value: value,
                        checked: this.state[value],
                        onChange: _.partial(this.updateCheckbox, value)}),
                    text));
        },
        handleSubmit: function(e) {
            e.preventDefault();
            console.log(this.state);
        },
        render: function() {
            return React.DOM.form({role: 'form', onSubmit: this.handleSubmit},
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({}, "What problems are you having with this instance?"),
                    this.renderCheckbox("ssh", "I cannot connect via SSH."),
                    this.renderCheckbox("vnc", "I cannot connect via VNC."),
                    this.renderCheckbox("pending", "The instance's status never changed from pending to running"),
                    this.renderCheckbox("installErrors", "I am receiving errors while trying to run or install software"),
                    this.renderCheckbox("metrics", "The instance's metrics do not display."),
                    this.renderCheckbox("other", "Other problem(s).")),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'details'}, "Please provide as many details about the problem as possible."),
                    React.DOM.textarea({className: 'form-control', onChange: this.updateDetails, rows: 6})),
                React.DOM.button({type: 'submit', className: 'btn btn-primary'}, "Submit"));
        }
    });

    var ReportInstance = React.createClass({
        componentDidMount: function() {
            if (!this.props.instance)
                this.props.onRequestInstance();
        },
        renderIntro: function() {
            return React.DOM.p({className: 'alert alert-info'},
                Glyphicon({name: 'info-sign'}),
                " Is instance ",
                React.DOM.code({}, this.props.instance.get('name_or_id')),
                " exhibiting unexpected behavior? Please read about ",
                React.DOM.a({href: 'https://pods.iplantcollaborative.org/wiki/x/Blm'}, "using instances"),
                " or ",
                React.DOM.a({href: 'https://pods.iplantcollaborative.org/wiki/x/p55y'}, "troubleshooting instances"),
                " for answers to common problems before submitting a request to support staff.");
        },
        render: function() {
            if (this.props.instance)
                return React.DOM.div({},
                    PageHeader({title: "Report Instance"}),
                    this.renderIntro(),
                    ReportInstanceForm({instance: this.props.instance}));
            else
                return React.DOM.div({className: 'loading'});
        }
    });

    return ReportInstance;
});
