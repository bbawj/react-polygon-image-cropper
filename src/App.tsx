import { useRef, useState } from 'react';
import './App.css';
import { Canvas } from '.';

function App() {
  const [crop, setCrop] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [reset, setReset] = useState(false);
  const buttonRef = useRef(null);
  const resetRef = useRef(null);
  const confirmRef = useRef(null);
  const saveRef = useRef(null);
  const saveCallback = (imageUrl: any) => console.log(imageUrl);
  return (
    <div className="App">
      <Canvas
        width={500}
        height={500}
        source="https://avatars.githubusercontent.com/u/53790951?v=4"
        radius={50}
        color="red"
        cropRef={buttonRef}
        rescaleRef={confirmRef}
        resetRef={resetRef}
        saveProps={{ saveRef, saveCallback }}
        styles={{
          border: '1px solid red',
          display: 'flex',
          alignItems: 'center',
        }}
      />
      <button ref={buttonRef}>Crop</button>
      <button ref={confirmRef} onClick={() => setConfirm(true)}>
        Confirm
      </button>
      <button ref={resetRef} onClick={() => setReset(true)}>
        Reset
      </button>
      <button ref={saveRef}>Save</button>
    </div>
  );
}

export default App;
