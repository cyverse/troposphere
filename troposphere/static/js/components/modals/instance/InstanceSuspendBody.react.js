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
              {" Suspending an instance will freeze its state, and the IP address may change when you resume the instance."}
            </p>
            <p>
              {'Suspending an instance frees up resources for other users and allows you to safely preserve the state of your instance without imaging. '}
              {'Your time allocation no longer counts against you in the suspended mode.'}
            </p>
            <p>
              {'Your resource usage charts will only reflect the freed resources once the instance\'s state is "suspended."'}
            </p>
          </div>
        );
      }
    }

  });
