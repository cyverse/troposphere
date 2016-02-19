import React from 'react';
import _ from 'underscore';

import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({
    getInitialState: function() {
        return ({
            license: this.props.licenseList[0],
            signedList: []
        })
    },

    isSigned: function( license ) {
        if (this.state.signedList.indexOf( license ) !== -1) { return true }
        return false
    },

    changeLicense: function(item) {
        this.setState({ license: item });
    },

    onNext: function() {
        let license = this.state.license;
        let licenseList = this.props.licenseList;
        license = licenseList[licenseList.indexOf(license) + 1];
        this.setState({ license });
    },

    onAgree: function() {
        let signedList = this.state.signedList;

        if (signedList.length === 0) { signedList = [...this.props.licenseList]}
        else { signedList = [] }

        this.setState({
            signedList
        });
    },

    renderLicense: function (item) {
        let style = {
                listItem: {
                    paddingLeft: "25px",
                    position: "relative"
                },
                checked: {
                    position: "absolute",
                    top: "5px", 
                    left: "5px"
                }
            };
        let checkMark = this.isSigned(item) ?
            () => <i className="glyphicon glyphicon-ok" style={style.checked}/> :
            () => {return};

        let title = item.title;
        let isActive = "";

       if (item == this.state.license) {
            isActive = "active";
        }

        return (
            <li className={`NavStacked-link ${isActive}`}>
                <a style={style.listItem}
                    onClick={this.changeLicense.bind(this, item)}
                >
                   {checkMark()}{title}
                </a>
            </li>
        );
    },

    renderLicenseList: function() {
        if (this.props.licenseList.length <= 1) { return };

        let licenses = this.props.licenseList.map(this.renderLicense);
        return (
            <ul className="AdvancedOptions-optionList">
                {licenses}
            </ul>
        )
    },

    renderCheckAgree: function() {
        return (
            <div className="checkbox">
                <label>
                <input checked={this.isSigned(this.state.license)} onClick={this.onAgree} type="checkbox"/>
                    I agree to all of these terms
                </label>
            </div>
        )
    },

    render: function() {
        let style = {
            mainContent: {
                position: "relative",
                width: "100%",
                minHeight: "420px"
            },
            agreement: {
                position: "relative",
                overflow: "scroll",
                height: "250px",
                marginBottom: "20px",
                padding: "10px 30px"
            },
            form: {
                position: "absolute",
                bottom: "0",
                right: "0"
            }
        };

        let licenseList = this.props.licenseList;
        let license = this.state.license;
        let notSigned = true;

        if (licenseList.length === this.state.signedList.length) {
            notSigned = false;
        }

        let nextButton = () => {
            if (licenseList.indexOf(license) !== (licenseList.length - 1)) {
                return  <button type="button" 
                            onClick={this.onNext} 
                            className="btn btn-xs btn-default pull-right"
                        >
                            View Next License
                        </button>
            }
            return
        };

        return (
            <div>
                <div className="modal-section AdvancedOptions">
                    {this.renderLicenseList()}
                    <div className="clearfix" style={style.mainContent}>
                        <h2 className="t-title">{license.title} </h2>
                        <div className="u-insetShadow"
                            style={style.agreement}
                        >
                            {license.text}
                        </div>
                        {nextButton()}
                        <form style={style.form}>
                            {this.renderCheckAgree()}
                        </form>
                    </div>
                </div>
                <InstanceLaunchFooter {...this.props}
                    showValidationErr={true}
                    launchIsDisabled={notSigned}
                    advancedIsDisabled={true}
                />
            </div>
        )
    }
});
