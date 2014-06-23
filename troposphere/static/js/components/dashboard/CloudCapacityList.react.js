/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        /*
         Display of Cloud capacity. Especially making it clear ~ "this one is
         almost full, launching larger instance sizes may not be possible."
         */

        var style = {
          "margin-left": "40px"
        };

        return (
          <div className="">
            <h2>Cloud Capacity</h2>

            <div className="" style={style}>
              <h3>iPlant Cloud - Tucson</h3>
              <table className="table table-condensed">
                <thead>
                  <tr>
                    <th>tiny1</th>
                    <th>tiny2</th>
                    <th>small1</th>
                    <th>small2</th>
                    <th>medium1</th>
                    <th>medium2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                  </tr>
                  <tr>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                    <td className="bg-danger">1</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        );
      }

    });

  });
