import React from 'react';
import Backbone from 'backbone';
import TagsView from './tags/TagsView.react';
import NameView from './name/NameView.react';
import CreatedView from './created/CreatedView.react';
import RemovedView from './removed/RemovedView.react';
import AuthorView from './author/AuthorView.react';
import DescriptionView from './description/DescriptionView.react';
import stores from 'stores';

export default React.createClass({
      displayName: "ViewImageDetails",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection),
        identities: React.PropTypes.instanceOf(Backbone.Collection),
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onEditImageDetails: React.PropTypes.func.isRequired
      },

      renderEditLink: function(){
        var profile = stores.ProfileStore.get(),
            image = this.props.image;

        if(profile.id && profile.get('username') === image.get('created_by').username || profile.get('is_staff')){
          return (
            <div className="edit-link-row clearfix">
              <a className="pull-right" onClick={this.props.onEditImageDetails}>
                <span className="glyphicon glyphicon-pencil"></span> Edit details</a>
            </div>
          )
        }
      },

      render: function () {
        let tagsView = (
            <TagsView image={this.props.image}
                      tags={this.props.tags}
            />
        );

        return (
          <div>
            <div>
              <NameView image={this.props.image}/>
              <CreatedView image={this.props.image}/>
              <RemovedView image={this.props.image}/>
              <AuthorView image={this.props.image}/>
              <DescriptionView image={this.props.image}/>
              {tagsView}
            </div>
            {this.renderEditLink()}
          </div>
        );
      }
});
