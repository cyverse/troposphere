define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
        ProviderCollection = require('collections/ProviderCollection');

    return React.createClass({

        propTypes: {
            application: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

        renderProvider: function (provider) {
            return (
                <li key={provider.id}>
          {provider.get('name')}
                </li>
            )
        },
        render: function () {
            var image = this.props.application,
            providers = this.getProvidersForImage(image);

            if (!providers) {
                return <div className="loading" />
            }

            return (
                <div className='image-availability image-info-segment row'>
                    <h4 className="title col-md-2">Available on</h4>
                    <div className="content col-md-10">
                        <ul className="list-unstyled">
                          {providers.map(this.renderProvider)}
                        </ul>
                    </div>
                </div>
            );
        },
        getProvidersForImage: function(image) {
            return image.getProviders();
        }

    });

});
