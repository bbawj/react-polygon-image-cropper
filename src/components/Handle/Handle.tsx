import React, { useRef, useState } from 'react';
import './Handle.css';

export interface HandleProps {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface ComponentProps extends HandleProps {
  idx: number;
  updateHandles: (idx: number, x: number, y: number) => void;
  draggable: boolean;
  cropCanvasRef: React.RefObject<HTMLCanvasElement>;
}
export const Handle = ({
  idx,
  updateHandles,
  draggable,
  cropCanvasRef,
  x,
  y,
  radius,
  color,
}: ComponentProps) => {
  const [center, setCenter] = useState({
    x: x - radius / 2,
    y: y - radius / 2,
  });

  const calculateNewHandlePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cropCanvasRef?.current?.getBoundingClientRect();
    let newX = e.clientX;
    let newY = e.clientY;
    if (rect) {
      newX -= rect.left;
      newY -= rect.top;
    }
    updateHandles(idx, newX, newY);
    setCenter({ x: newX - radius / 2, y: newY - radius / 2 });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    calculateNewHandlePosition(e);
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    calculateNewHandlePosition(e);
  };

  return (
    <div
      draggable={`${draggable}`}
      onDrag={handleDrag}
      onDragStart={(e) => !draggable && e.preventDefault()}
      onDragEnd={handleDragEnd}
      className="handle"
      style={{
        top: center.y,
        left: center.x,
        width: radius,
        height: radius,
        backgroundColor: color,
      }}></div>
  );
};
