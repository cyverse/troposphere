/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        /*
          Summary of resources in use (sorted by provider/identity?) incl. Instances, Volumes,
          and a simplified quota representation (?). I imagine they'll be able to click on these
          to see details for cloud resources or click on the provider or the quota to see that provider.
         */

        var style = {
          "margin-left": "40px"
        };

        return (
          <div className='resouce-summary'>
            <h2>Resource Summary</h2>

            <div className="" style={style}>
              <h3>iPlant Cloud - Tucson</h3>
              <table className="table table-condensed">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>Instances</th>
                    <th>Volumes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>4</td>
                    <td>2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="" style={style}>
              <h3>iPlant Workshop - Tucson</h3>
              <table className="table table-condensed">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>Instances</th>
                    <th>Volumes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        );
      }

    });

  });
