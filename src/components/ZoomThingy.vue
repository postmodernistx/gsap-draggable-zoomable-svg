<script setup lang="ts">
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

const SQUARE_SIZE = 200;
const SCROLL_RESISTANCE = 4;
const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 15;
const SQUARE_COUNT = 5;

const svgElement = ref<null | SVGElement>(null);
const currentZoomLevel = ref(MIN_ZOOM_LEVEL);
const containerElement = ref<null | HTMLDivElement>(null);
const draggable = ref();

onMounted(() => {
  if (svgElement.value === null || containerElement.value === null) {
    return;
  }

  createSVGSquares();
  const viewBox = svgElement.value.getAttribute('viewBox');
  if (!viewBox) {
    return;
  }

  draggable.value = Draggable.create(svgElement.value, {
    type: 'x,y',
    bounds: containerElement.value,
    inertia: true,
    throwResistance: 300,
    throwProps: true,
    allowEventDefault: true,
  })[0];

  svgElement.value.addEventListener('wheel', zoomScroll);
});

function zoomSVG() {
  if (svgElement.value === null) {
    return;
  }

  if (currentZoomLevel.value < MIN_ZOOM_LEVEL) {
    currentZoomLevel.value = MIN_ZOOM_LEVEL;
  }

  if (currentZoomLevel.value > MAX_ZOOM_LEVEL) {
    currentZoomLevel.value = MAX_ZOOM_LEVEL;
  }

  gsap.to(svgElement.value, { scale: currentZoomLevel.value, transformOrigin: 'center center', onUpdate: () => {
      draggable.value.applyBounds(containerElement.value);
      draggable.value.update();
    },
  });
}

function zoomScroll(e: WheelEvent) {
  if (!e.ctrlKey) {
    return;
  }
  e.preventDefault();
  currentZoomLevel.value += Math.sign(e.deltaY) / SCROLL_RESISTANCE;
  zoomSVG();
}

function zoomIn() {
  currentZoomLevel.value += 1;
  zoomSVG();
}

function zoomOut() {
  currentZoomLevel.value -= 1;
  zoomSVG();
}

function zoomReset() {
  currentZoomLevel.value = 1;
  zoomSVG();
}

function createSVGSquares() {
  if (svgElement.value === null) {
    return;
  }
  const colorArray = ["#a8a8a8", "#799d9f", "#835a65"];
  const svgns = "http://www.w3.org/2000/svg";
  let count = 0;

  for (let j = 0; j < SQUARE_COUNT; j++) {
    for (let i = 0; i < SQUARE_COUNT; i++) {
      count++;

      let newSquare = document.createElementNS(svgns, "rect");
      let txt = document.createElementNS(svgns, "text");
      svgElement.value.appendChild(newSquare);
      svgElement.value.appendChild(txt);
      txt.textContent = String(count);

      gsap.set(newSquare, {
        attr: {
          x: SQUARE_SIZE * i,
          y: j * SQUARE_SIZE,
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          fill: colorArray[count % 3]
        }
      });
      gsap.set(txt, {
        attr: { x: SQUARE_SIZE * i + 100, y: j * SQUARE_SIZE + 115, "text-anchor": "middle" }
      });
    }
  }

  svgElement.value.setAttribute('viewBox', `0 0 ${SQUARE_SIZE * SQUARE_COUNT} ${SQUARE_SIZE * SQUARE_COUNT}`);
}
</script>

<style>
.container {
  position: relative;
  width: 800px;
  height: 800px;
  border: 1px solid black;
  overflow: hidden;
}
.container .buttons {
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: center;
  position: absolute;
  z-index: 2;
  bottom: 4px;
}
</style>

<template>
  <div class="container" ref="containerElement">
    <svg ref="svgElement" xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"></svg>
    <div class="buttons">
      <button @click="zoomIn">Zoom in</button>
      <button @click="zoomOut">Zoom out</button>
      <button @click="zoomReset">Reset</button>
    </div>
  </div>
</template>
