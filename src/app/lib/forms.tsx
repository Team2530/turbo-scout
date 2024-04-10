import { ActionIcon, FileInput, Group, MultiSelect, NumberInput, SegmentedControl, Image, Select, Slider, TagsInput, Text, TextInput, Textarea, Stack, Container, SimpleGrid, parseStyleProps } from "@mantine/core";
import { IconDots, IconUpload } from "@tabler/icons-react";
import React from "react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";

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
     * A function that returns the current value.
     */
    getterFunction: Function;

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

    switch (props.type) {
        case "boolean":
        case "checkbox":
            return <Group gap="xs">
                <p>{props.title}</p>
                <SegmentedControl
                    data={["Don't know", "Yes", "No"]}
                    value={props.getterFunction()}
                    onChange={(v: string) => props.setterFunction(v)}
                />
            </Group>;
        case "paragraph":
        case "textarea":
        case "longresponse":
            return <Textarea label={props.title} value={props.getterFunction()} onChange={(e) => props.setterFunction(e.target.value)} />
        case "text":
        case "basic":
        case "line":
            return <TextInput label={props.title} value={props.getterFunction()} onChange={(e) => props.setterFunction(e.target.value)} />
        case "number":
            if (props.options.unit) {
                return <NumberInput
                    label={`${props.title} (${props.options.unit})`}
                    value={props.getterFunction()}
                    onChange={(e) => props.setterFunction(e)}
                    rightSection={<ActionIcon size="lg" onClick={(v) => props.setterFunction((props.getterFunction() || 0) + 1)}>+</ActionIcon>}
                />
            }
            return <NumberInput
                label={`${props.title}`}
                value={props.getterFunction()}
                onChange={(e) => props.setterFunction(e)}
                rightSection={<ActionIcon size="lg" onClick={(v) => props.setterFunction((props.getterFunction() || 0) + 1)}>+</ActionIcon>}
            />
        case "select":
        case "singleselect":
        case "dropdown":
            return <Select
                label={props.title}
                data={props.options.choices}
                value={props.getterFunction()}
                onChange={(e: any) => props.setterFunction(e)}
            />
        case "multiselect":
        case "multidropdown":
            return <MultiSelect
                label={props.title}
                data={props.options.choices}
                value={props.getterFunction()}
                onChange={(e) => props.setterFunction(e)}
                rightSection={<IconDots />}
            />
        case "photo":
        case "image":
            return <ImageUpload label={props.title} images={props.getterFunction()} setImages={(images: string[]) => props.setterFunction(images)} />
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
                    value={props.getterFunction()}
                    onChange={(v) => props.setterFunction(v)}
                />
            </>;
        case "tags":
        case "taginput":
            return <>
                <p>{props.title}</p>
                <TagsInput label={props.title} value={props.getterFunction()} onChange={(v: string[]) => props.setterFunction(v)} />
            </>
        default:
            return <p>Unknown input type &apos;{props.type}&apos;</p>
    }
}

function ImageUpload(props: {
    label: string,
    images: string[] | undefined,
    setImages: Function
}) {

    //TODO: put these in a fancy-looking carousel element instead of a grid.
    //TODO: add a way to remove photos

    const previews = props.images && props.images.map((image: string, index: number) => {
        return <Image key={index} src={image} width="250" height="250" w={250} h={250} alt="Preview image" />;
    });

    const addImages = (files: FileWithPath[]) => {
        return files.map((file: FileWithPath) => {
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                // console.log(event.target?.result);

                props.setImages(props.images ? [
                    ...props.images,
                    event.target?.result as string
                ] : [event.target?.result as string]);

            };
            fileReader.readAsDataURL(file!);
        });
    };

    return <Stack>
        <Text>{props.label}</Text>
        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={addImages}>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <IconUpload />
                <Text size="xl" inline>
                    Upload or take photos
                </Text>
            </Group>
        </Dropzone>
        <Container fluid style={{ backgroundColor: 'Background', borderRadius: '5px' }}>
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} mt={previews && previews.length > 0 ? 'xl' : 0} spacing="0" verticalSpacing="0">
                {previews}
            </SimpleGrid>
        </Container>
    </Stack>
}