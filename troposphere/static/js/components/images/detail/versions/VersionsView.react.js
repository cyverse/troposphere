import React from 'react';
import Backbone from 'backbone';
import context from 'context';
import stores from 'stores';
import VersionList from './VersionList.react';


export default React.createClass({
    displayName: "VersionsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    render: function () {
        var image = this.props.image,
            versions = stores.ImageStore.getVersions(image.id),
            showAvailableOn = !!(context.profile && context.profile.get('selected_identity'));

        if(!versions) {
            return (<div className="loading" />);
        }
        return (
            <div className="image-versions image-info-segment row">
                <h4 className="t-title col-md-2">Versions:</h4>
                <VersionList image={image}
                versions={versions}
                editable={true}
                showAvailability={showAvailableOn} />
            </div>
        );
    }
});
