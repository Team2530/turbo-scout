import { ActionIcon, Center, FileInput, MultiSelect, NumberInput, Text, Rating, Slider, SegmentedControl, Select, TagsInput, TextInput, Textarea } from "@mantine/core";
import React from "react";
import { IconDots } from "@tabler/icons-react";

/**
 * Form component props
 */
export interface FormComponentProps {
    /**
     * The title/label for a given question or input.
     */
    title: string;

    /**
     * The type of input or question that it is. 
     * See src/app/lib/forms.tsx to see the list of possible values.
     */
    type: string;

    /**
     * A function that is used to set the value. 
     * 
     * Lookup the functional programming concept of 'seeding' functions to use this best.
     * To summarize, you want to build a function that has your state embedded in it.
     */
    setterFunction: Function;

    /**
     * Other options for specific types of inputs
     * 
     * Possible fields:
     *      + choices:  Choices for select or multi-select
     *      + unit:     The unit for a number input
     */
    options: any;
}

/**
 * Form input component
 * 
 * @param props The props for this element.
 * @returns 
 */
export function FormComponent(props: FormComponentProps) {

    // Hidden state that is used if a form component needs to update itself.
    const [_state, _setState] = React.useState(0);
    const setter = (v: any) => {
        _setState(v);
        props.setterFunction(v);
    };

    switch (props.type) {
        case "boolean":
        case "checkbox":
            return <>
                <p>{props.title}</p>
                <SegmentedControl
                    data={["Don't know", "Yes", "No"]}
                    onChange={(v: string) => props.setterFunction(v)}
                />
            </>;
        case "paragraph":
        case "textarea":
        case "longresponse":
            return <Textarea label={props.title} onChange={(e) => props.setterFunction(e.target.value)} />
        case "text":
        case "basic":
        case "line":
            return <TextInput label={props.title} onChange={(e) => props.setterFunction(e.target.value)} />
        case "number":
            if (props.options.unit) {
                return <NumberInput
                    label={`${props.title} (${props.options.unit})`}
                    value={_state}
                    onChange={(e) => setter(e)}
                    rightSection={<ActionIcon size="lg" onClick={(v) => setter(_state + 1)}>+</ActionIcon>}
                />
            }
            return <NumberInput
                label={`${props.title}`}
                value={_state}
                onChange={(e) => setter(e)}
                rightSection={<ActionIcon size="lg" onClick={(v) => setter(_state + 1)}>+</ActionIcon>}
            />
        case "select":
        case "singleselect":
        case "dropdown":
            return <Select
                label={props.title}
                data={props.options.choices}
                onChange={(e: any) => props.setterFunction(e)}
            />
        case "multiselect":
        case "multidropdown":
            return <MultiSelect
                label={props.title}
                data={props.options.choices}
                onChange={(e) => props.setterFunction(e)}
                rightSection={<IconDots />}
            />
        case "photo":
        case "image":
            return <FileInput label={props.title} onChange={async (file: File | null) => {
                const fileReader = new FileReader();
                fileReader.onload = function (event) {
                    console.log(event.target?.result);
                    props.setterFunction(event.target?.result);
                };
                fileReader.readAsDataURL(file!);
            }} />
        case "rating":
        case "stars":
        case "slider":
            return <>
                <Text mt="md">{props.title}</Text>
                <Slider marks={[
                    { value: 25, label: 'Poor' },
                    { value: 50, label: 'Decent' },
                    { value: 75, label: 'Good' }
                ]}
                    labelAlwaysOn defaultValue={0}
                    color="#7dc834" size="xl"
                    onChange={(v) => props.setterFunction(v)}
                />
            </>;
        case "tags":
        case "taginput":
            return <>
                <p>{props.title}</p>
                <TagsInput label={props.title} onChange={(v: string[]) => props.setterFunction(v)} />
            </>
        default:
            return <p>Unknown input type &apos;{props.type}&apos;</p>
    }
}