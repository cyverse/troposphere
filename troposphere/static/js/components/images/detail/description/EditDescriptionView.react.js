import React from 'react';
import Backbone from 'backbone';
import Showdown from 'showdown';

export default React.createClass({
      displayName: "EditDescriptionView",

      getDefaultProps: function() {
        return {
          title: "Description",
          className: "image-description"
        }
      },
      propTypes: {
        title: React.PropTypes.string,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        titleClassName:React.PropTypes.string,
        formClassName:React.PropTypes.string
      },
      render: function () {
        return (
          <div className={this.props.className}>
            <h4 className={this.props.titleClassName}>{this.props.title}</h4>
            <div className={this.props.formClassName}>
              <textarea className="form-control" rows="7" value={this.props.value} onChange={this.props.onChange}/>
            </div>
          </div>
        );
      }
});
