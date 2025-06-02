# RHTAS Console UI

The RHTAS Console is a web-based frontend for interacting with the [Red Hat Trusted Artifact Signer (TAS)](https://developers.redhat.com/products/trusted-artifact-signer/overview) ecosystem. It provides user-friendly workflows for retrieving, verifying, and monitoring signed software artifacts, integrating with [Sigstore](https://www.sigstore.dev/) services like Rekor, Fulcio, and [TUF](https://theupdateframework.io/) (The Update Framework).

Features in progress:
- View trust metadata and certificate details
- Verify signatures and attestations
- Retrieve container artifacts from registries
- Integrate with transparency logs (Rekor)

Links:
- [RHTAS Console](https://github.com/securesign/rhtas-console)
- Based on [PatternFly React Seed](https://github.com/patternfly/patternfly-react-seed)
- Uses [PatternFly v6](https://www.patternfly.org/), React, and [Storybook](https://storybook.js.org/)

## Quickstart

```
git clone https://github.com/securesign/rhtas-console-ui
cd rhtas-console-ui
npm install && npm run start
```

## Configurations

- [TypeScript Config](./tsconfig.json)
- [Webpack Config](./webpack.config.ts)
- [Editor Config](./.editorconfig)
- [Storybook Config](./.storybook/main.ts)

## Development

```bash
# Install development/build dependencies
npm install

# Start the development server
npm run start

# Run a production build (outputs to "dist" dir)
npm run build

# Run the test suite
npm run test

# Run the test suite with coverage
npm run test:coverage

# Run the linter
npm run lint

# Run the code formatter
npm run format

# Launch a tool to inspect the bundle size
npm run bundle-profile:analyze

# Start the express server (run a production build first)
npm run start
```

## Raster image support

To use an image asset that's shipped with PatternFly core, you'll prefix the paths with "@assets". `@assets` is an alias for the PatternFly assets directory in `node_modules`.

For example:

```js
import imgSrc from '@assets/images/g_sizing.png';
<img src={imgSrc} alt="Some image" />;
```

You can use a similar technique to import assets from your local app, just prefix the paths with "`@app`". `@app` is an alias for the main `src/app` directory.

```js
import loader from '@app/assets/images/loader.gif';
<img src={loader} alt="Content loading" />;
```

## Vector image support

Inlining SVG in the app's markup is also possible.

```js
import logo from '@app/assets/images/logo.svg';
<span dangerouslySetInnerHTML={{ __html: logo }} />;
```

You can also use SVG when applying background images with CSS. To do this, your SVG's must live under a `bgimages` directory (this directory name is configurable in [webpack.config.ts](./webpack.config.ts#L5)). This is necessary because you may need to use SVG's in several other context (inline images, fonts, icons, etc.) and so we need to be able to differentiate between these usages so the appropriate loader is invoked.

```css
body {
  background: url(./assets/bgimages/img_avatar.svg);
}
```

## Adding custom CSS

When importing CSS from a third-party package for the first time, you may encounter the error `Module parse failed: Unexpected token... You may need an appropriate loader to handle this file typ...`. You need to register the path to the stylesheet directory in [stylePaths.ts](./stylePaths.ts). We specify these explicitly for performance reasons to avoid webpack needing to crawl through the entire node_modules directory when parsing CSS modules.

## Code quality tools

- For accessibility compliance, we use [react-axe](https://github.com/dequelabs/react-axe)
- To keep our bundle size in check, we use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- To keep our code formatting in check, we use [prettier](https://github.com/prettier/prettier)
- To keep our code logic and test coverage in check, we use [jest](https://github.com/facebook/jest)
- To ensure code styles remain consistent, we use [eslint](https://eslint.org/)

## Multi environment configuration

This project uses [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack) for exposing environment variables to your code. Either export them at the system level like `export MY_ENV_VAR=http://dev.myendpoint.com && npm run start:dev` or simply drop a `.env` file in the root that contains your key-value pairs like below:

```sh
ENV_1=http://1.myendpoint.com
ENV_2=http://2.myendpoint.com
```

With that in place, you can use the values in your code like `console.log(process.env.ENV_1);`
