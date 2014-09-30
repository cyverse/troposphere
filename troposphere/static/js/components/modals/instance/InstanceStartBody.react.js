/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function(){
        return (
          <div>
            <p className='alert alert-warning'>
              <Glyphicon name='warning-sign'/>
              {" "}
              <strong>WARNING</strong>
              {' In order to start a stopped instance, you must have sufficient quota and the cloud must have enough room to support your instance\'s size.'}
            </p>
          </div>
        );
      }
    }

  });
