define(
  [
    'underscore',
    'collections/UserCollection',
    'dispatchers/Dispatcher',
    'stores/Store',
    'constants/UserConstants'
  ],
  function (_, UserCollection, Dispatcher, Store, UserConstants) {

    var _users = null;
    var _isFetching = false;
    var _isFetchingMore = false;
    var _pendingVersionUsers = {};

    //
    // CRUD Operations
    //
    var fetchUsers = function () {
      if(!_isFetching) {
        _isFetching = true;
        var instances = new UserCollection();
        instances.fetch({
          url: instances.url + "?page=1&page_size=1000"
        }).done(function () {
          _isFetching = false;
          _users = instances;
          fetchMoreUsers();

        });
      }
    };

    var fetchMoreUsers = function () {
      var nextUrl = _users.meta.next;
      if(nextUrl && !_isFetchingMore){
        console.log("Fetching Page ",nextUrl);

        _isFetchingMore = true;
        var moreUsers = new UserCollection();
        moreUsers.fetch({url: nextUrl}).done(function () {
          _isFetchingMore = false;
          _users.add(moreUsers.models);
          _users.meta = moreUsers.meta;
          fetchMoreUsers();
        });
      }
      //Finished!
      UserStore.emitChange();

    };

    var fetchUserByUsername = function (username) {
      if(!_isFetching) {
        _isFetching = true;
        var users = new UserCollection();
        users.fetch({
          url: users.url + "?username=username"
        }).done(function () {
          _isFetching = false;
            //Do something
            //UserStore.emitChange();
        });
      }
    };

    function add(user, options){
      _users.add(user);
    }

    function update(user, options){
      var existingModel = _users.get(user);
      if(!existingModel) throw new Error("User doesn't exist.");
      _users.add(user, {merge: true});
    }

    function remove(user, options){
      _users.remove(user);
    }

    function addPendingUserToVersion(user, version){
      _pendingVersionUsers[version.id] = _pendingVersionUsers[version.id] || new UserCollection();
      _pendingVersionUsers[version.id].add(user);
    }

    function removePendingUserFromVersion(user, version){
      _pendingVersionUsers[version.id].remove(user);
    }

    //
    // Store
    //

    var UserStore = {

      get: function (modelId) {
        if(!_users) {
          fetchUsers();
        } else {
          return _users.get(modelId);
        }
      },

      exists: function (modelId) {
        if(!_users) {
          fetchUsers();
        } else {
          return _users.get(modelId) != null;
        }
      },

      getAll: function () {
        if(!_users) {
          fetchUsers();
        } else {
          return _users;
        }
      },
       getUsersForVersion: function(version) {
        if(!_users) throw new Error("Must fetch users before calling getUsersFromList");


        var versionUserArray = version.membership.map(function(user){

          return {"username":user};
        });

        // Add any pending users to the result set
        var pendingVersionUsers = _pendingVersionUsers[version.id];
        if(pendingVersionUsers){
          versionUserArray = versionUserArray.concat(pendingVersionUsers.models);
        }

        return new UserCollection(versionUserArray);
      },
      getUsersFromList: function (username_list) {
          if(!_users) throw new Error("Must fetch users before calling getUsersFromList");


        var UserArray = username_list.map(function(username){
            var user = _users.findWhere({username: username});
            return user;
        });
        return new UserCollection(UserArray);
      },

    };

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {
        case UserConstants.ADD_USER:
          add(payload.user);
          break;

        case UserConstants.UPDATE_USER:
          update(payload.user);
          break;

        case UserConstants.REMOVE_USER:
          remove(payload.user);
          break;

        case UserConstants.ADD_PENDING_USER_TO_VERSION:
          addPendingUserToVersion(payload.user, payload.version);
          break;

        case UserConstants.REMOVE_PENDING_USER_FROM_VERSION:
          removePendingUserFromVersion(payload.user, payload.version);
          break;

        case UserConstants.ADD_PENDING_USER_TO_VERSION:
          addPendingUserToVersion(payload.user, payload.version);
          break;

        case UserConstants.REMOVE_PENDING_USER_FROM_VERSION:
          removePendingUserFromVersion(payload.user, payload.version);
          break;

         default:
           return true;
      }

      if(!options.silent) {
        UserStore.emitChange();
      }

      return true;
    });

    _.extend(UserStore, Store);

    return UserStore;
  });
