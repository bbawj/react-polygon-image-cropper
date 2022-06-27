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
}
export const Handle = ({
  idx,
  updateHandles,
  draggable,
  x,
  y,
  radius,
  color,
}: ComponentProps) => {
  const [center, setCenter] = useState({
    x: x - radius / 2,
    y: y - radius / 2,
  });

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateHandles(idx, e.clientX, e.clientY);
    setCenter({ x: e.clientX - radius / 2, y: e.clientY - radius / 2 });
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateHandles(idx, e.clientX, e.clientY);
    setCenter({ x: e.clientX - radius / 2, y: e.clientY - radius / 2 });
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
