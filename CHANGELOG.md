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

## [Unreleased](https://github.com/cyverse/troposphere/compare/v31...HEAD)

### Added
  - Add confirmation modal to admin resource request (#750)
    - Solves problem where requests were being 'approved' while the resources were not being updated

### Changed
  - Suggest adopting a changelog format
    - This is very similar to what we have now. It's just documented somwhere on the web where we can point to as a process to follow

### Fixed
  - Admin request panel can view older requests (#751)
    - It used to be constrained to viewing only pending requests, within the most recent 1000, now can show any request by id

### Security
  - Update to jQuery 3.* to address 2 CVEs (#752)

## [v31](https://github.com/cyverse/troposphere/compare/v30...v31) - 2018-03-06

### Added
  - Show unshelve action in button bar
  - Include prettier command

### Changed
  - Improve terminology for Deployment Scripts

### Removed
  - Remove support for nginx/uwsgi (its now part of clank)

### Fixed
  - Fix broken enddate field in instance detail (when instance is still active)
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
    - (the previous technology for "Web Shell" & "Web Desktop" will be replaced by Guacamole in 2018)

### Fixed
  - Move non-theme images into troposphere static
  - Fixed failures in /web_desktop cause 500 errors

## [v28](https://github.com/cyverse/troposphere/compare/v27...v28) - 2017-10-03
### Added
  - Image Owner can now [update visibility & access](https://github.com/cyverse/troposphere/pull/706) to images
  - Support for Unlimited Allocation Sources
  - [Improved Boot Scripts](https://github.com/cyverse/troposphere/pull/703) management and handling
  - Volume creation modal pauses until complete, showning new Volume in Project
  - Added Django Manage command to start and stop Maintenance

### Fixed
  - No longer need to [refresh an Instance Detail page to see "Web Desktop" link](https://github.com/cyverse/troposphere/pull/716) on Active instance
  - Corrected Maintenance Records to have structure consistent with Atmosphere
  - Fixed so that log out of Troposphere logs a user out of Atmosphere API as well

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
  - Corrected issue where Instances within Project View appear to be "stuck" in Build
  - Made inclusion of Google Analytics optional (based on Community Feedback)
  - "not found" (404) messaging shown for Image Details Pages unavailable to community member
  - Corrected rendering of Project Resources for medium screen sizes
  - Adjusted Web Desktop signature generation
     - Fixes issues with Network Address Translation origins related to Client IP.
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
  - Provided a framework that allows support for custom messages within Troposphere UI
  - Staff users will now see basic image metrics in the image catalog
  - Provide support for Resource Requests using both 'varieties' of allocation and quota
  - Sentry.io is now configurable via Clank

## [Voracious-Velociraptor](https://github.com/cyverse/troposphere/compare/undulating-umbrellabird...voracious-velociraptor) - 2017-02-14
### Added
  - Provided a framework that allows support for custom messages within Troposphere UI
  - Provide support for Resource Requests using both 'varieties' of allocation and quota

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
