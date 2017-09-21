import React from "react";
import SelectMenu from "components/common/ui/SelectMenu";

const email = "E-Mail",
      username = "Username";

export default React.createClass({
    displayName: "CreatePatternView",

    propTypes: {
        onCreatePatternMatch: React.PropTypes.func.isRequired,
        pattern: React.PropTypes.string.isRequired,
        allowAccess: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
        return {
            pattern: this.props.pattern || "",
            allowAccess: this.props.allowAccess || true,
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
            allowAccess: this.state.allowAccess
        };
        this.props.onCreatePatternMatch(params);
    },
    onPatternTypeChanged: function(typeOption) {
        var match_type = typeOption.value;
        this.setState({
            matchType: match_type
        });
    },
    onAccessChanged: function(accessOpt) {
        var allowAccess = accessOpt.value;
        this.setState({
            allowAccess,
        })
    },
    onPatternChange: function(e) {
        var title = e.target.value;
        this.setState({
            pattern: title
        })
    },
    renderPatternOptions: function() {
        let options = [
                {value: email, message: "E-mail pattern"},
                {value: username, message: "Username pattern"}
            ];
        let {matchType} = this.state;
        let current = options.find(option => option.value == matchType);

        return (<SelectMenu id="patternOptions" current={current}
                    optionName={ o => o.message }
                    list={options}
                onSelect={this.onPatternTypeChanged} />
            );
    },
    renderAccessOptions: function() {
        let options = [
                {value: true, message: "Allow access to pattern match"},
                {value: false, message: "Deny access to pattern match"}
            ];
        let {allowAccess} = this.state;
        let current = options.find(option => option.value == allowAccess);

        return (<SelectMenu id="accessOptions" current={current}
                    optionName={ o => o.message }
                    list={options}
                onSelect={this.onAccessChanged} />
            );
    },
    renderPatternMatch: function() {
        let placeholder = "wildcard*@cyverse.org (matches wildcard1@cyverse.org, wildcard_bob@cyverse.org";
        if (this.state.matchType == username) {
            placeholder = "wildcard* (matches wildcard1, wildcard_bob, ...)"
        }
        return (
        <div className="form-group">
            <label htmlFor="patternExpresion">
                Pattern
            </label>
            <input type="text"
                className="form-control"
                id="patternExpression"
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
                <label htmlFor="patternOptions">
                    Type
                </label>
                {this.renderPatternOptions()}
                <label htmlFor="accessOptions">
                    Allow/Deny Access
                </label>
                {this.renderAccessOptions()}
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
