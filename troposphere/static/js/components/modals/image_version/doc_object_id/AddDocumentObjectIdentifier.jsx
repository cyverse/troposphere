import React from "react";

/**
 * An explanation of the regular expression below, by 'component' is
 * available at: https://regex101.com/r/2wzS9M/1
 */
const doiRegex = /\b(10\.[0-9]{4,}(?:\.[0-9]+)*\/(?:(?![\"&\'])\S)+)\b/im;



const AddDocumentObjectIdentifier = React.createClass({
    displayName: "AddDocumentObjectIdentifier",

    propTypes: {
        currentDOI: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            doi: this.props.currentDOI || "",
            invalid: false
        };
    },

    onChange: function(e) {
        /**
         * It seems like one of the shortest DOIs you could
         * have, and be valid, is about 8 characters.
         * For the CyVerse Data Commons, you see DOIs like:
         *
         *   10.7946/P23011
         *
         * So, we'll avoid doing a regular expression "test"
         * until we have a DOI over 8 characters
         */
        let doiInput = e.target.value,
            shouldTest = doiInput && doiInput.length > 8;

        // validate it with the regex ...
        // if valid ... setState
        if (shouldTest && doiRegex.test(doiInput)) {
            this.setState({
                doi: doiInput,
                invalid: false
            });
            if (this.props.onChange) {
                this.props.onChange(doiInput);
            }
        } else if (shouldTest) {
            this.setState({
                doi: doiInput,
                invalid: true
            });
        } else {
            this.setState({
                doi: doiInput,
            });
        }

    },

    onBlur: function(e) {
        let doiInput = e.target.value;

        if (doiRegex.test(doiInput)) {
            this.setState({
                doi: doiInput,
                invalid: false,
                // indicate we've exited so a "green", okay can be shown
                success: true
            });
            if (this.props.onChange) {
                this.props.onChange(doiInput);
            }
        } else {
            let invalid = doiInput && doiInput.length > 0;

            this.setState({
                doi: doiInput,
                invalid
            });
            /**
             * only inform callback the DOI is "cleared" out
             *
             * we're looking to avoid "bubbling" up invalid
             * DOIs to the parent component, so only signal
             * a change when this is a "removal" change.
             */
            if (doiInput == "" && this.props.onChange) {
                this.props.onChange(doiInput);
            }
        }
    },

    render() {
        let title = "Document Object Identifier (DOI)",
            helpMessage = null,
            hasValidationClass = null;

        let { doi, invalid, success } = this.state;

        if (invalid) {
            helpMessage = "Value provided is not a valid DOI";
            hasValidationClass = "has-error";
        } else if (success) {
            helpMessage = (
                <span>
                    <i className="glyphicon glyphicon-ok" /> {" Valid DOI"}
                </span>
            );
            hasValidationClass = "has-success";
        }

        return (
        <div>
            <h4 className="t-body-2">{title}</h4>
            <div className="help-block">
                <p>
                If you have a Document Object Identifier (DOI) issued by a journal or
                organization the represents this image version, you can associated it
                with this image version by entering it in the field below.
                </p>
            </div>
            <div className="alert alert-info">
                <p className="info">
                CyVerse will offer DOI issuance for virtual machine images in the future.
                </p>
            </div>
            <div className={"form-group " + hasValidationClass }>
                <input id="doiInput"
                       type="text"
                       className="form-control"
                       value={doi}
                       onChange={this.onChange}
                       onBlur={this.onBlur} />
                <span className="help-block">{helpMessage}</span>
            </div>
        </div>
        );
    },



});

export default AddDocumentObjectIdentifier;
