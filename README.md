# vue-router-qs-binder

[![NPM Version](https://img.shields.io/npm/v/@holamundo.app/vue-router-qs-binder.svg?style=flat-square)](https://www.npmjs.com/package/@holamundo.app/vue-router-qs-binder) [![Netlify Status](https://api.netlify.com/api/v1/badges/bb771a89-7a33-4a2a-bfc4-e959bc31fa02/deploy-status)](https://app.netlify.com/sites/vue-router-qs-binder/deploys)

> A library that simplifies binding a component's `data` property with vue-router query strings.

## Installation

```bash
$ yarn add @holamundo.app/vue-router-qs-binder
```

:warning: **Note**: Vue-router is a required `peerDependency`, make sure you install it if you haven't already done so, eg. via the Vue CLI.

## Usage

### Mixin parameters

#### `data` (required)

Type: `Object` | `function(route)`

An object of the initial data for the mixin, similar to setting initial data for a Vue component via the returned value in the `data()` method.

A function can also be passed here, but it **must return an Object**. The function receives `this.$route` as it's only parameter, allowing you to customize the mapping of query parameters manually.

Example:

`url: https://example.com/?name=Tom&page=2`

```
mixins: [
  qsBinder({
    dataKey: 'search',
    data: ({ query }) => {
      const { name = '', page = 1 } = query,

      return {
        name,
        page
      }
    }
  })
]
```

#### `dataKey` (required)

Type: `string`

The key to be used for saving the data parameter into the components `data`.

#### `debounceLength`

Type: `number`
Default: `0`

The URL parameter changes everytime the data updates, meaning a new history entry for each keystroke in an input for example.

You can increase the `debounceLength` (milliseconds) to adjust how often the URL is updated.

#### `didUpdate`

Type: `function(Instance)`

A method fired when `data`'s contents update (basically a Vue `watch`).

Example:

```
mixins: [
  qsBinder({
    dataKey: 'search',
    data: {
      name: ''
    },
    didUpdate: ($this) => {
      $this.runSearch()
    }
  })
]
```

#### `updateDataMethodName`

Type: `string`
Default: `updateQsData`

Name of the "update method" added to the component where the mixin has been initiated. Useful for when using multiple instances of the mixin in a single component.

### API

#### `updateQsData`

Parameters: `(newData: Object, silent: boolean)`

Method used to update the data (and update the URL query string), it receives an object parameter with the new data as key/value pairs.

There's also a second `silent` boolean parameter, when set to `true` the URL **will not** be updated.

### Example

```vue
<template>
  <input type="text" :value="search.name" @change="updateName" />
</template>

<script>
import qsBinder from '@holamundo.app/vue-router-qs-binder';

export default {
  name: 'MyComponent',

  mixins: [
    qsBinder({
      dataKey: 'search',
      data: {
        name: ''
      }
    })
  ],

  methods: {
    updateName(e) {
      this.updateQsData({ name: e.target.value });
    }
  }
};
</script>
```

For a more in-depth example see the [demos](./demo).

## Development

```bash
# Install dependencies
$ yarn

# Demo environment
$ yarn serve

# Lint & fix files
$ yarn lint

# Build for production
$ yarn build
```
