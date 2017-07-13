import React from 'react';

import modals from 'modals';


//TODO: I dont know where this component is used -- modified to ensure consistency
let LoginLink = React.createClass({
    onLogin: function(e) {
        e.preventDefault();
        modals.PublicModals.showPublicLoginModal();
    },
    renderLink: function() {
        if(window.use_login_selection) {
            return (
                <a id="login_link" href="#" onClick={this.onLogin}>Login</a>
            );
        } else {
            return (
                <a id="login_link" href="/login">Login</a>
            );
        }

    },
    render: function() {
        return (
        <li className="dropdown">
            {this.renderLink()}
        </li>
        );
    }
});

let LoginHeader = React.createClass({
    displayName: "LoginHeader",

    propTypes: {
    },

    // We need the screen size for handling the opening and closing of our menu on small screens

    getInitialState: function() {
        return {
            windowWidth: window.innerWidth
        };
    },

    handleResize: function(e) {
        this.setState({
            windowWidth: window.innerWidth
        });
    },

    componentDidMount: function() {
        window.addEventListener("resize", this.handleResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this.handleResize);
    },

    render: function() {
        let brandLink = (
            <a id="brand_link" className="navbar-brand active" href={"#"} />
        );

        return (
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
                <div className="navbar-header">
                    <button type="button"
                        className="navbar-toggle"
                        data-toggle="collapse"
                        data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    {brandLink}
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <LoginLink/>
                    </ul>
                </div>
            </div>
        </div>
        );

    }
});

export default LoginHeader;
