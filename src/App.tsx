import React, { useRef, useState } from 'react';
import './App.css';
import { Canvas } from '.';

function App() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState<any>('');
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
        cropEvent={{ elementRef: buttonRef, eventType: 'click' }}
        rescaleEvent={{ elementRef: rescaleRef, eventType: 'click' }}
        resetEvent={{ elementRef: resetRef, eventType: 'click' }}
        saveProps={{ saveRef, saveCallback }}
        styles={{
          border: '1px solid red',
          display: 'flex',
          alignItems: 'center',
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

export default App;
