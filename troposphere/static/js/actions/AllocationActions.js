import AllocationConstants from 'constants/AllocationConstants';
import Allocation from 'models/Allocation';
import Utils from './Utils';

export default {

    create: function(params){

      var allocation = new Allocation({
        threshold: parseInt(params.threshold),
        delta: parseInt(params.delta)
      });

      allocation.save().done(function(){
        Utils.dispatch(AllocationConstants.CREATE_ALLOCATION, {allocation: allocation}, {silent: false});
      }).fail(function(response){
        console.log(response);
      });
    }

  };
