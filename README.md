# Manga (image) Processor

Small utility based on node.js to process comics (images).

## Usage

This package is a simple cli and not UI-friendly... it's supposed to be run from code.

Just install the development dependencies via

```
npm install
```

And then just set up the configuration for the desired images and run it with:

```
npm start
```

## Configuration

Edit the [config.ts] file to set up the desired processing options for your files before executing `npm start`.

Doucmentation for each `ProcessAction` is available in the type definition file: [config.d.ts](./src/config.d.ts);
