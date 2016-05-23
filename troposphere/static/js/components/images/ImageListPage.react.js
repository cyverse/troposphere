import React from 'react/addons';
import stores from 'stores';
import ImageListView from './list/ImageListView.react';

export default React.createClass({
    displayName: "ImageListPage",

    render: function () {
      var tags = stores.TagStore.getAll(),
        helpLinks = stores.HelpLinkStore.getAll();

      if (!tags || !helpLinks){
        return <div className="loading"></div>;
      }

      return (
        <ImageListView tags={tags}/>
      );
    }
});
