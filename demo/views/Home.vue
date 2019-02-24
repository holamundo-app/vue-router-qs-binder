<template>
  <div
    class="background-wrap"
    :style="backgroundWrapStyles"
    :data-color="activeColor"
  >
    <div class="colors">
      <div
        v-for="(color, index) in colors"
        :key="`${color}_${index}`"
        :data-color="color"
        :style="{ backgroundColor: color, color: readableTextColor(color) }"
        class="color-square"
        :class="{ active: color === activeColor }"
        @click="updateActiveColor(color)"
      />
    </div>
  </div>
</template>

<script>
import randomColor from 'randomcolor';
import { complement, readableColor } from 'polished';

import qsBinder from '@/index.js';

const initialColors = [...Array(5).keys()].map(() => randomColor());

export default {
  name: 'Home',

  mixins: [
    qsBinder({
      dataKey: 'colorsquares',
      data: {
        activeColor: initialColors[2]
      },
      debounceLength: 500
    })
  ],

  methods: {
    updateActiveColor(newColor) {
      this.colorsquares = {
        ...this.colorsquares,
        activeColor: newColor
      };
    },

    readableTextColor(color) {
      return readableColor(color);
    }
  },

  computed: {
    colors: () => initialColors,

    activeColor() {
      return this.colorsquares.activeColor || this.colors[2];
    },

    backgroundWrapStyles() {
      return {
        backgroundColor: this.activeColor,
        color: complement(this.activeColor)
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.background-wrap {
  height: 100%;
  transition: background 0.6s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: attr(data-color);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 35vw;
    line-height: 0.7;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    word-break: break-word;
    z-index: 1;
    opacity: 0.5;
    text-transform: uppercase;
    text-align: center;
    padding: 0 10vw;
    color: inherit;
    transition: color 0.6s ease;
  }
}

.colors {
  display: flex;
  justify-content: center;
  width: 80vw;
  position: relative;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
}

.color-square {
  position: relative;
  flex: 0 0 20%;
  max-width: 80vh;
  box-shadow: 0 1px 10px 2px rgba(0, 0, 0, 0);
  z-index: 3;
  transform: scale(1);
  border-radius: 0;
  backface-visibility: hidden;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.4s ease, box-shadow 0.5s ease, transform 0.5s ease,
    border-radius 0.3s ease;

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  &::after {
    content: attr(data-color);
    font-size: 1.2vw;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    transform: translateY(-50%);
  }

  &:hover {
    opacity: 0.95;
  }

  &.active {
    box-shadow: 0 1px 10px 2px rgba(0, 0, 0, 0.1);
    z-index: 4;
    transform: scale(1.1);
    border-radius: 1vw;
    opacity: 1;
  }

  &:first-of-type {
    border-top-left-radius: 1vw;
    border-bottom-left-radius: 1vw;
  }

  &:last-of-type {
    border-top-right-radius: 1vw;
    border-bottom-right-radius: 1vw;
  }
}
</style>
