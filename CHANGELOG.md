## Change Log

_1.2.2 — March 28, 2019_

* changed default cache time from 60 seconds to zero for non-production use
* updated dependancies

_1.2.1 — February 8, 2018_

* updated dependancies
	* updated handlerbars from 4.0.5 to 4.0.11
* updated dev dependancies
	* updated mocha from 3.x to 5.x
	* refactored tests to not require cheerio
	* removed cheerio

_1.2.0 — June 15, 2017_

* the cache that was added in 1.1.0 is now used all the time
	* the contents of the layout files are cache in memory for up to one day when `NODE_ENV=production`
	* otherwise, the contents are cached for one minute
	* the duration for which the contents are cached in memory can be changed with the `WAXON_CACHE` environment variable. it is set in seconds.

_1.1.0 — June 9, 2017_

* added cache for reading layout files specified in the {{#extends}} helper when run in a production environment
* added the graceful-fs module to prevent EMFILE errors

_1.0.3 — October 26, 2016_

* added travis-ci build instructions
* added npm, travis-ci, and david-dm badges to the readme


_1.0.2 — October 26, 2016_

* moved change log from README to a new file
* fixed date of release for v1.0.1


_1.0.1 — October 26, 2016_

* added tests for the four common use cases outlined in the Pug docs
* make it possible to override a block to provide additional blocks
* make it possible to redefine a block from a parent template


_1.0.0 — September 16, 2016_

* initial version
* requires node.js File System and Path modules to load layouts from the file system
