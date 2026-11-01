aequery
==========

General purpose scripting library for After Effects UXP

Requirements
------------

- Adobe After Effects
- VSCode or other text editor

Download/install
----------------

```bash
npm install aequery --save-dev
```

If you are not using npm, you can download the latest version from [Github Releases](https://github.com/docsforadobe/aequery/releases).

Import into your script

```js
import { aeq } from 'aequery'
// Disable all Camera lens blur effects in active comp
aeq('activecomp effect[matchName="ADBE Camera Lens Blur"]').attr(
	'enabled',
	false,
)
```

Documentation
-------------

For documentation, visit [docsforadobe.github.io/aequery](https://docsforadobe.github.io/aequery/).

Development
-----------

Make sure you have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed.

```bash
# Clone the repository and enter the directory
git clone https://github.com/docsforadobe/aequery.git
cd aequery
# Install npm dependencies
npm install
```

# Contributing

Pull requests, [bug reports and feature requests](https://github.com/docsforadobe/aequery/issues) are welcome!
