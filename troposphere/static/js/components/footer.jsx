define(
  [
    'react'
  ],
  function (React) {
    var Footer = React.createClass({
      render: function () {
        var year = new Date().getFullYear();
        return (
          <footer>
            <a href="http://user.iplantcollaborative.org" target="_blank">
                  {"\u00a9" + year + " iPlant Collaborative"}
            </a>
          </footer>
        );
      }
    });
    return Footer;
  });
