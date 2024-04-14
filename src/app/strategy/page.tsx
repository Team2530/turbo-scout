"use client"

import { useEffect, useRef, useState } from "react";

export default function StrategyPage() {
    
    const containerRef = useRef<HTMLDivElement>(null)
    const paintRef = useRef<HTMLCanvasElement>(null)
    const cursorRef = useRef<HTMLCanvasElement>(null)

    var painting = false

    var lazyX = -1
    var lazyY = -1

    // distance from the cursor before the brush begins to move, in canvas scale
    const laziness = 10

    const brushDiameter = 10
    const brushColor = "white"

    function handleDraw(container:any, paintCanvas: any, paintContext: any, cursorCanvas: any, cursorContext: any, event: any) {
        // scale html coords to canvas coords
        const x = (event.clientX - container.offsetLeft) * (paintCanvas.width / paintCanvas.getBoundingClientRect().width)
        const y = (document.documentElement.scrollTop + event.clientY - container.offsetTop) * (paintCanvas.height / paintCanvas.getBoundingClientRect().height)
        
        // apply laziness
        const xDistance = lazyX - x
        const yDistance = lazyY - y
        if (Math.sqrt(Math.abs(xDistance)**2 + Math.abs(yDistance)**2) > laziness) {
            const angle = Math.atan2(yDistance, xDistance) 
            lazyX -= (xDistance - (Math.cos(angle) * laziness))
            lazyY -= (yDistance - (Math.sin(angle) * laziness))
            
            // clear cursor
            cursorContext.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        
            // draw brush
            cursorContext.fillStyle = "rgb(255,0,0)"; 
            cursorContext.beginPath();
            cursorContext.arc(lazyX, lazyY, brushDiameter, 0, Math.PI * 2)
            cursorContext.fill();
            // draw laziness radius
            cursorContext.beginPath();
            cursorContext.arc(lazyX, lazyY, laziness, 0, Math.PI * 2)
            cursorContext.stroke(); 
        }
        if (painting) {
            paintContext.beginPath()
            paintContext.arc(lazyX,lazyY, brushDiameter, 0, Math.PI * 2)
            paintContext.fill()
        } 
    }

    useEffect(() => {
        const container = containerRef.current
        const paintCanvas = paintRef.current
        const paintContext = paintCanvas?.getContext("2d")
        const cursorCanvas = cursorRef.current
        const cursorContext = cursorCanvas?.getContext("2d")
        if (container && paintCanvas && paintContext && cursorCanvas && cursorContext) {
            // initial set of scale
            paintCanvas.width = paintCanvas.getBoundingClientRect().width
            paintCanvas.height = paintCanvas.getBoundingClientRect().height
            cursorCanvas.width = cursorCanvas.getBoundingClientRect().width
            cursorCanvas.height = cursorCanvas.getBoundingClientRect().height
            // add draw event listener  
            container.addEventListener("mousemove", (event: any) => handleDraw(container, paintCanvas, paintContext, cursorCanvas, cursorContext, event))
            document.addEventListener("mousedown", () => {painting = true})
            document.addEventListener("mouseup", () => {painting =  false})
        }
    }, [handleDraw])

    return <div ref={containerRef} style={{position: "relative", width:"100%", maxWidth:"75vw", aspectRatio:"16/9"}}>
        <canvas ref={paintRef} style={{border:"solid red 2px", width:"100%", height: "100%", position:"absolute", top:"0px", left:"0px", zIndex:0}} /> 
        <canvas ref={cursorRef} style={{border:"solid green 1px", width:"100%", height:"100%", padding:"1px", position:"absolute", top:"0px", left:"0px", zIndex:1}} />
    </div>
}