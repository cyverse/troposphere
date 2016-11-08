import React from 'react';
import { Section, Tabs, InstanceCard, MediaCardGroup } from 'cyverse-ui';
import { ConsoleIcon, ReplayIcon, PauseIcon } from 'cyverse-ui/icons';

export default React.createClass({
    
    renderCard(instance) {
        let summary = [
            {
                label: "Status",
                value: instance.get('status'),
            },
            {
                label: "IP",
                value: instance.get('ip_address')
            },
            {
                label: "Size",
                value: instance.get('size').name
            },
            {
                label: "Provider",
                value: instance.get('provider').name
            },
        ];

        let detail = [
            ...summary,
            {
                label: "Alias",
                value: instance.get('uuid'),
            }
        ];

        return (
                <InstanceCard
                    key = { `${instance.get('uuid')}-card` }
                    title = { instance.get('name') }
                    primaryColor = { THEME.color.primary }
                    launched = "Sep 2, 2016 (a day ago)"
                    summaryInfo = { summary }
                    detailInfo = { detail }
                    percent = { 100 }
                    successColor = { THEME.color.success }
                    onChangeTitle = { value => { console.log(value) } }
                    contextualMenu = {[
                        {render: "red"}
                    ]}
                    quickLinks = {[
                        <ConsoleIcon
                            key = "link1"
                            onClick = { this.onConsoleClick }
                            size = { 20 }
                            mr = { 3 }
                        />,
                        <ReplayIcon
                            key = "link2"
                            onClick = { this.onConsoleClick }
                            size = { 20 }
                            mr = { 3 }
                        />,
                        <PauseIcon
                            key = "link3"
                            onClick = { this.onConsoleClick }
                            size = { 20 }
                        />,
                    ]}
                />   
        )
    },
        render() {
            return (
                <MediaCardGroup>
                    { this.props.instances.map(this.renderCard) }
                </MediaCardGroup>
            )
        },
});
