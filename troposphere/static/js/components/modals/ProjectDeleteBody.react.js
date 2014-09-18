/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return {
      build: function(project){
        return (
          <p>
            {"Are you sure you want to delete the project "}
            <strong>{project.get('name')}</strong>
            {"?"}
          </p>
        );
      }
    }

  });
