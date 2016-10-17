import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import stores from "stores";
import actions from "actions";

import { ReplayIcon } from 'troposphere-ui/icons';


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default React.createClass({
    displayName: "RefreshButton",

    getInitialState: function() {
        return {
            isRefreshing: false
        }
    },

    handleRefresh: function() {
        var instances = stores.InstanceStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            refreshTime = randomIntFromInterval(5, 7);

        // show the user something so they think the resources are polling...
        this.setState({
            isRefreshing: true
        });
        setTimeout(function() {
            if (this.isMounted()) this.setState({
                    isRefreshing: false
                });
        }.bind(this), refreshTime * 1000);

        // now actually poll the instances and volumes
        instances.each(function(instance) {
            actions.InstanceActions.poll({
                instance: instance
            });
        });

        volumes.each(function(volume) {
            actions.VolumeActions.poll({
                volume: volume
            });
        });
    },

    render: function() {
        return (
        <span onClick={this.handleRefresh}>
            <ReplayIcon size={ 25 } />
        </span>
        );
    }

});
