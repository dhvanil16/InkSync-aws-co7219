'use client'
import { useEffect, useLayoutEffect } from 'react'
import rough from 'roughjs/bundled/rough.esm.js'
import { useState } from 'react'



const generator = rough.generator();
const Board = ({ canvasRef,
    ctx,
    color,
    setElements,
    elements,
    tool,
    canvasColor,
    strokeWidth,
    socket, }) => {
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        // canvas.style.width = `${window.innerWidth}px`;
        // canvas.style.height = `${window.innerHeight}px`;
        const context = canvas.getContext("2d");

        context.strokeWidth = strokeWidth;
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = 5;
        ctx.current = context;
    }, []);
    useLayoutEffect(() => {
        const roughCanvas = rough.canvas(canvasRef.current);
        if (elements.length > 0) {
            ctx.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
        }
        elements.forEach((ele, i) => {
            if (ele.element === "rect") {
                roughCanvas.draw(
                    generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: strokeWidth
                    })
                );
            } else if (ele.element === "line") {
                roughCanvas.draw(
                    generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: strokeWidth,
                    })
                );
            } else if (ele.element === "pencil") {
                roughCanvas.linearPath(ele.path, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: strokeWidth,
                });
            }
            else if (ele.element === "circle") {
                roughCanvas.draw(
                    generator.ellipse(ele.offsetX, ele.offsetY, ele.width, ele.height, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: strokeWidth,
                    })
                );
            }
        });

    }, [elements]);



    const handleMouseDown = (e) => {
        let offsetX;
        let offsetY;
        if (e.touches) {
            // Touch event
            var bcr = e.target.getBoundingClientRect();
            offsetX = e.targetTouches[0].clientX - bcr.x;
            offsetY = e.targetTouches[0].clientY - bcr.y;
        } else {
            // Mouse event
            offsetX = e.nativeEvent.offsetX;
            offsetY = e.nativeEvent.offsetY;
        }


        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                    element: tool,
                },
            ]);
        } else {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, stroke: color, element: tool },
            ]);
        }

        setIsDrawing(true);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) {
            return;
        }
        let offsetX;
        let offsetY;
        if (e.touches) {
            // Touch event
            var bcr = e.target.getBoundingClientRect();
            offsetX = e.targetTouches[0].clientX - bcr.x;
            offsetY = e.targetTouches[0].clientY - bcr.y;
        } else {
            // Mouse event
            offsetX = e.nativeEvent.offsetX;
            offsetY = e.nativeEvent.offsetY;
        }

        if (tool === "rect") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: offsetX - ele.offsetX,
                            height: offsetY - ele.offsetY,
                            stroke: ele.stroke,
                            element: ele.element,
                        }
                        : ele
                )
            );
        } else if (tool === "line") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: offsetX,
                            height: offsetY,
                            stroke: ele.stroke,
                            element: ele.element,
                        }
                        : ele
                )
            );
        } else if (tool === "pencil") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            path: [...ele.path, [offsetX, offsetY]],
                            stroke: ele.stroke,
                            element: ele.element,
                        }
                        : ele
                )
            );
        }
        else if (tool === "circle") {
            const radius = Math.sqrt(
                Math.pow(offsetX - elements[elements.length - 1].offsetX, 2) +
                Math.pow(offsetY - elements[elements.length - 1].offsetY, 2)
            );
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: 2 * radius,
                            height: 2 * radius,
                            stroke: ele.stroke,
                            element: ele.element,
                        }
                        : ele
                )
            );
        }
    };


    return (
        <div onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className='absolute top-0 left-0 w-screen h-screen'
        >
            <canvas
                ref={canvasRef}
                className={` absolute border-2 border-black cursor-crosshair  w-screen h-screen`}
                style={{ backgroundColor: canvasColor }}
            />
        </div>
    )
}

export default Board