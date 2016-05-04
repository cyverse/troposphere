import QuotaConstants from 'constants/QuotaConstants';
import Quota from 'models/Quota';
import Utils from './Utils';
import stores from 'stores';

var QuotaActions = {
    create: function(params){

      var quota = new Quota(params);

      quota.save().done(function(){
        Utils.dispatch(QuotaConstants.CREATE_QUOTA, {quota: quota}, {silent: false});
      }).fail(function(response){
      });
    }
};

export default QuotaActions;
