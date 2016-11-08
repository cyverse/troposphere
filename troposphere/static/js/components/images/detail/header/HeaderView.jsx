import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import $ from "jquery";
import stores from "stores";
import modals from "modals";
import { trackAction } from "utilities/userActivity";
import Bookmark from "../../common/Bookmark";

export default React.createClass({
    displayName: "HeaderView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function() {
        var el = ReactDOM.findDOMNode(this);
        var $el = $(el).find(".tooltip-wrapper");
        $el.tooltip({
            title: "NEW! You can now add an Image to your project to make launching instances even easier!",
            placement: "left"
        });
    },

    showLaunchModal: function(e) {
        modals.InstanceModals.launch({
            image: this.props.image,
            initialView: "BASIC_VIEW"
        });
        trackAction("launched-from-image-detail", {});
    },

    showAddProjectModal: function(e) {
        e.preventDefault(); // Do i need this?
        modals.ProjectModals.addImage(this.props.image);
    },

    onReturnToPreviousPage: function(e) {
        e.preventDefault();
        Backbone.history.history.back();
    },

    render: function() {
        let profile = stores.ProfileStore.get();
        let buttonGroup;

        if (profile.id) {
            buttonGroup = (
                <div>
                    <span style={{ marginRight: "20px" }}>
                        <Bookmark width="25px" image={ this.props.image }/>
                    </span>
                    <span
                        className="tooltip-wrapper"
                        style={{ marginRight: "20px" }}
                    >
                        <button className="btn btn-default" onClick={this.showAddProjectModal}>
                            <i className="glyphicon glyphicon-plus"></i> Add to Project
                        </button>
                    </span>
                    <button
                        className="btn btn-primary launch-button"
                        onClick={ this.showLaunchModal }
                    >
                        Launch
                    </button>
                </div>
            );
        }

        return (
            <div
                style={ this.style().header }
                className="image-header"
            >
                <div style={ this.style().titleGroup }>
                    <svg
                        style={ this.style().backButton }
                        onClick={this.onReturnToPreviousPage}
                        fill="#000000"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"/>
                    </svg>
                    <h1 className="t-headline">
                        {this.props.image.get("name")}
                    </h1>
                </div>
                { buttonGroup }
            </div>
        );
    },

    style() {
        return {
            header: {
                position: "relative",
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between"
            },

            titleGroup: {
                flex: "1",
            },

            backButton: {
                float: "left",
                cursor: "pointer",
                position: "relative",
                marginRight: "10px",
            },
        };
    },
});
