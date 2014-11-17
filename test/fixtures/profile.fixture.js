define(
  [
    'models/Profile'
  ], function(Profile) {

    return new Profile({
      id: 1,
      user: 1,
      username: "username",
      email: "username@example.com",
      is_staff: false,
      is_superuser: false,
      groups: [
        "username"
      ],
      send_emails: true,
      icon_set: "default",
      selected_identity: {
        quota: {
          mem: 256,
          suspended_count: 2,
          storage: 1000,
          cpu: 128,
          storage_count: 10
        },
        provider_id: 1,
        provider: "planet tatooine"
      }
    }, {parse: true})

});
