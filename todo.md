# Todo

## Implementation

- [Canvas] [] Option to compare original picture with current picture
  - Side by side
  - With a slider between
- [Effects] [] Option to remove background color
- [Effects] [] Add image sharpening
- [Effects] [] Add noise
  - [] Amount of noise
  - [] BW or colored
- [Shortcuts] [] Copy implementation of keyboard shortcuts from orbit
  - Display keyboard shorcuts in buttons/tooltips for buttons

## Components

- [Modal] [] Clicking 'Export' will open up a modal showing a preview of the image, option to rename, scale and select export format

## Bugs

- [] Image dragged in takes full size instead of being calculated correctly (smaller images tha canvas should not get up-sized)

---

## Done

- [WithDropdown] [x] Add option to specify header wiht props
- [Canvas] [x] When loading image, always scale it to 80% of canvas size [(https://livefiredev.com/html5-how-to-scale-image-to-fit-a-canvas-with-demos/)]
- [Canvas] [x] Prevent canvas from losing ctx on re-render
- [Canvas] [x] Option to drag an drop image onto canvas
