import grammar from '../grammar/aeq.peg' with { type: 'text' }
import peg from 'pegjs'
import { writeFile } from 'node:fs/promises'

const parser = peg.generate(grammar, { output: 'source' })
await writeFile('grammar/parser.js', `export const cssselector=${parser}`)
