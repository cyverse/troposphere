define(
  [
    'react'
  ],
  function(React) {

    return React.createClass({
        render: function() {
            return (
              <li>
                <a href="#">
                  <img src={this.props.image}/>
                  <strong>{this.props.title}</strong>
                  <p>{this.props.description}</p>
                </a>
              </li>
            );
        }
    });

});
