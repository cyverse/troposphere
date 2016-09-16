import React from 'react';
import Router from 'react-router';

import { ProjectInstanceStore, ProjectImageStore, ProjectVolumeStore } from 'stores';
import { Section, Tabs, InstanceCard, MediaCardGroup } from 'cyverse-ui';
import { ConsoleIcon, ReplayIcon, PauseIcon } from 'cyverse-ui/icons';

import Wrapper from 'components/common/ui/Wrapper';
import InstanceList from './InstanceList';
import VolumeList from './VolumeList';
import ImageList from 'components/images/list/list/ImageCardList';

export default React.createClass({
    displayName: "ProjectResourcesPage",
    mixins: [Router.State],

    getInitialState() {
      return {
          currentListView: 0,
      }
    },

    componentDidMount() {
        ProjectInstanceStore.addChangeListener(this.updateState);
        ProjectImageStore.addChangeListener(this.updateState);
        ProjectVolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        ProjectInstanceStore.removeChangeListener();
        ProjectImageStore.removeChangeListener();
        ProjectVolumeStore.removeChangeListener();
    },
    
    updateState() {
        if (this.isMounted()) this.forceUpdate();
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
        let instances = ProjectInstanceStore
            .getInstancesFor(this.props.project) || null;

        if (!instances) return;

        return (
            <InstanceList instances = { instances }/>
        )
    },  

    renderVolumes() {
        let volumes = ProjectVolumeStore
            .getVolumesFor(this.props.project) || null;

        if (!volumes ) return;

        return (
            <VolumeList volumes = { volumes }/>
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
        let images = ProjectImageStore
            .getImagesFor(this.props.project);

        if (!images) return;
        return (
            <ImageList images={ images }/>
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
