/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        /*
          Notifications from support (whether that functionality now exists
          on the backend, I don't know -- if not, just a designate space where
          someone can write "Upcoming maintenance, Thursday, June 19, you should image.")
         */
        return (
          <div className="">
            <h2>Notifications</h2>
            <p className="alert alert-danger">
              {
                "Atmosphere capacity has been very low. Capacity becomes available as vms " +
                "are suspended or terminated. We recommend that if you receive an 'Error' during " +
                "an instance launch, please try launching an instance at a later time. We are working " +
                "to improve both the messaging and increasing the number of resources. We apologize for " +
                "the inconvenience. If you have any suggestions or feedback, please contact " +
                "support@iplantcollaborative.org."
              }
            </p>
          </div>
        );
      }

    });

  });
