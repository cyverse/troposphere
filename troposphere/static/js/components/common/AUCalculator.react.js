define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores'
  ],
  function (React, BootstrapModalMixin, stores) {

    return React.createClass({

      getInitialState: function () {
        return {
          identity: this.props.identity,
          selectedCPU: null
        };
      },

      componentDidMount: function () {
        /* Calculate AU calculator options list one time as soon as the component initially renders
        to avoid having to constantly calculate the same list every time a render occurs. */

        // Get instances user has and add create option elements for each of them.
        var instanceOptions = stores.InstanceStore.getAll().map(function(instance){
          return (
            <option key={instance.id} value={instance.get('size').cpu}>{instance.get('name')}({instance.get('size').cpu} CPU)</option>
          );
        });

        // An array of CPU sizes to map to option values in the list
        var sizes = [1, 2, 4, 8, 16];

        // Actually map the CPU values to options
        var defaultOptions = sizes.map(function(size){
          return (
            <option key={size} value={size}>a {size} CPU instance</option>
          );
        });

        // Combine the instance size list and defualt size list into one to display
        var options = instanceOptions.concat(defaultOptions),
            // It's possible that the user has no instances when using this calculator, so default to the 1 CPU option
            cpuToSet = instanceOptions.length > 0 ? stores.InstanceStore.getAll().models[0].get('size').cpu : 1;

        this.setState({options: options, selectedCPU: cpuToSet});
      },

      handleCPUChange: function(e){
        this.setState({selectedCPU: Number(e.target.value)});
      },

      render: function(){
        var instances = stores.InstanceStore.getAll();

        if (!instances) return <div className="loading"/>;

        var remainingAU = stores.IdentityStore.get(this.props.identity).get('usage').remaining;

        var options = this.state.options;

        if(!this.state.options){
          return <div className="loading" />
        }
        var selectedCPU = this.state.selectedCPU ? this.state.selectedCPU: options[0];

        return (
          <div>
            <div className='form-group'>
              <a role="button" data-toggle="collapse" href="#au-calculator" aria-expanded="true">
                AU Calculator
              </a>
            </div>
            <div id="au-calculator" className="collapse">
                <strong>You have {remainingAU} AU remaining this month.</strong>
                <div>
                Calculate AU needed to run
                <select value={this.state.selectedCPU} className='form-control' onChange={this.handleCPUChange}>
                  {options}
                </select>
                for...
              </div>

              <table className="table">
                <tbody>
                  <th>
                    Duration
                  </th>
                  <th>
                    AU needed
                  </th>
                  <tr className={remainingAU >= this.state.selectedCPU * 24 * 1 ? "success" : "warning"}><td>1 day</td><td>{(this.state.selectedCPU * 24 * 1)}</td></tr>
                  <tr className={remainingAU >= this.state.selectedCPU * 24 * 3 ? "success" : "warning"}><td>3 days</td><td>{(this.state.selectedCPU * 24 * 3)}</td></tr>
                  <tr className={remainingAU >= this.state.selectedCPU * 24 * 7 ? "success" : "warning"}><td>1 week</td><td>{(this.state.selectedCPU * 24 * 7)}</td></tr>
                  <tr className={remainingAU >= this.state.selectedCPU * 24 * 14 ? "success" : "warning"}><td>2 weeks</td><td>{(this.state.selectedCPU * 24 * 14)}</td></tr>
                </tbody>
              </table>
             <strong>Note: We can not approve requests greater than 2,304 AU.</strong>
            </div>
          </div>
        );
      },

    });

  });
