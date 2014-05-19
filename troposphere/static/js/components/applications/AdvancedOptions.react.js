define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        var display = this.props.visible ? "block" : "none";
        var styles = {display: display};
        return (
          <div style={styles} className='well advanced-search-options'>
            Advanced stuff, here, man
          </div>
        );
      }

    });

  });
