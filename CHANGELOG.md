## [Carbonaceous Comet (v29)](https://github.com/cyverse/troposphere/milestone/18?closed=1) (as of 11/14/2017)

Enhancements:
  -  Can select Guacamole SSH color scheme from Settings page
  - Begin deprecate existing web desktop and shell
    - (the previous technology for "Web Shell" & "Web Desktop" will be replaced by Guacamole in 2018)

Bugfixes:
  - Move non-theme images into troposphere static 
  - Fixed failures in /web_desktop cause 500 errors 

## [Beneficent-Bolide (v28)](https://github.com/cyverse/troposphere/milestone/17?closed=1) (as of 10/03/2017)

Bugfixes:
  - No longer need to [refresh an Instance Detail page to see "Web Desktop" link](https://github.com/cyverse/troposphere/pull/716) on Active instance
  - Corrected Maintenance Records to have structure consistent with Atmosphere
  - Fixed so that log out of Troposphere logs a user out of Atmosphere API as well
  
Enhancements:
  - Image Owner can now [update visibility & access](https://github.com/cyverse/troposphere/pull/706) to images
  - Support for Unlimited Allocation Sources
  - [Improved Boot Scripts](https://github.com/cyverse/troposphere/pull/703) management and handling
  - Volume creation modal pauses until complete, showning new Volume in Project
  - Added Django Manage command to start and stop Maintenance

## [Ancient-Asteroid (v27)](https://github.com/cyverse/troposphere/milestone/16?closed=1) (as of 9/13/2017)

Bugfixes:
  - Fixed issues where Size label for Instances left out disk information
  - Allowed Instance Launch Modal to remain open until launching complete
  - Avoid allowing "copy" for invalid IP addresses (`0.0.0.0`)
  - Corrected issues with Emulate URL
  - Include latest fix for django-cyverse-auth module
  - Fixed boot scripts not being associated on launch
  - Fixed problems preventing Volumes from being moved between projects
  - Fixed Advanced Options feature in Launch Modal being "clickable"
  - Fixed issue with instances row hyperlinks 

Enhancments:
  - Removed unused components 
  - Improved `<SelectMenu />` component
  - Better development support for faster feedback on changes

## [Zesty-Zapdos](https://github.com/cyverse/troposphere/milestone/15?closed=1) (as of 8/3/2017)

[Bugfixes](https://github.com/cyverse/troposphere/pulls?utf8=%E2%9C%93&q=is%3Apr%20is%3Aclosed%20merged%3A2017-06-05..2017-08-03):
  - Instance Disk size validated on the client-side, when launching
  - Made number of uWSGI processes configuration (web request/response performance tuning)
  - Update resource requests (allocation & quota)
  - Correct JSX attribute typos for CSS 
  - Ensure Travis CI catches any missing data migrations 
  - Fix issue with Gravatar icons differing between Instance History & Project views
  - Remove duplicate `<SelectMenu/>` definitions; resolve component usage
  - (Admind) improve image request error reporting
  
Enhancements:  
  - Apache Guacamole integration as a "beta" remote access option
  - Provide sourceMaps for deployed application bundles (improved error triage)
  - Upgrade to Webpack v2
  - Upgrade to Django 1.11
  - Improve code quality via ESLint rule defintion
  - (Admin) Offer "emulate" link from "Manage Users" tab

## [Yampy-Yellowlegs](https://github.com/cyverse/troposphere/milestone/14?closed=1) (as of 6/5/2017)

Bugfixes:
  - Corrected issue where Instances within Project View appear to be "stuck" in Build
  - Made inclusion of Google Analytics optional (based on Community Feedback)
  - "not found" (404) messaging shown for Image Details Pages unavailable to community member
  - Corrected rendering of Project Resources for medium screen sizes
  - Adjusted Web Desktop signature generation
     - Fixes issues with Network Address Translation origins related to Client IP.
  - Added newline rendering to Maintenance Messages
  - Corrected cloud provider selection for "Request More Resources" modal
  - (Admin) Corrected Image Request statuses not updating

Enhancements:
  - Improved the reuse of `<NotFoundPage />` component
  - (Admin) Made request status for Image Requests collapsible
  - (Admin) Added setting flag for how resources can be "reported"

## [Xylotomous-Xenops](https://github.com/cyverse/troposphere/milestone/13?closed=1) (as of 4/25/2017)
Features:
  - Integrated in-app, live chat to answer question & help resolve issues
  - All actions available on an instance are now driven by the API
  - Within capable cloud providers, instances can be shelved & unshelved

Enhancements:
  - Improved readability of error notifications received
  - Started including new user interface elements (part of mini-release effort, forthcoming)
  
Bugfixes:
  - Corrected the "actions" shown for instance in "Active - Networking"
  - Corrected issue with adding tags to Images
  - Corrected problem where "Web Desktop" link shown for suspended instances

## [Whimsical-Wyvern](https://github.com/cyverse/troposphere/milestone/12?closed=1) (as of 3/21/2017)
Features:
  - Provided a framework that allows support for custom messages within Troposphere UI
  - Staff users will now see basic image metrics in the image catalog
Enhancements:
  - Provide support for Resource Requests using both 'varieties' of allocation and quota
Internal:
  - Sentry.io is now configurable via Clank


## [Voracious-Velociraptor](https://github.com/cyverse/troposphere/milestone/11?closed=1) (as of 2/14/2017)
Features:
  - Provided a framework that allows support for custom messages within Troposphere UI
Enhancements:
  - Provide support for Resource Requests using both 'varieties' of allocation and quota
Bugfixes:
  - Image Details now clearly show end-dated indication
  - end-dated images will no longer show in the Instance Launch modal
  - Small changes to make Troposphere more mobile-friendly

## [Undulating-Umbrellabird](https://github.com/cyverse/troposphere/pulls?q=is%3Amerged+is%3Apr+milestone%3A%22Undulating-Umbrellabird+%22) (as of 1/4/2017)

Features:
  - Export credentials for use with OpenStack client tools
  - Provide explicit indicator is system password has expired

Enhancements:
  - Utilize the clipboard API for copying credentials
  - Utilize the clipboard API for copying UUIDs for Image Versions

Bugfixes:
  - Add Image Version UUIDs back to Image detail view
  - Fix display "overflow" issues with tags
  - Fix display "overflow" issue with SSH keys
  - Ensure all instances have a valid, default name
  - Fix issue creating image bookmarks
  - Fix issue displaying images by tag

## [Toco-Toucan](https://github.com/cyverse/troposphere/pulls?utf8=%E2%9C%93&q=is%3Amerged%20is%3Apr%20milestone%3A%22Toco-Toucan%22)

Internal release:
  - included in `Undulating-Umbrellabird`
