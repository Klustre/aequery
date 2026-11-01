import util from 'node:util'
import { exec as thing } from 'node:child_process'
import { join } from 'node:path'
import { rename } from 'node:fs/promises'

const exec = util.promisify(thing)
const bin = join('node_modules', '.bin', 'jsdoc')
await exec(`${bin} lib --configure .jsdocrc.json`)

// Something is messing up the names of a couple of doc files.
// Rename to expected values
rename('docs/aeq.layer_.html', 'docs/aeq.Layer_.html')
rename('docs/aeq.Layer.html', 'docs/aeq.layer.html')
