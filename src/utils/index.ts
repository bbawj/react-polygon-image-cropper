import { HandleProps } from '../components/Handle/Handle';

export function drawLine(handles: Array<HandleProps>, idx: number, ctx: any) {
  ctx.beginPath();
  ctx.moveTo(handles[idx].x, handles[idx].y);
  if (idx === handles.length - 1) {
    ctx.lineTo(handles[0].x, handles[0].y);
  } else {
    ctx.lineTo(handles[idx + 1].x, handles[idx + 1].y);
  }
  ctx.stroke();
}

export function checkProximity(
  handles: Array<HandleProps>,
  handle: { x: number; y: number },
  proximity: number
) {
  const near = handles.filter(
    (pos) =>
      Math.abs(pos.x - handle.x) < proximity &&
      Math.abs(pos.y - handle.y) < proximity
  );
  if (near.length > 0) return true;

  return false;
}

export function cropImage(
  imageCanvasRef: React.RefObject<HTMLCanvasElement>,
  cropCanvasRef: React.RefObject<HTMLCanvasElement>,
  handles: Array<HandleProps>
) {
  if (cropCanvasRef.current && imageCanvasRef.current) {
    const imageCtx = imageCanvasRef.current.getContext('2d');
    const ctx = cropCanvasRef.current.getContext('2d');
    if (ctx && imageCtx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.beginPath();
      handles.forEach((_, idx) => {
        if (idx === handles.length - 1) {
          ctx.lineTo(handles[0].x, handles[0].y);
        } else {
          ctx.lineTo(handles[idx + 1].x, handles[idx + 1].y);
        }
      });
      ctx.clip();
      ctx.drawImage(
        imageCtx.canvas,
        0,
        0,
        imageCtx.canvas.width,
        imageCtx.canvas.height,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      ctx.restore();
    }
  }
}

export function redrawCropped(
  handles: Array<HandleProps>,
  cropCanvasRef: React.RefObject<HTMLCanvasElement>,
  finalCanvasRef: React.RefObject<HTMLCanvasElement>
) {
  if (finalCanvasRef.current && cropCanvasRef.current) {
    const maxWidth = Math.max.apply(
      null,
      handles.map((pos) => pos.x)
    );
    const minWidth = Math.min.apply(
      null,
      handles.map((pos) => pos.x)
    );
    const maxHeight = Math.max.apply(
      null,
      handles.map((pos) => pos.y)
    );
    const minHeight = Math.min.apply(
      null,
      handles.map((pos) => pos.y)
    );
    const finalWidth = maxWidth - minWidth;
    const finalHeight = maxHeight - minHeight;

    const finalCanvas = finalCanvasRef.current;
    const cropCanvas = cropCanvasRef.current;

    finalCanvas.width = finalWidth;
    finalCanvas.height = finalHeight;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx?.drawImage(
      cropCanvas,
      minWidth,
      minHeight,
      finalWidth,
      finalHeight,
      0,
      0,
      finalWidth,
      finalHeight
    );
    clearCanvas(cropCanvasRef);
  }
}

export function clearCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
