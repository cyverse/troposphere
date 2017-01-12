import React from 'react';
import stores from 'stores';
import Router from 'react-router';

import { Section, Tabs, InstanceCard, MediaCardGroup } from 'cyverse-ui';
import { ConsoleIcon, ReplayIcon, PauseIcon } from 'cyverse-ui/icons';

import Wrapper from 'components/common/ui/Wrapper.react';
import InstanceList from './InstanceList.react';

export default React.createClass({
    displayName: "ProjectResourcesPage",
    mixins: [Router.State],

    getInitialState() {
      return {
          currentListView: 0,
      }
    },

    componentDidMount() {
        stores
            .ProjectInstanceStore
            .addChangeListener(this.updateState);
    },
    
    updateState() {
        this.updateState({});
    },

    onTabClick(e) {
        this.setState({
            currentListView: e
        });
    },
                                         
    renderList() {
        switch (this.state.currentListView) {
            case 0: return this.renderInstances();
            case 1: return this.renderVolumes();
            case 2: return this.renderLinks();
            case 3: return this.renderImages();
        }
    },

    renderInstances() {
        let instances = stores
            .ProjectInstanceStore
            .getInstancesFor(this.props.project) || null;

        if (!instances) return

        return (
            <InstanceList 
                instances = { instances } 
            />
        )
    },  

    renderVolumes() {
        return (
            <div>
                Volumes!
            </div>
        )
    },

    renderLinks() {
        return (
            <div>
                Links!
            </div>
        )
    },

    renderImages() {
        return (
            <div>
                Imagess!
            </div>
        )
    },

    render() {

        return (
            <Section>
                <Wrapper>
                    <Tabs 
                        tabList={[
                            "Instances", 
                            "Volumes", 
                            "Links",
                            "Images",
                        ]}
                        current = { this.state.currentListView }
                        color = { THEME.color.primary }
                        onTabClick = { this.onTabClick }
                    />
                    { this.renderList() }
                </Wrapper>
            </Section>  
        );
    }

});
