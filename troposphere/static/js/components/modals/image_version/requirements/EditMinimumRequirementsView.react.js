import React from 'react';

export default React.createClass({

  propTypes: {
    minCPU: React.PropTypes.number,
    minMem: React.PropTypes.number,
    onCPUChange: React.PropTypes.func.isRequired,
    onMemChange: React.PropTypes.func.isRequired,
    cpuMinVal: React.PropTypes.number.isRequired,
    cpuMaxVal: React.PropTypes.number.isRequired,
    memMinVal: React.PropTypes.number.isRequired,
    memMaxVal: React.PropTypes.number.isRequired
  },

  render: function () {
    var cpuWarning, memWarning;

    if(!this.props.checkValidCPU()){
      cpuWarning = (<p className="text-danger">CPU must be between {this.props.cpuMinVal} and {this.props.cpuMaxVal} </p>);
    }
    if(!this.props.checkValidMem()){
      memWarning = (<p className="text-danger">Memory must be between {this.props.memMinVal} and {this.props.memMaxVal} GB</p>);
    }

    return (
      <div>
        <h4>Minimum Requirements</h4>
        <div>
          <div className="help-block">Minimum # of CPU cores: </div><input className="form-control" type="text" value={this.props.cpu} onChange={this.props.onCPUChange} />{cpuWarning}<br />
        </div>
        <div>
          <div className="help-block">Minimum amount of memory (GB): </div><input className="form-control" type="text" value={this.props.mem} onChange={this.props.onMemChange} />{memWarning}
        </div>
      </div>
      );
  }

});
