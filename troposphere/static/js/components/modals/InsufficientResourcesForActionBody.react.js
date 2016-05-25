import React from 'react';
import Glyphicon from 'components/common/Glyphicon.react';

export default {
    build: function () {
        return (
          <div>
            <p className='alert alert-error'>
              <Glyphicon name='ban-circle'/>
              {" "}
              <strong>Cannot resume instance</strong>
              {
                " You do not have enough resources to resume this instance. You must terminate, suspend, " +
                "or stop another running instance, or request more resources."
              }
            </p>
          </div>
        );
    }
}
