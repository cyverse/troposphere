/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'collections/ApplicationCollection',
    './list/ApplicationCardList.react',
    './list/SearchContainer.react',
    'stores/ApplicationStore',
    'stores/TagStore'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore, TagStore) {

    function getState() {
      return {
        applications: ApplicationStore.getAll(),
        tags: TagStore.getAll()
      };
    }

    return React.createClass({

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
        TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
      },

      renderTag: function(tag){
        return (
          <li className="tag-item" key={tag.id}>
            <h4>{tag.get('name')}</h4>
            <p>{tag.get('description')}</p>
          </li>
        )
      },

      renderTags: function(){
        var tags = this.state.tags;
        if(tags){
          return (
            <ul className="tag-list">
              {tags.map(this.renderTag)}
            </ul>
          )
        }

        return (
          <div className="loading"></div>
        )
      },

      renderTagRow: function(tag){
        return (
          <tr>
            <td style={{"verticalAlign":"top","width":"117px"}}>
              <h4 style={{"margin":"0", "color":"#5A5A5A", "fontSize":"18px"}}>
                {tag.get('name')}
              </h4>
            </td>
            <td>
              <p style={{"fontSize":"14px"}}>
                {tag.get('description')}
              </p>
            </td>
          </tr>
        )
      },

      renderTagsAsTable: function(){
        var tags = this.state.tags;
        if(tags) {
          return (
            <table className="table">
              <tbody>
                {tags.map(this.renderTagRow)}
              </tbody>
            </table>
          )
        }

        return (
          <div className="loading"></div>
        )
      },

      render: function () {
        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="tags"/>
            <div className="container">
              <div className="image-tag-list">
                {false ? this.renderTags() : this.renderTagsAsTable()}
              </div>
            </div>
          </div>
        );

      }

    });

  });
