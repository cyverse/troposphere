import React from 'react';
import stores from 'stores';

import SelectMenu from 'components/common/ui/SelectMenu2.react';


export default React.createClass({
    displayName: "Provider",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      providerId: React.PropTypes.number.isRequired
    },

    render: function () {
      var providerId = this.props.providerId,
        providers = stores.ProviderStore.getAll();

      if (!providers) return <div className="loading"/>;

      let publicProviders = providers.cfilter(p => p.get('public'));
      let defaultProvider = publicProviders.get(providerId);

      return (
        <div className="form-group">
          <label htmlFor="provider" className="control-label">Cloud for Deployment</label>
          <div className="help-block">
            {
              "Please select the provider you would like this image to be available on. If you would " +
              "like the image to be available on multiple clouds please contact support through the Feedback " +
              "button in footer and we will be help you out."
            }
          </div>
          <SelectMenu
            current={ defaultProvider }
            list={ publicProviders }
            optionName={ p => p.get('name') }
            onSelect={ this.props.onChange } />
        </div>
      );
    }
});
