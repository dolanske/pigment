# Todo

- [Effects] [] Review if the order of applied effects has any different end results

## Implementation

- [Canvas] [] Option to compare original picture with current picture
  - Side by side
  - With a slider between
- [Effects>Transform] [] Option to remove background color
- [Effects>Filters] [] Add image sharpening
- [Effects>NoiseTab] [] Add noise
  - [] Amount of noise
  - [] BW or colored
- [Shortcuts] [] Copy implementation of keyboard shortcuts from orbit
  - Display keyboard shorcuts in buttons/tooltips for buttons
- [Effects>Transform] [] Flip Horizontall / flip vertically
- [Effects>Transform] [] Rotate (degrees) and +/- 90 degree buttons

## Components

- [Modal] [] Clicking 'Export' will open up a modal showing a preview of the image, option to rename, scale and select export format
  - [JPEG] allow setting a jpeg quality
- [Navigation] [] Protoype sidebar where filters would live instead
  - [] Keep the header but instead of each filter, there will be "tabs" for sidebar content
    - [] Filters
    - [] Transform
    - [] Pixel Brightness based effects ()
    - [] Noise

## Bugs

- [] Image dragged in takes full size instead of being calculated correctly (smaller images tha canvas should not get up-sized)

---

## Done

- [WithDropdown] [x] Add option to specify header wiht props
- [Canvas] [x] When loading image, always scale it to 80% of canvas size [(https://livefiredev.com/html5-how-to-scale-image-to-fit-a-canvas-with-demos/)]
- [Canvas] [x] Prevent canvas from losing ctx on re-render
- [Canvas] [x] Option to drag an drop image onto canvas
