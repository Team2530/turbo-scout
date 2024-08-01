import { useLocalStorage } from "@mantine/hooks";
import { BaseLayout } from "./Layout";
import { useForm } from "@mantine/form";

export default function PitPage() {
    const [data, setData] = useLocalStorage({ key: "data", defaultValue: [] });

    return <BaseLayout>
        <p>Pit scouting</p>
    </BaseLayout>
}

function FormComponent() {
    return <p>Field item</p>
}