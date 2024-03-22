import { Center, Checkbox, MultiSelect, NumberInput, Rating, SegmentedControl, Select, TagsInput, TextInput, Textarea } from "@mantine/core";

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
 * @param props The props for this element.
 * @returns 
 */
export function FormComponent(props: FormComponentProps) {
    switch (props.type) {
        case "boolean":
        case "checkbox":
            return <div><p>{props.title}</p><SegmentedControl data={["Don't know", "Yes", "No"]}/></div>;
            // return <Checkbox label={props.title} style={{ fontWeight: '500' }} labelPosition="left" onChange={(e: any) => props.setterFunction(e.currentTarget.checked)} />
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
                return <NumberInput label={`${props.title} (${props.options.unit})`} onChange={(e) => props.setterFunction(e)} />
            }
            return <NumberInput label={props.title} onChange={(e) => props.setterFunction(e)} />
        case "select":
        case "singleselect":
        case "dropdown":
            return <Select label={props.title} data={props.options.choices} onChange={(e: any) => props.setterFunction(e)} />
        case "multiselect":
        case "multidropdown":
            return <MultiSelect label={props.title} data={props.options.choices} onChange={(e) => props.setterFunction(e)} />
        case "photo":
        case "image":
            return <p>Photo input is not yet supported!</p>;
        case "rating":
        case "stars":
            return <Center>{props.title}<br /><Rating size="lg" color="rgba(125, 200, 52, 1)" onChange={(v) => props.setterFunction(v)} /></Center>;
        case "tags":
        case "taginput":
            return <TagsInput label={props.title} onChange={(v: string[]) => props.setterFunction(v)}/>
        default:
            return <p>Unknown input type &apos;{props.type}&apos;</p>
    }
}