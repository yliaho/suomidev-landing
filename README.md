# Suomi.dev Landing Page

> Really goddamn simple landing page featuring moomin! <https://suomi.dev>

## Development

- `$ yarn` to install dependencies
- `$ yarn run dev` to start the parcel development server.

## Production

- `$ yarn run build` to build production code from source.
- `$ yarn run deploy` runs the following scripts:
  - `clean` removes the `dist/` directory to trash
  - `build` builds production code from source using `scripts/build.js`.
  - `push-dir` (node module script) pushes the `dist/` folder to the `gh-pages` branch

### Why not use parcel's CLI?

as described in `scripts/build.js`

```
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
```

In a nutshell, I'm still using parcel, but just programmatically. It makes it easier to do whatever tasks I need to do after bunding a production code (In this case, creating a CNAME file for github pages).
