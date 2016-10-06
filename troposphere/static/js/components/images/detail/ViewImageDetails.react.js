import React from "react";
import Backbone from "backbone";
import TagsView from "./tags/TagsView.react";
import CreatedView from "./created/CreatedView.react";
import RemovedView from "./removed/RemovedView.react";
import AuthorView from "./author/AuthorView.react";
import DescriptionView from "./description/DescriptionView.react";
import stores from "stores";

export default React.createClass({
    displayName: "ViewImageDetails",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection),
        identities: React.PropTypes.instanceOf(Backbone.Collection),
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired
    },

    renderEditLink: function() {
        var profile = stores.ProfileStore.get(),
            image = this.props.image;

        if (profile.id
            && profile.get("username") === image.get("created_by").username
            || profile.get("is_staff")) {
            return (
                <div>
                    <a
                        onClick={this.props.onEditImageDetails}
                    >
                        <span className="glyphicon glyphicon-pencil"/>
                           {" Edit details"}
                        </a>
                </div>
            )
        }
    },

    render: function() {
        let { image, tags } = this.props;
        let style = {
            wrapper: {
                marginBottom: "80px",
                maxWidth: "600px",
            },
            details: {
                marginBottom: "20px",
            }
        };

        return (
            <div style={ style.wrapper }>
                <div style={ style.details }>
                    <CreatedView image={ image } />
                    <RemovedView image={ image } />
                    <AuthorView image={ image } />
                    <DescriptionView image={ image } />
                    <TagsView image={ image } tags={ tags } />
                </div>
                {this.renderEditLink()}
            </div>
        );
    }
});
