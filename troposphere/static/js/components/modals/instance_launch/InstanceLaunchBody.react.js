/** @jsx React.DOM */

define(
  [
    'react',
    './MachineSelect.react',
    './IdentitySelect.react',
    './InstanceSizeSelect.react',
    'underscore'
  ],
  function (React, MachineSelect, IdentitySelect, InstanceSizeSelect, _) {

    return {
      build: function (application, identities, providers) {

        var emptyFunction = function(){};

        this.props = {
          application: application,
          identities: identities,
          providers: providers,
          sizes: null
        };

        this.state = {
          machineId: null,
          identityId: this.props.identities.first().id,
          sizeId: null
        };

        // provider id, identity id, machine_alias, name, size_alias, tags
        return (
          <form role='form'>

            <div className='form-group'>
              <label htmlFor='instance-name'>Instance Name</label>
              <input type='text' className='form-control' id='instance-name' onChange={emptyFunction}/>
            </div>

            <div className='form-group'>
              <label htmlFor='machine'>Version</label>
              <MachineSelect machineId={this.state.machineId}
                             machines={this.props.application.get('machines')}
                             onChange={emptyFunction}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='identity'>Identity</label>
              <IdentitySelect
                  onChange={emptyFunction}
                  identityId={this.state.identityId}
                  identities={this.props.identities}
                  providers={this.props.providers}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='size'>Instance Size</label>
              <InstanceSizeSelect
                  sizes={this.state.sizes}
                  sizeId={this.state.sizeId}
                  onChange={emptyFunction}
              />
            </div>

          </form>
        );
      }

    };

  });
