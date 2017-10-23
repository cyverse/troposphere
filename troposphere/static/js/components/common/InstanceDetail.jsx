import Backbone from "backbone";
import React from "react";

import subscribe from "utilities/subscribe";
import globals from "globals";
import context from "context";

import featureFlags from "utilities/featureFlags";
import AllocationSourceSection from "components/projects/resources/instance/details/sections/AllocationSourceSection";
import InstanceDetailsSection from "components/projects/resources/instance/details/sections/InstanceDetailsSection";
import PastInstanceDetailsSection from "components/projects/resources/instance/details/sections/PastInstanceDetailsSection";
import InstanceActionsAndLinks from "components/projects/resources/instance/details/actions/InstanceActionsAndLinks";
import InstanceMetricsSection from "components/projects/resources/instance/details/sections/InstanceMetricsSection";
import InstancePlaybookHistorySection from "components/projects/resources/instance/details/sections/InstancePlaybookHistorySection";
import InstanceAccessListView from "components/common/InstanceAccessListView";
import InstanceInfoSection from "components/projects/resources/instance/details/sections/InstanceInfoSection";
import InstanceHistorySection from "components/common/InstanceHistorySection";


const InstanceDetail = React.createClass({
    displayName: "InstanceDetail",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        params: React.PropTypes.object
    },

    onNewData: function() { this.forceUpdate(); },

    renderAllocationSourceSection(key) {
        let instance = this.props.params,
            instance_username = instance.get('user').username,
            current_username = context.profile.get('username'),
            disabled = (current_username != instance_username);
        let props = {
            disabled: disabled,
            instance,
            key,
            ...this.props
        }
        return (
        <AllocationSourceSection { ...props }/>
        );
    },


    renderInactiveInstance: function(history) {
        let { InstanceStore } = this.props.subscriptions;
        var instanceHistory = history.first(),
            instance = instanceHistory.get('instance'),
            instanceObj = InstanceStore.fetchOne(instance.id, {
                archived: true,
            });

        if(!instanceObj) {
            return <div className="loading" />
        }

        return (
            <div className="row resource-details-instanceDetailsSection">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instanceObj} />
                    <hr />
                    <PastInstanceDetailsSection instance={instanceObj} />
                    <hr/>
                    <InstanceHistorySection instance={instanceObj} />
                </div>
            </div>
        );
    },

    renderActiveInstance: function(instance) {
        let { ProjectStore } = this.props.subscriptions;
        let project = this.props.project;
        if (!project) {
            return (<div className="loading" />);
        }

        return (
            <div className="row resource-details-instanceDetailsSection">
                <div className="col-md-9">
                    {this.renderSections()}
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks project={project} instance={instance} />
                </div>
            </div>
        );
    },
    renderSections: function() {
        let instance = this.props.params,
            instance_id = instance.id,
            instance_project_shared_with_me = instance.get('project').shared_with_me,
            is_shared_instance = instance_project_shared_with_me,
            project = this.props.project,
            info_section = (<InstanceInfoSection key={instance_id+"-info"} instance={instance} editable={!is_shared_instance}/>),
            details_section = (<InstanceDetailsSection key={instance_id+"-details"} instance={instance} />),
            sections = [
                info_section,
                (<hr key={instance_id+"-hr1"} />),
                details_section,
            ];

        if(globals.USE_ALLOCATION_SOURCES && !is_shared_instance) {
            var allocationSourceSection = this.renderAllocationSourceSection(instance_id+"-allocations");
            sections.splice(2, 0, (<hr key={instance_id+"-hr2"} />));
            sections.splice(2, 0, allocationSourceSection);
        }
        if(globals.SHOW_INSTANCE_METRICS) {
            var metricsSection = (<InstanceMetricsSection key={instance_id+"-metrics"} instance={instance} />);
            sections.push(<hr key={instance_id+"-hr3"} />);
            sections.push(metricsSection);
        }
        if(featureFlags.hasInstanceSharing() && !is_shared_instance && instance.is_active()) {
            let access_view = (<InstanceAccessListView key={instance_id+"-access"} instance={instance} />);
            let history_view = (<InstanceHistorySection key={instance_id+"-history"} instance={instance} />);
            let playbook_view = (<InstancePlaybookHistorySection key={instance_id+"-playbook"} instance={instance} />);
            sections.push(<hr key={instance_id+"-hr4"} />);
            sections.push(access_view)
            sections.push(<hr key={instance_id+"-hr5"} />);
            sections.push(history_view)
            sections.push(<hr key={instance_id+"-hr6"} />);
            sections.push(playbook_view)
        }
        return sections;
    },

    render: function() {
        let { params } = this.props;
        let { InstanceStore, InstanceHistoryStore } = this.props.subscriptions;
        let instances = InstanceStore.getAll();
        let instance = instances && instances.get(params.id);
        let history = InstanceHistoryStore.fetchWhere({
            "instance": params.id
        })
        if (!history || !instances) {
            return <div className="loading" />
        }

        // If we got back active instances, but the instance isn't a member
        let instanceDetailsSection;
        if (!instance) {
            instanceDetailsSection = this.renderInactiveInstance(history);
        } else {
            instanceDetailsSection = this.renderActiveInstance(instance);
        }

        return (
            <div className="container">
                {instanceDetailsSection}
            </div>
        );
    },

});

export default subscribe(InstanceDetail, ["ProjectStore", "ImageStore", "InstanceStore", "InstanceHistoryStore"]);
