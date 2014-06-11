/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function (instance) {
        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong>WARNING</strong>
              {
                ' Unmount volumes within your instance ' +
                'before terminating or risk corrupting your data and the volume'
              }
            </p>
            <p>
              {'Your instance '}
              <strong>{instance.get('name') + ' #' + instance.get('id')}</strong>
              {' will be shut down and all data will be permanently lost!'}
            </p>
            <p>
              <em>Note:</em>
              {
                ' Your resource usage charts will not reflect changes until the ' +
                'instance is completely terminated and has disappeared ' +
                'from your list of instances.'
              }
            </p>
          </div>
        );
      }
    }

  });
