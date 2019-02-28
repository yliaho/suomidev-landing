const Bundler = require('parcel-bundler')
const path = require('path')
const { createCNAMEFile } = require('./utils/index')

const customDomain = 'suomi.dev'

const entryFiles = [path.resolve(process.cwd(), 'src/index.html')]
const bundlerOptions = {
  outDir: path.resolve(process.cwd(), 'dist'),
  outFile: 'index.html',
  publicUrl: './',
  watch: false,
  cache: false,
  contentHash: true,
  minify: true,
  target: 'browser',
  sourceMaps: true,
  detailedReport: true
}

const bundler = new Bundler(entryFiles, bundlerOptions)

async function runBuild() {
  bundler.bundle().then(() => {
    createCNAMEFile({ dir: bundlerOptions.outDir, domain: customDomain })
  })
}

runBuild()
