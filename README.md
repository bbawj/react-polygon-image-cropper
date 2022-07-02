# react-polygon-image-cropper

## Demo

https://user-images.githubusercontent.com/53790951/176822796-6f5d6611-3a4a-4fed-9e8b-b6b6c9e1fedb.mp4

## Installation

```
npm install react-polygon-image-cropper
```

## Quickstart - Demo setup

```typescript
import React, { useRef, useState } from "react";
// import the Canvas component
import { Canvas } from "react-polygon-image-cropper";
// *important* import the styles for the component
import "react-polygon-image-cropper/dist/style.css";

function App() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<any>("");
  const buttonRef = useRef(null);
  const resetRef = useRef(null);
  const rescaleRef = useRef(null);
  const saveRef = useRef(null);
  const saveCallback = (imageUrl: any) => setUrl(imageUrl);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target) setSource(event.target.result);
    };
    if (e.target.files) reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="App">
      <Canvas
        width={500}
        height={500}
        source={source}
        radius={30}
        color="red"
        cropEvent={{ elementRef: buttonRef, eventType: "click" }}
        rescaleEvent={{ elementRef: rescaleRef, eventType: "click" }}
        resetEvent={{ elementRef: resetRef, eventType: "click" }}
        saveProps={{ saveRef, saveCallback }}
        styles={{
          border: "1px solid red",
          display: "flex",
          alignItems: "center",
        }}
      />
      <input type="file" accept="image/png" onChange={(e) => handleImage(e)} />
      <button ref={buttonRef}>Crop</button>
      <button ref={rescaleRef}>Rescale</button>
      <button ref={resetRef}>Reset</button>
      <button ref={saveRef}>Save</button>
      <img src={url} />
    </div>
  );
}
```
## Documentation

### Canvas Props Table

|      Prop      |                                                                              Type                                                                              | Required | Description                                                                                                                                        |
|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|----------------------------------------------------------------------------------------------------------------------------------------------------|
|      width     |                                                                             number                                                                             |   true   | Width of the image canvas                                                                                                                          |
|     height     |                                                                             number                                                                             |   true   | Height of the image canvas                                                                                                                         |
|     source     |                                                                             string                                                                             |   true   | Source string for the image. Can be a URL or local image (e.g. in assets)                                                                          |
|     radius     |                                                                             number                                                                             |   true   | Radius of the handles                                                                                                                              |
|      color     |                                                                             string                                                                             |   true   | Fill color of the handles                                                                                                                          |
|    cropEvent   |  [EventListenerProps](https://github.com/bbawj/react-polygon-image-cropper/blob/144f67d42e8de666ab49fd0b65d874536ef5434e/src/components/Canvas/Canvas.tsx#L18) |   false  | Used to attach a HTMLEvent to a React.RefObject in order to trigger a crop function                                                                |
|   resetEvent   |  [EventListenerProps](https://github.com/bbawj/react-polygon-image-cropper/blob/144f67d42e8de666ab49fd0b65d874536ef5434e/src/components/Canvas/Canvas.tsx#L18) |   false  | Used to attach a HTMLEvent to a React.RefObject in order to trigger a reset function                                                               |
|  rescaleEvent  |  [EventListenerProps](https://github.com/bbawj/react-polygon-image-cropper/blob/144f67d42e8de666ab49fd0b65d874536ef5434e/src/components/Canvas/Canvas.tsx#L18) |   false  | Used to attach a HTMLEvent to a React.RefObject in order to trigger a rescale function                                                             |
|    saveProps   |      [SaveProps](https://github.com/bbawj/react-polygon-image-cropper/blob/144f67d42e8de666ab49fd0b65d874536ef5434e/src/components/Canvas/Canvas.tsx#L23)      |   false  | Used to attach a HTMLEvent to a React.RefObject in order to trigger a save callback which passes the data url of the final canvas (after rescale). |
|     styles     |                                                                       React.CSSProperties                                                                      |   false  | Used to style the bounding <div> box for the canvases                                                                                              |
| customCallback | [CustomCallbackProps](https://github.com/bbawj/react-polygon-image-cropper/blob/144f67d42e8de666ab49fd0b65d874536ef5434e/src/components/Canvas/Canvas.tsx#L12) |   false  | Passes the React.RefObject for all 3 canvases to be used in custom logic                                                                           |

## How to contribute

1. Clone the repository.
   You can run the local example with: `npm run dev`
2. Create a new branch for your new pull request
