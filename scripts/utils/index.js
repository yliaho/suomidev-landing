const { writeFile } = require('fs')
const { promisify } = require('util')

/**
 * Writes a file asynchronously.
 */
const writeFileAsync = promisify(writeFile)

async function createCNAMEFile({ domain, dir }) {
  return writeFileAsync(`${dir}/CNAME`, `${domain}\n`)
}

exports.createCNAMEFile = createCNAMEFile
