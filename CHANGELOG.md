# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

<!--
## [<exact release including patch>](<github compare url>) - <release date in YYYY-MM-DD>
### Added
  - <summary of new features>

### Changed
  - <for changes in existing functionality>

### Deprecated
  - <for soon-to-be removed features>

### Removed
  - <for now removed features>

### Fixed
  - <for any bug fixes>

### Security
  - <in case of vulnerabilities>
-->

## [Unreleased](https://github.com/cyverse/troposphere/compare/v36-6...HEAD) - YYYY-MM-DD


## [v36-6](https://github.com/cyverse/troposphere/compare/v36-5...v36-6) - 2020-05-20

### Removed
  - Removed 'User Forums' link on the Help page
    ([#835](https://github.com/cyverse/troposphere/pull/835))
    
## [v36-5](https://github.com/cyverse/troposphere/compare/v36-4...v36-5) - 2020-05-19

### Added
  - Add instance count field in launch wizard to support multi-instance-launch
    ([#832](https://github.com/cyverse/troposphere/pull/832))

## [v36-4](https://github.com/cyverse/troposphere/compare/v36-2...v36-4) - 2019-09-10

### Fixed
  - Patched style issue with XSEDE button
    ([#818](https://github.com/cyverse/troposphere/pull/818))
  - Updated django dependency to secure version
    ([#819](https://github.com/cyverse/troposphere/pull/819))

## [v36-2](https://github.com/cyverse/troposphere/compare/v36-0...v36-2) - 2019-08-06
### Fixed
  - Updated python dependencies to secure versions
    ([#815](https://github.com/cyverse/troposphere/pull/815))

## [v36-0](https://github.com/cyverse/troposphere/compare/v34-0...v36-0) - 2019-06-18
### Added
  - Custom login button for Jetstream when THEME_NAME is "jetstream_theme"
  - Variable "THEME_NAME" added to global variables on front end

### Added
  - Add support for CAS 5
  - Add link to resources wiki on instance stop modal warning copy within jetstream context
  - Alert message to the Resource Request Modal for Jetstream users explaining JTA restrictions
  - Added Dockerfile and related files to enable automated Dockerhub build/test
    ([#800](https://github.com/cyverse/troposphere/pull/800))
  - Run npm install as part of Dockerfile
    ([#811](https://github.com/cyverse/troposphere/pull/811))
  - Add sort options to instance and volume tables in project resources

### Changed
  - Update `psycopg` requirement to version 2.7.3.1
    ([#795](https://github.com/cyverse/troposphere/pull/795))
  - Use feature flag "GUACAMOLE" to alternativly render Guacmole or Legacy remote service links on instance actions not both
    ([#812](https://github.com/cyverse/troposphere/pull/812))
  - Update Dockerfile to use Ubuntu 18.04
    ([#810](https://github.com/cyverse/troposphere/pull/810))
  - Fix typo on shelve instance modal
  - Correct copy on instance stop modal warning message explaining resource consumtion

### Removed
  - Remove unused SERVER_EMAIL variable

### Fixed
  - Fix `python-ldap` dependency's broken version (now using 3.1.0)
    ([#798](https://github.com/cyverse/troposphere/pull/798))
  - ATMO-2143: Image Request not populating base image tags
    ([#808](https://github.com/cyverse/troposphere/pull/808))

## [v34-0](https://github.com/cyverse/troposphere/compare/v33-0...v34-0) - 2018-09-17
### Added
  - Add ability to create, edit, and delete "Personal Access Tokens" from the advanced section on the "settings" view ([#789](https://github.com/cyverse/troposphere/pull/789))

### Changed
  - Fix format script and format codebase ([#782](https://github.com/cyverse/troposphere/pull/782))
    - Travis will also check that the code is formatted from now on

### Removed
  - Remove `UI_VERSION` setting that was unused
    ([#788](https://github.com/cyverse/troposphere/pull/788))
  - Remove all traces of USE_ALLOCATION_SOURCES
    ([#790](https://github.com/cyverse/troposphere/pull/790))

## [v33-0](https://github.com/cyverse/troposphere/compare/v32-0...v33-0) - 2018-08-06
### Changed
  - Suggest adopting a changelog format
    ([#766](https://github.com/cyverse/troposphere/pull/766))
    - This is very similar to what we have now. It's just documented somwhere
      on the web where we can point to as a process to follow
  - Make it easy to create projects (don't require a project description)
    ([#777](https://github.com/cyverse/troposphere/pull/777))
  - During migrate resources, choose a default project, so users don't have to
    mechanically select multiple times (especially helpful for developers)
    ([#776](https://github.com/cyverse/troposphere/pull/776))
  - Allow deleting projects that still contain applications/links
    ([#785](https://github.com/cyverse/troposphere/pull/785))

### Fixed
  - Fix launch modal including providers where an image version is end-dated
    ([#775](https://github.com/cyverse/troposphere/pull/775))
  - Fix a few bugs to enable optimistic updating on the settings page
    ([#783](https://github.com/cyverse/troposphere/pull/783))
    - In the SettingsPage, get the user's preferences directly from the
      attributes instead of `attributes.settings`
    - Fix usage of the ProfileStore's update method by passing it just one
      argument from the action payload and converting it to JSON before
      setting the new preferences
    - Finally, create a clone of the profile object in ProfileActions before
      modifying it to show the newly-selected preferences. This allows the
      program to easily revert the changes by switching back to the clone if
      the Atmosphere API call fails

## [v32-0](https://github.com/cyverse/troposphere/compare/v31-0...v32-0) - 2018-04-06
### Added
  - Add confirmation modal to admin resource request
    ([#750](https://github.com/cyverse/troposphere/pull/750))
    - Solves problem where requests were being 'approved' while the resources
      were not being updated
### Changed
  - Change ./manage.py maintenance to be non-interactive
    ([#769](https://github.com/cyverse/troposphere/pull/769))
  - Improve Delete Instance while Volumes Attached warning message
    ([#809](https://github.com/cyverse/troposphere/pull/809))

### Fixed
  - Admin request panel can view older requests
    ([#751](https://github.com/cyverse/troposphere/pull/751))
    - It used to be constrained to viewing only pending requests, within the
      most recent 1000, now can show any request by id
  - Use the correct endpoint for showing atmosphere-ansible version
    ([#768](https://github.com/cyverse/troposphere/pull/768))

### Security
  - Update to jQuery 3.* to address 2 CVEs
    ([#752](https://github.com/cyverse/troposphere/pull/752))

## [v31-0](https://github.com/cyverse/troposphere/compare/v30...v31-0) - 2018-03-08
### Added
  - Show unshelve action in button bar
  - Include prettier command

### Changed
  - Improve terminology for Deployment Scripts

### Removed
  - Remove support for nginx/uwsgi (its now part of clank)

### Fixed
  - Fix broken enddate field in instance detail (when instance is still
    active)
  - Fix issue where modals become unscrollable

## [v30](https://github.com/cyverse/troposphere/compare/v29...v30) - 2017-12-07
### Added
  - Now community is able to associate a DOI with ImageVersion

### Fixed
  - Fixed bug that prevented a software license from being added to a ImageVersion
  - Fixed rendering issues with ImageVersion Modal

## [v29](https://github.com/cyverse/troposphere/compare/v28...v29) - 2017-11-14
### Added
  - Can select Guacamole SSH color scheme from Settings page

### Deprecated
  - Begin deprecate existing web desktop and shell
    - (the previous technology for "Web Shell" & "Web Desktop" will be
      replaced by Guacamole in 2018)

### Fixed
  - Move non-theme images into troposphere static
  - Fixed failures in /web_desktop cause 500 errors

## [v28](https://github.com/cyverse/troposphere/compare/v27...v28) - 2017-10-03
### Added
  - Image Owner can now [update visibility &
    access](https://github.com/cyverse/troposphere/pull/706) to images
  - Support for Unlimited Allocation Sources
  - [Improved Boot Scripts](https://github.com/cyverse/troposphere/pull/703)
    management and handling
  - Volume creation modal pauses until complete, showning new Volume in
    Project
  - Added Django Manage command to start and stop Maintenance

### Fixed
  - No longer need to [refresh an Instance Detail page to see "Web Desktop"
    link](https://github.com/cyverse/troposphere/pull/716) on Active instance
  - Corrected Maintenance Records to have structure consistent with Atmosphere
  - Fixed so that log out of Troposphere logs a user out of Atmosphere API as
    well

## [v27](https://github.com/cyverse/troposphere/compare/zesty-zapdos...v27) - 2017-09-13
### Added
  - Improved `<SelectMenu />` component
  - Better development support for faster feedback on changes

### Removed
  - Removed unused components

### Fixed
  - Fixed issues where Size label for Instances left out disk information
  - Allowed Instance Launch Modal to remain open until launching complete
  - Avoid allowing "copy" for invalid IP addresses (`0.0.0.0`)
  - Corrected issues with Emulate URL
  - Include latest fix for django-cyverse-auth module
  - Fixed boot scripts not being associated on launch
  - Fixed problems preventing Volumes from being moved between projects
  - Fixed Advanced Options feature in Launch Modal being "clickable"
  - Fixed issue with instances row hyperlinks

## [Zesty-Zapdos](https://github.com/cyverse/troposphere/compare/yampy-yellowlegs...zesty-zapdos) - 2017-08-03
### Added
  - Apache Guacamole integration as a "beta" remote access option
  - Provide sourceMaps for deployed application bundles (improved error triage)
  - Upgrade to Webpack v2
  - Upgrade to Django 1.11
  - Improve code quality via ESLint rule defintion
  - (Admin) Offer "emulate" link from "Manage Users" tab

### Fixed
  - Instance Disk size validated on the client-side, when launching
  - Made number of uWSGI processes configuration (web request/response performance tuning)
  - Update resource requests (allocation & quota)
  - Correct JSX attribute typos for CSS
  - Ensure Travis CI catches any missing data migrations
  - Fix issue with Gravatar icons differing between Instance History & Project views
  - Remove duplicate `<SelectMenu/>` definitions; resolve component usage
  - (Admind) improve image request error reporting

## [Yampy-Yellowlegs](https://github.com/cyverse/troposphere/compare/xylotomous-xylotomous...yampy-yellowlegs) - 2017-06-05
### Added
  - Improved the reuse of `<NotFoundPage />` component
  - (Admin) Made request status for Image Requests collapsible
  - (Admin) Added setting flag for how resources can be "reported"

### Fixed
  - Corrected issue where Instances within Project View appear to be "stuck"
    in Build
  - Made inclusion of Google Analytics optional (based on Community Feedback)
  - "not found" (404) messaging shown for Image Details Pages unavailable to
    community member
  - Corrected rendering of Project Resources for medium screen sizes
  - Adjusted Web Desktop signature generation
     - Fixes issues with Network Address Translation origins related to Client
       IP.
  - Added newline rendering to Maintenance Messages
  - Corrected cloud provider selection for "Request More Resources" modal
  - (Admin) Corrected Image Request statuses not updating

## [Xylotomous-Xenops](https://github.com/cyverse/troposphere/compare/whimsical-wyvern...xylotomous-xylotomous) - 2017-04-25
### Added
  - Integrated in-app, live chat to answer question & help resolve issues
  - All actions available on an instance are now driven by the API
  - Within capable cloud providers, instances can be shelved & unshelved
  - Improved readability of error notifications received
  - Started including new user interface elements (part of mini-release effort, forthcoming)

### Fixed
  - Corrected the "actions" shown for instance in "Active - Networking"
  - Corrected issue with adding tags to Images
  - Corrected problem where "Web Desktop" link shown for suspended instances

## [Whimsical-Wyvern](https://github.com/cyverse/troposphere/compare/voracious-velociraptor...whimsical-wyvern) - 2017-03-21
### Added
  - Provided a framework that allows support for custom messages within
    Troposphere UI
  - Staff users will now see basic image metrics in the image catalog
  - Provide support for Resource Requests using both 'varieties' of allocation
    and quota
  - Sentry.io is now configurable via Clank

## [Voracious-Velociraptor](https://github.com/cyverse/troposphere/compare/undulating-umbrellabird...voracious-velociraptor) - 2017-02-14
### Added
  - Provided a framework that allows support for custom messages within
    Troposphere UI
  - Provide support for Resource Requests using both 'varieties' of allocation
    and quota

### Fixed
  - Image Details now clearly show end-dated indication
  - end-dated images will no longer show in the Instance Launch modal
  - Small changes to make Troposphere more mobile-friendly

## [Undulating-Umbrellabird](https://github.com/cyverse/troposphere/compare/toco-toucan...undulating-umbrellabird) - 2017-02-02
### Added
  - Export credentials for use with OpenStack client tools
  - Provide explicit indicator is system password has expired
  - Utilize the clipboard API for copying credentials
  - Utilize the clipboard API for copying UUIDs for Image Versions

### Fixed
  - Add Image Version UUIDs back to Image detail view
  - Fix display "overflow" issues with tags
  - Fix display "overflow" issue with SSH keys
  - Ensure all instances have a valid, default name
  - Fix issue creating image bookmarks
  - Fix issue displaying images by tag
