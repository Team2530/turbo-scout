import { Image, useMantineColorScheme } from "@mantine/core";

export default function LogoComponent() {
    const { colorScheme } = useMantineColorScheme();

    return <Image
        src={`logos/${(colorScheme == "dark") ? "white" : "black"}.png`}
        w={30}
        alt="Inconceivable logo" />
}