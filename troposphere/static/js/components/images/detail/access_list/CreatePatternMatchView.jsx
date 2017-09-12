import React from "react";

const email = "E-Mail",
      username = "Username";

export default React.createClass({
    displayName: "CreatePatternView",

    propTypes: {
        onCreatePatternMatch: React.PropTypes.func.isRequired,
        pattern: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            pattern: this.props.pattern || "",
            matchType: email,
            licenseURL: "",
            licenseText: "",
        }
    },
    isSubmittable: function() {
        if (!this.state.pattern) {
            return false;
        } else if (this.state.matchType == email) {
            // Expect this pattern to always have an `@`
            if (this.state.pattern.search("@") < 0) {
                return false
            }
        }
        // No tests for 'username' matchType.
        //Tests passed
        return true;
    },
    onCreatePatternMatch: function(e) {
        var params = {
            pattern: this.state.pattern,
            type: this.state.matchType,
        };
        this.props.onCreatePatternMatch(params);
    },
    onPatternInputTypeChange: function(e) {
        var match_type = e.target.value;
        if (match_type == username) {
            this.setState({
                matchType: match_type
            });
        } else {
            this.setState({
                matchType: email
            });
        }
    },
    onPatternChange: function(e) {
        var title = e.target.value;
        this.setState({
            pattern: title
        })
    },
    renderPatternInputRadio: function() {
        var emailRadio,
            usernameRadio;

        if (this.state.matchType == email) {
            emailRadio = (
                <label className="radio-inline">
                    <input checked="checked"
                        type="radio"
                        name="inlinePatternOptions"
                        id="patternTypeEmail"
                        value={email}
                        onChange={this.onPatternInputTypeChange} /> {email}
                </label>);
            usernameRadio = (
                <label className="radio-inline">
                    <input type="radio"
                        name="inlinePatternOptions"
                        id="patternTypeUsername"
                        value={username}
                        onChange={this.onPatternInputTypeChange} /> {username}
                </label>);
        } else {
            emailRadio = (
                <label className="radio-inline">
                    <input type="radio"
                        name="inlinePatternOptions"
                        id="patternTypeEmail"
                        value={email}
                        onChange={this.onPatternInputTypeChange} /> {email}
                </label>);
            usernameRadio = (
                <label className="radio-inline">
                    <input checked="checked"
                        type="radio"
                        name="inlinePatternOptions"
                        id="PatternTypeUsername"
                        value={username}
                        onChange={this.onPatternInputTypeChange} /> {username}
                </label>);
        }

        return (
        <div>
            <label htmlFor="patternTypeSelect">
                Match Type
            </label>
            <div className="form-group">
                {emailRadio}
                {usernameRadio}
            </div>
        </div>
        );
    },
    renderPatternMatch: function() {
        let placeholder = "wildcard*@cyverse.org (matches wildcard1@cyverse.org, wildcard_bob@cyverse.org";
        if (this.state.matchType == username) {
            placeholder = "wildcard* (matches wildcard1, wildcard_bob, ...)"
        }
        return (
        <div className="form-group">
            <label htmlFor="pattern">
                Pattern Match
            </label>
            <input type="text"
                className="form-control"
                id="pattern"
                placeholder={placeholder}
                value={this.state.pattern}
                onChange={this.onPatternChange} />
        </div>
        );
    },
    render: function() {
        return (
        <div className="new-license-form new-item-form CreatePatternView">
            <div className="license-input-type-container">
                {this.renderPatternMatch()}
                {this.renderPatternInputRadio()}
            </div>
            <div className="new-item-form-header form-group clearfix" style={{ "border": "black 1px" }}>
                <button disabled={!this.isSubmittable()}
                    onClick={this.onCreatePatternMatch}
                    type="button"
                    className="btn btn-primary btn-sm pull-right"
                    style={{ marginTop: "20px" }}>
                    {"Create and Add"}
                </button>
            </div>
        </div>
        );
    }
});
