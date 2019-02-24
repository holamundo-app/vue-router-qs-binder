# vue-router-qs-binder

A library that simplifies binding a component's `data` property with vue-router query strings.

## Installation

```bash
$ yarn add @holamundo.app/vue-router-qs-binder
```

:warning: **Note**: Vue-router is a required `peerDependency`, make sure you install it if you haven't already done so, eg. via the Vue CLI.

## Usage

```js
// MyComponent.vue

<template>
  <input type="text" v-model="search.name" />
</template>

<script>
import qsBinder from '@holamundo.app/vue-router-qs-binder'

export default {
  name: 'MyComponent',

  mixins: [ qsBinder({ name: '' }, 'search') ]
}
</script>
```

## Development

```bash
# Install dependencies
$ yarn

# Demo environment
$ yarn serve

# Lint & fix files
$ yarn lint

# Run unit tests
$ yarn test:unit

# Build for production
$ yarn build
```
