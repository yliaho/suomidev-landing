/**
 * Why use a custom builder script instead of just using the CLI
 * you may ask? Well, turns out that if you want to keep using a
 * custom domain on github pages, you sorta need to have CNAME file
 * included in your gh-pages branch instead of just setting the
 * custom domain from github repo's settings. Each consequent push
 * to the gh-pages branch removes whatever you inputted as your
 * custom domain from the settings page. Bundling the source to
 * a production ready code and _then_ creating the CNAME file is
 * a quick and dirty workaround this.
 */
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
