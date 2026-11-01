import grammar from '../grammar/aeq.peg' with { type: 'text' }
import peg from 'pegjs'
import { writeFile } from 'node:fs/promises'

const parser = peg.generate(grammar, { output: 'source' })
const content = [
	'// Generated automatically. Do not edit.',
	`export const cssselector=${parser}`,
].join('\n')
await writeFile('lib/parser/parser.js', content)
