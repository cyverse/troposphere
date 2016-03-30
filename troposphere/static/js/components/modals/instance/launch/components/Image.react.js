import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import moment from 'moment';
import Tags from 'components/common/tags/ViewTags.react';
import Gravatar from 'components/common/Gravatar.react';

export default React.createClass({
    displayName: "Image",

    getInitialState: function(){
        let image = this.props.image;
        let versionList = null;
        let active = false;
        if (image) {
            versionList = image.get('versions');

            if (versionList.length > 0) {
                active = true;
            }
        }
        return {
            active
        }
    },

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onClick: React.PropTypes.func
    },

    handleClick: function () {
        if (this.state.active) {
            this.props.onSelectImage(this.props.image);
            return;
        }
        this.setState({ showAlert: true });
    },

    renderTags: function () {
        let tags = stores.TagStore.getAll();
        let activeTags = stores.TagStore.getImageTags(this.props.image);

        return (
            <Tags tags={tags} activeTags={activeTags} renderLinks={false}/>
        );
    },

    render: function () {
        let image = this.props.image;
        let type = stores.ProfileStore.get().get('icon_set');
        let imageCreationDate = moment(image.get('start_date')).format("MMM D, YYYY hh:mm a");
        let iconSize = 67;
        let icon;
        let fullDescription = image.get('description');
        let renderDescription = fullDescription.length < 150 ? fullDescription : (fullDescription.substring(0,150) + " ...");
        let inactiveClass = "";
        let alertMessage = () => null;

        // always use the Gravatar icons
        icon = (
            <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
        );

        if (!this.state.active) {
            inactiveClass = "media--disabled";
            if (this.state.showAlert) {
                alertMessage = () => {
                    return (
                        <div
                            style={{
                                    position: "absolute",
                                    display: "inline-block",
                                    width: "250px",
                                    top: "25%",
                                    right: "0",
                                    left: "0",
                                    margin: "auto",
                                    padding: "5px 10px",
                                    background: "#F15757",
                                    boxShadow: "0 1px 2px rgba(0,0,0,.4)",
                                    color: "white",
                                    textAlign: "center",
                                    cursor: "no-drop !important"
                                }}
                            >
                            <i className="glyphicon glyphicon-exclamation-sign"/>
                            {" Image Disabled - No Versions"}
                        </div>
                    )
                }
            }
        }
        return (
            <li
                style={{position: "relative" }}
                className="media card"
                onClick={this.handleClick}
            >
                <div className={`clearfix ${inactiveClass}`}>
                    <div className="media__img">
                        {icon}
                    </div>
                    <div className="media__content">
                        <div className="row">
                            <div className="col-md-3 t-wordBreaker">
                                <h2 className="t-body-1" style={{margin: "0 0 5px"}}>{image.get('name')}</h2>
                                <hr style={{margin: "0 0 5px" }}/>
                                <time>{imageCreationDate}</time> by <strong>{image.get('created_by').username}</strong>
                            </div>
                            <p className="media__description col-md-5">
                                {renderDescription}
                            </p>
                            <div className="col-md-4">
                                {this.renderTags()}
                            </div>
                        </div>
                    </div>
                </div>
                {alertMessage()}
            </li>
        )
    }
});
