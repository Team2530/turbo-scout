import { Image } from "@mantine/core"
import { modals } from "@mantine/modals";
import React from "react";
import { Suspense } from "react"

export function TurboImage(props: {
    src: string | null | undefined,
    w?: number
}) {

    const [data, setData] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        fetch(`/api/image/${props.src}`).then(resp => resp.json()).then(setData);
    }, [props.src, setData]);

    const showPopup = () => {
        modals.open({
            title: "Image viewer",
            size: "xl",
            children: <Image src={data} width="100%" alt="" />
        })
    };

    return <Suspense>
        {data ? <Image src={data} w={props.w} onClick={showPopup} alt="" /> : <p>Loading image...</p>}
    </Suspense>
}