import React from "react";
import { Link } from "react-router";
import CryptoJS from "crypto-js";
import Gravatar from "components/common/Gravatar";
import moment from "moment";

import stores from "stores";

// TODO - evaluate making this a "common" component
import RefreshComponent from "components/projects/resources/instance/details/sections/metrics/RefreshComponent";


export default React.createClass({
    displayName: "InstanceHistoryList",

    getInitialState: function() {
        return {
            instanceHistoryItems: stores.InstanceHistoryStore.fetchWhere({
                "page_size": 10,
                "unique": true
            })
        }
    },

    onNewData: function() {
        this.setState({
            instanceHistoryItems: stores.InstanceHistoryStore.fetchWhere({
                "page_size": 10,
                "unique": true
            })
        });
    },

    componentDidMount: function() {
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function() {
        stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
    },

    onLoadMoreInstanceHistory: function() {
        stores.InstanceHistoryStore.fetchMoreWhere({
            "page_size": 10,
            "unique": true
        });
    },

    refreshHistory: function() {
        this.setState({
            instanceHistoryItems: stores.InstanceHistoryStore.fetchFirstPageWhere({
                "page_size": 10,
                "unique": true
            }, {
                clearQueryCache: true
            })
        });
        stores.InstanceHistoryStore.lastUpdated = Date.now();
    },

    renderRefreshButton: function() {

        return (
        <span className="pull-right refresh-button"><RefreshComponent onRefreshClick = {this.refreshHistory} timestamp = {stores.InstanceHistoryStore.lastUpdated} delay = {1000 * 60} /></span>
        );

    },

    renderTitle: function() {
        var instanceHistories = this.state.instanceHistoryItems,
            title = "Instance History",
            historyCount;

        if (instanceHistories) {
            historyCount = " (" + instanceHistories.meta.count + " instances launched)";
            title += historyCount;
        }

        return title;
    },

    renderLoadMoreHistoryButton: function() {
        // Load more instances from history
        var buttonStyle = {
                margin: "auto",
                display: "block"
            },
            loadingStyle = {
                margin: "0px auto"
            },
            moreHistoryButton = null,
            instanceHistories = this.state.instanceHistoryItems;

        if (instanceHistories.meta.next) {
            if (this.state.isLoadingMoreResults) {
                moreHistoryButton = (
                    <div style={loadingStyle} className="loading"></div>
                );
            } else {
                moreHistoryButton = (
                    <button style={buttonStyle} className="btn btn-default" onClick={this.onLoadMoreInstanceHistory}>
                        Show More History
                    </button>
                );
            }
        }

        return moreHistoryButton;
    },

    renderBody: function() {
        var instanceHistories = this.state.instanceHistoryItems,
            instances = stores.InstanceStore.getAll(),
            providers = stores.ProviderStore.getAll(),
            instanceHistoryItems;

        if (!instanceHistories || !instances || !providers) return <div className="loading"></div>;

        instanceHistoryItems = instanceHistories.map(function(instance) {
            var name = instance.get("instance").name,
                image = instance.get("image"),
                provider = instance.get("provider");

            var startDate = instance.get("instance").start_date,
                endDate = instance.get("instance").end_date,
                formattedStartDate = moment(startDate).format("MMM DD, YYYY hh:mm a"),
                formattedEndDate = moment(endDate).format("MMM DD, YYYY hh:mm a"),
                now = moment(),
                timeSpan = now.diff(startDate, "days"),
                instanceHistoryHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
                iconSize = 63,
                type = stores.ProfileStore.get().get("icon_set"),
                imageName = image ? image.name : "[image no longer exists]",
                imageLink;

            if (!moment(endDate).isValid())
                formattedEndDate = "Present";

            if (image) {
                imageLink = (
                    <Link to={`images/${image.id}`}>
                        {imageName}
                    </Link>
                )
            } else {
                imageLink = (
                    <strong>{imageName}</strong>
                )
            }

            if (!provider) {
                provider = {
                    name: "[no provider name]"
                };
            }

            return (
            <div key={instance.cid}>
                <div className="instance-history">
                    <ul>
                        <li>
                            <div>
                                <Gravatar hash={instanceHistoryHash} size={iconSize} type={type} />
                                <div className="instance-history-details">
                                    <Link to={`instances/${instance.get("instance").id}`}>
                                        <strong className="name">{name}</strong>
                                    </Link>
                                    <div>
                                        {`Launched from `}
                                        {imageLink}
                                    </div>
                                    <div>
                                        {"Ran: " + formattedStartDate + " - " + formattedEndDate}
                                    </div>
                                </div>
                                <span className="launch-info">
                                    <strong>{timeSpan + " days ago"}</strong> {" on " + provider.name}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            );
        }.bind(this));

        return (
        <div>
            {instanceHistoryItems}
            {this.renderLoadMoreHistoryButton()}
        </div>
        );
    },

    render: function() {
        return (
        <div onClick={this.loadMoreHistory}>
            <h2 className="t-headline">{this.renderTitle()} {this.renderRefreshButton()}</h2>
            {this.renderBody()}
        </div>
        );
    }
});
