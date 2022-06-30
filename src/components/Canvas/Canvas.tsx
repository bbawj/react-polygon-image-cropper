import React, { useEffect, useRef, useState } from 'react';
import { Handle, HandleProps } from '../Handle/Handle';
import './Canvas.css';
import {
  checkProximity,
  clearCanvas,
  cropImage,
  drawLine,
  redrawCropped,
} from '../../utils';

type CustomCallbackProps = (
  imageCanvasRef: React.RefObject<HTMLCanvasElement>,
  cropCanvasRef: React.RefObject<HTMLCanvasElement>,
  finalCanvasRef: React.RefObject<HTMLCanvasElement>
) => unknown;

interface EventListenerProps {
  elementRef: React.RefObject<HTMLElement>;
  eventType: string;
}

interface SaveProps {
  saveRef: React.RefObject<HTMLElement>;
  saveCallback: (imageUrl: string) => any;
}

interface CanvasProps {
  width: number;
  height: number;
  source: string;
  radius: number;
  color: string;
  draggable?: boolean;
  proximity?: number;
  cropEvent?: EventListenerProps;
  resetEvent?: EventListenerProps;
  rescaleEvent?: EventListenerProps;
  saveProps?: SaveProps;
  styles?: React.CSSProperties;
  customCallback?: CustomCallbackProps;
}

const Canvas = ({
  width,
  height,
  source,
  radius,
  color,
  draggable = true,
  proximity,
  cropEvent,
  resetEvent,
  rescaleEvent,
  saveProps,
  styles,
  customCallback,
}: CanvasProps) => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [handles, setHandles] = useState<Array<HandleProps>>([]);
  const [cropped, setCropped] = useState(false);
  const [scaled, setScaled] = useState(false);

  useEffect(() => {
    if (customCallback) {
      customCallback(imageCanvasRef, cropCanvasRef, finalCanvasRef);
    }
  }, []);

  useEffect(() => {
    const handleCrop = () => {
      cropImage(imageCanvasRef, cropCanvasRef, handles);
      setCropped(true);
    };
    const cropRef = cropEvent?.elementRef;
    if (cropRef && cropRef.current) {
      cropRef.current.addEventListener('click', handleCrop);
    }
    return () => cropRef?.current?.removeEventListener('click', handleCrop);
  }, [cropEvent, handles]);

  useEffect(() => {
    const handleReset = () => {
      clearCanvas(cropCanvasRef);
      clearCanvas(finalCanvasRef);
      setHandles([]);
      setCropped(false);
      setScaled(false);
    };
    const resetRef = resetEvent?.elementRef;
    if (resetRef && resetRef.current) {
      resetRef.current.addEventListener('click', handleReset);
    }
    return () => resetRef?.current?.removeEventListener('click', handleReset);
  }, [resetEvent]);

  useEffect(() => {
    const handleScale = () => {
      if (!scaled) {
        redrawCropped(handles, cropCanvasRef, finalCanvasRef);
        setHandles([]);
        setScaled(true);
      }
    };
    const rescaleRef = rescaleEvent?.elementRef;
    if (rescaleRef && rescaleRef.current) {
      rescaleRef.current.addEventListener('click', handleScale);
    }
    return () => rescaleRef?.current?.removeEventListener('click', handleScale);
  }, [rescaleEvent, handles, scaled]);

  useEffect(() => {
    if (saveProps) {
      const saveRef = saveProps.saveRef;
      const handleSave = () => {
        const imageUrl = finalCanvasRef.current?.toDataURL('image/png');
        if (imageUrl) {
          saveProps.saveCallback(imageUrl);
        }
      };
      if (saveRef && saveRef.current) {
        saveRef.current.addEventListener('click', handleSave);
      }

      return () => saveRef?.current?.removeEventListener('click', handleSave);
    }
  }, [saveProps]);

  useEffect(() => {
    const canvas = imageCanvasRef.current;
    if (canvas) {
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      const context = canvas.getContext('2d');
      if (context) {
        const image = new Image();
        image.onload = function () {
          context.imageSmoothingEnabled = false;
          context.drawImage(
            image,
            0,
            0,
            image.width * window.devicePixelRatio,
            image.height * window.devicePixelRatio,
            0,
            0,
            canvas.width,
            canvas.height
          );
        };
        image.src = source;
      }
    }

    const handleCanvas = cropCanvasRef.current;
    if (handleCanvas) {
      handleCanvas.width = width;
      handleCanvas.height = height;
    }
  }, [source]);

  useEffect(() => {
    const cropCanvas = cropCanvasRef.current;
    if (cropCanvas) {
      const cropContext = cropCanvas.getContext('2d');
      if (cropped) {
        cropImage(imageCanvasRef, cropCanvasRef, handles);
      } else {
        cropContext?.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        handles.forEach((_, idx) => drawLine(handles, idx, cropContext));
      }
    }
  }, [handles, cropped]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const cropCanvas = cropCanvasRef.current;
    if (cropCanvas) {
      const rect = cropCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        !checkProximity(handles, { x: x, y: y }, proximity || 0) &&
        !cropped
      ) {
        setHandles((prev) => [
          ...prev,
          { x: x, y: y, radius: radius, color: color },
        ]);
      }
    }
  };

  const updateHandles = (idx: number, x: number, y: number) => {
    const handlesCopy = Array.from(handles);
    handlesCopy[idx] = { ...handlesCopy[idx], x: x, y: y };
    setHandles(handlesCopy);
  };

  return (
    <div
      className="react-polygon-bounding-box"
      style={{ height: height, width: width, ...styles }}>
      <canvas
        style={{ height: height, width: width }}
        className="react-polygon-image-canvas"
        hidden={cropped}
        ref={imageCanvasRef}
      />
      <canvas
        style={{ height: height, width: width }}
        className="react-polygon-crop-canvas"
        ref={cropCanvasRef}
        onClick={handleClick}
      />
      <canvas className="react-polygon-final-canvas" ref={finalCanvasRef} />
      {handles.map((handle, idx) => (
        <Handle
          key={idx}
          idx={idx}
          {...handle}
          updateHandles={updateHandles}
          draggable={draggable}
          cropCanvasRef={cropCanvasRef}
        />
      ))}
    </div>
  );
};

export default Canvas;
