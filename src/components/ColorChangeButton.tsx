import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ColorChangeButton() {
    const { setColorScheme, colorScheme } = useMantineColorScheme();

    return <ActionIcon onClick={() => {
        switch (colorScheme) {
            case "dark":
                setColorScheme("light");
                break;
            case "light":
                setColorScheme("dark");
                break;
            default:
                setColorScheme("light");
                break;
        }
    }}
        variant="default"
        aria-label="Theme Toggle"
        size="md"
    >
        {(colorScheme && colorScheme == 'dark') ? (<IconSun />) : (<IconMoon />)}
    </ActionIcon>
}