"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { TurboContext } from "../lib/context";
import { Select, Stack, TextInput, Text, Slider, ColorInput, Button } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useTBA } from "../lib/tba_api";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function StrategyPage() {
    const { addToSendQueue, username, currentEvent, editables } = useContext(TurboContext);
    const [currentStrategy, setCurrentStrategy] = useState<string>("New Strategy");
    const [brushSize, setBrushSize] = useState<number>(10);
    const [brushColor, setBrushColor] = useState<string>("#ffffff")
    const [strokes, setStrokes] = useState<paintStroke[]>([])

    const editor = useEditor({
        extensions: [StarterKit],
    });

    function saveData() {
        addToSendQueue!({
            type: "strategy",
            user: username!,
            name: currentStrategy,
            event: currentEvent,
            timestamp: new Date().toISOString,
            data: {
                drawing: strokes,
                note: {
                    text: editor?.getText(),
                    json: editor?.getJSON(),
                    html: editor?.getHTML(),
                },
            },
        });

        setStrokes([])
        setCurrentStrategy("New Strategy");
        editor!.commands.clearContent();
    }

    function handleStrategyChange(x: string | null) {
        setCurrentStrategy(x ? x : "New Strategy");
    }

    return (
        <Stack>
            <Select
                searchable
                label="Select a stategy to edit"
                value={currentStrategy}
                onChange={handleStrategyChange}
                data={editables
                    ?.filter((item: any) => item.type == "strategy")
                    .map((item: any) => {
                        return {
                            value: item.name,
                            label: item.name,
                        };
                    })
                    .concat([
                        {
                            value: "New Strategy",
                            label: "New Strategy",
                        },
                    ])}
            />
            <TextInput
                label="Strategy Name"
                value={currentStrategy}
                onChange={(x: any) => setCurrentStrategy(x.target.value)}
            />

            <ColorInput
                label="Brush Color"
                value={brushColor}
                onChangeEnd={setBrushColor}
            />
            <Text mt="xs">Brush Size</Text>
            <Slider
                color="#7dc834"
                size="lg"
                value={brushSize}
                onChangeEnd={setBrushSize}
            />
            <Canvas
                brushSize={brushSize}
                brushColor={brushColor}
                strokes={strokes}
                addStroke={(stroke: paintStroke) => setStrokes([...strokes, stroke])}
            />

            <BasicRichTextEditor editor={editor} />

            <Button onClick={saveData}>Save</Button>
        </Stack>
    );
}


type paintStroke = {
    brushSize: number,
    brushColor: string,
    points: {
        x: number,
        y: number
    }[]
}

function Canvas({
    brushSize,
    brushColor,
    strokes,
    addStroke,
}: {
        brushSize: number;
        brushColor: string;
        strokes: paintStroke[];
        addStroke: Function;
    }) {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const paintRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLCanvasElement>(null);

    var painting = false;

    // distance from the cursor before the brush begins to move, in canvas scale
    const laziness = 10;
    
    var lazyX = -1;
    var lazyY = -1;

    // distance from last painted point before another is painted
    var quality = 20;

    var lastX = -1;
    var lastY = -1;

    var currentStroke: paintStroke | undefined;

    function handleDraw(
        container: any,
        paintCanvas: any,
        paintContext: any,
        cursorCanvas: any,
        cursorContext: any,
        event: any
    ) {  
        // scale html coords to canvas coords
        const x =
            (event.clientX - container.offsetLeft) *
            (paintCanvas.width / paintCanvas.getBoundingClientRect().width);
        const y =
            (document.documentElement.scrollTop +
                event.clientY -
                container.offsetTop) *
            (paintCanvas.height / paintCanvas.getBoundingClientRect().height);

        const xDistance = lazyX - x;
        const yDistance = lazyY - y;
        
        // apply laziness
        if (Math.sqrt(Math.abs(xDistance) ** 2 + Math.abs(yDistance) ** 2) > laziness) {
            const angle = Math.atan2(yDistance, xDistance);
            lazyX -= xDistance - Math.cos(angle) * laziness;
            lazyY -= yDistance - Math.sin(angle) * laziness;

            // clear cursor
            cursorContext.clearRect(
                0,
                0,
                paintCanvas.width,
                paintCanvas.height
            );

            // draw brush
            cursorContext.fillStyle = brushColor;
            cursorContext.beginPath();
            cursorContext.arc(lazyX, lazyY, brushSize, 0, Math.PI * 2);
            cursorContext.fill();
            // draw laziness radius
            cursorContext.beginPath();
            cursorContext.arc(lazyX, lazyY, laziness, 0, Math.PI * 2);
            cursorContext.stroke();
        }

        if (painting) {
            // apply quality
            if (Math.sqrt((lazyX - lastX) ** 2 + (lazyY - lastY) ** 2) > quality) {
                lastX = lazyX;
                lastY = lazyY;
                paintContext.fillStyle = brushColor;
                paintContext.beginPath();
                paintContext.arc(lazyX, lazyY, brushSize, 0, Math.PI * 2);
                paintContext.fill();
                
                if (currentStroke) {
                    currentStroke.points.push({
                        x: lazyX,
                        y: lazyY
                    }); 
                } else {
                    currentStroke = {
                        brushSize: brushSize,
                        brushColor: brushColor,
                        points: [
                            {
                                x: lazyX,
                                y: lazyY
                            }
                        ]
                    }
                }
            }    
        } else if (currentStroke) {
            // close stroke  
            addStroke(currentStroke)
            currentStroke = undefined;
        }
    }

    useEffect(() => {
        const container = containerRef.current;
        const paintCanvas = paintRef.current;
        const paintContext = paintCanvas?.getContext("2d");
        const cursorCanvas = cursorRef.current;
        const cursorContext = cursorCanvas?.getContext("2d");
        if (
            container &&
            paintCanvas &&
            paintContext &&
            cursorCanvas &&
            cursorContext
        ) {
            // initial set of scale
            paintCanvas.width = paintCanvas.getBoundingClientRect().width;
            paintCanvas.height = paintCanvas.getBoundingClientRect().height;
            cursorCanvas.width = cursorCanvas.getBoundingClientRect().width;
            cursorCanvas.height = cursorCanvas.getBoundingClientRect().height;
            // add draw event listener
            container.addEventListener("mousemove", (event: any) =>
                handleDraw(
                    container,
                    paintCanvas,
                    paintContext,
                    cursorCanvas,
                    cursorContext,
                    event
                )
            );
            // if leaves canvas
            container.addEventListener("mouseout", (event: any) => {
                // close stroke 
                if (currentStroke) {                    
                    addStroke(currentStroke)
                    currentStroke = undefined;
                }
            })
            // mouse tracking
            document.addEventListener("mousedown", () => {
                painting = true;
            });
            document.addEventListener("mouseup", () => {
                painting = false;
            });
        }
    }, [handleDraw]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "75vw",
                aspectRatio: "16/9",
                alignSelf: "center"
            }}
        >
            <canvas
                ref={paintRef}
                style={{
                    border: "solid red 2px",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    zIndex: 0,
                }}
            />
            <canvas
                ref={cursorRef}
                style={{
                    border: "solid green 1px",
                    width: "100%",
                    height: "100%",
                    padding: "1px",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    zIndex: 1,
                }}
            />
        </div>
    );
}


function BasicRichTextEditor(props: { editor: Editor | null }) {
    return (
        <RichTextEditor editor={props.editor}>
            <RichTextEditor.Toolbar
                sticky
                stickyOffset={60}
            >
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
        </RichTextEditor>
    );
}
