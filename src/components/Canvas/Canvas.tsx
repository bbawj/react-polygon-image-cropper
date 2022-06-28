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
  proximity?: number;
  cropRef?: React.RefObject<HTMLElement>;
  resetRef?: React.RefObject<HTMLElement>;
  rescaleRef?: React.RefObject<HTMLElement>;
  saveProps?: SaveProps;
  styles?: React.CSSProperties;
}

export const Canvas = ({
  width,
  height,
  source,
  radius,
  color,
  proximity,
  cropRef,
  resetRef,
  rescaleRef,
  saveProps,
  styles,
}: CanvasProps) => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [handles, setHandles] = useState<Array<HandleProps>>([]);
  const [draggable, setDraggable] = useState(true);
  const [cropped, setCropped] = useState(false);
  const [scaled, setScaled] = useState(false);

  useEffect(() => {
    const handleCrop = () => {
      cropImage(imageCanvasRef, cropCanvasRef, handles);
      setDraggable(false);
      setCropped(true);
    };
    if (cropRef && cropRef.current) {
      cropRef.current.addEventListener('click', handleCrop);
    }
    return () => cropRef?.current?.removeEventListener('click', handleCrop);
  }, [cropRef, handles]);

  useEffect(() => {
    const handleReset = () => {
      clearCanvas(cropCanvasRef);
      clearCanvas(finalCanvasRef);
      setHandles([]);
      setCropped(false);
      setDraggable(true);
      setScaled(false);
    };
    if (resetRef && resetRef.current) {
      resetRef.current.addEventListener('click', handleReset);
    }
    return () => resetRef?.current?.removeEventListener('click', handleReset);
  }, [resetRef]);

  useEffect(() => {
    const handleScale = () => {
      if (!scaled) {
        redrawCropped(handles, cropCanvasRef, finalCanvasRef);
        setHandles([]);
        setScaled(true);
      }
    };
    if (rescaleRef && rescaleRef.current) {
      rescaleRef.current.addEventListener('click', handleScale);
    }
    return () => rescaleRef?.current?.removeEventListener('click', handleScale);
  }, [rescaleRef, handles, scaled]);

  useEffect(() => {
    if (saveProps) {
      const saveRef = saveProps.saveRef;
      const handleSave = () => {
        const imageUrl = finalCanvasRef.current?.toDataURL();
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
    if (canvas !== null) {
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      const image = new Image();
      image.onload = function () {
        context!.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      };
      image.src = source;
    }

    const handleCanvas = cropCanvasRef.current;
    if (handleCanvas !== null) {
      handleCanvas.width = width;
      handleCanvas.height = height;
    }
  }, []);

  useEffect(() => {
    const handleCanvas = cropCanvasRef.current;
    if (handleCanvas !== null) {
      const handleContext = handleCanvas.getContext('2d');
      handleContext!.clearRect(0, 0, handleCanvas.width, handleCanvas.height);
      handles.forEach((_, idx) => drawLine(handles, idx, handleContext));
    }
  }, [handles]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const cropCanvas = cropCanvasRef.current;
    const rect = cropCanvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!checkProximity(handles, { x: x, y: y }, proximity || 0) && !cropped) {
      setHandles((prev) => [
        ...prev,
        { x: x, y: y, radius: radius, color: color },
      ]);
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
        hidden={cropped}
        className="react-polygon-image-canvas"
        ref={imageCanvasRef}
      />
      <canvas
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
