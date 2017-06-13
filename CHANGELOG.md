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
