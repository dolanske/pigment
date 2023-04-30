# Todo

- [Effects] [] Review if the order of applied effects has any different end results
- [Effects] [] Tweak min & max values to not make the image disappear etc
- [Effects] [] Preset system 

- [Canvas] [] Option to compare original picture with current picture
  - Side by side
  - With a slider between
- [Effects>Filters] [] Add image sharpening [https://gist.github.com/mikecao/65d9fc92dc7197cb8a7c]
- [Effects>Filters] [] Highlights
- [Effects>Filters] [] Shadows
- [Effects>Filters] [] Temperature
- [Effects]
- [Effects>NoiseTab] [x] Add noise
  - [] gaussian noise
  - [] uniform noise
  - [] fire out how to apply monochromatic noise
- [Shortcuts] [] Copy implementation of keyboard shortcuts from orbit
  - Display keyboard shorcuts in buttons/tooltips for buttons
- [Effects>Transform] [] Flip Horizontall / flip vertically
- [Effects>Transform] [] Rotate (degrees) and +/- 90 degree buttons
  - [] Show helper lines during % rotation
  - [] Make sure that during % rotation the image keeps its aspect ratio and its bounds actually don't rotate

- [Effects>Transform] [] Crop
  - [] Allow cropping
  - [] Set cropping width and height
  - [] Set cropping ratio
    - [] Allow inputs
    - [] Predefined 4:3, 1:1, 16:9, 3:4

- [Global] [] Store state in the URL

## Components

- [Modal] [] Clicking 'Export' will open up a modal showing a preview of the image, option to rename, scale and select export format
  - [JPEG] allow setting a jpeg quality

## Bugs

- [] Image dragged in takes full size instead of being calculated correctly (smaller images tha canvas should not get up-sized)
- [] Noise is not being applied
- [] 

---

## Done

- [Navigation] [x] Protoype sidebar where filters would live instead
  - [x] Keep the header but instead of each filter, there will be "tabs" for sidebar content
    - [x] Filters
    - [x] Transform
    - [x] Pixel Brightness based effects ()
    - [x] Noise
- [WithDropdown] [x] Add option to specify header wiht props
- [Canvas] [x] When loading image, always scale it to 80% of canvas size [(https://livefiredev.com/html5-how-to-scale-image-to-fit-a-canvas-with-demos/)]
- [Canvas] [x] Prevent canvas from losing ctx on re-render
- [Canvas] [x] Option to drag an drop image onto canvas
