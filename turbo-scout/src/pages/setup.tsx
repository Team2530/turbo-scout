import { Button, Container, Select, Stack, Text, Image } from "@mantine/core";
import { BaseLayout } from "../layout";
import { IconUserCircle } from '@tabler/icons-react';
import EVENT from "../config/event.json";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { Terminal } from 'xterm';
import { useRef, useEffect } from 'react';

import 'xterm/css/xterm.css';

export interface Configuration {
    profile: string;
}

export default function SetupPage() {

    const [configuration, setConfiguration] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    const form = useForm({
        mode: "uncontrolled"
    });

    const isMobile = window.innerWidth <= 768; // Check if the user is on mobile

    const profileDisplay = configuration && <Stack align="center">
        <Text>Welcome to Turbo Scout, {configuration.profile}</Text>
        <Button onClick={() => setConfiguration(undefined)}>Sign out</Button>
        {!isMobile && <TurboTerminal profile={configuration.profile} />} 
    </Stack>

    const setupForm = <Stack>
        <Text ta="center">Turbo-Scout Setup</Text>

        {/* TODO: scout groups and other configuration options */}
        <Select
            label="Select Profile"
            leftSection={<IconUserCircle />}
            data={EVENT.scouters}
            searchable
            {...form.getInputProps("profile")}
        />

        <Button onClick={() => setConfiguration({ profile: form.getValues()['profile'] })}>Save</Button>
    </Stack>


    return <BaseLayout>
        <Container size="sm" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            height: '100vh', 
            marginTop: isMobile ? '-250px' : '0' // Adjust margin for mobile users
        }}>
            {configuration ? profileDisplay : setupForm}
            <Stack align="center" mt="md">
                <Stack align="center" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                    <a href="https://github.com/Team2530/turbo-scout" target="_blank" rel="noopener noreferrer">
                        <Image src="github.svg" alt="GitHub Logo" width={100} height={100} />
                    </a>
                    <a href="https://frcteam2530.org" target="_blank" rel="noopener noreferrer">
                        <Image src="logo.svg" alt="FRC Team 2530 Logo" width={120} height={120} />
                    </a>
                </Stack>
            </Stack>
        </Container>
    </BaseLayout>
}

/**
 * A browser-based terminal created using XTermJS. 
 * 
 * This is just for fun, it has no real purpose.
 * 
 * TODO: fix text overflow issues, make an alternative for mobile
 */
function TurboTerminal(props: { profile: string }) {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const inputRef = useRef<string>('');
    const hasFetched = useRef<boolean>(false); // Flag to track if neofetchEsque has been called

    /**
     * Prints the prompt string. This is the same as the $PS1 variable in bash. 
     */
    const printPromptString = () => {
        terminalInstance.current?.write(`\x1B[92m${props.profile.replace(" ", "-").replace(".", "").toLowerCase()}@turbo-scout\x1B[0m $ `);
    }

    useEffect(() => {
        if (terminalRef.current && !terminalInstance.current) {
            const container = terminalRef.current;
            const height = container.clientHeight;

            const cols = 150;
            const rows = Math.floor(height / 24);

            terminalInstance.current = new Terminal({
                cols: cols,
                rows: rows,
                fontSize: 15,
                theme: {
                    background: '#180024',
                    foreground: '#FFFFFF',
                },
            });
            terminalInstance.current.open(container);

            // Call neofetchEsque only once
            if (!hasFetched.current) { // If neofetchEsque has not been called yet
                neofetchEsque();
                hasFetched.current = true; // Set the flag to true after calling
            }
            printPromptString();

            //TODO: implement more common control codes: CTRL-C, CTRL-D, HOME, END, UP/DOWN arrows, etc.
            terminalInstance.current.onData((e: any) => {
                switch (e) {
                    case '\r': // Enter key
                        handleCommand(inputRef.current);
                        inputRef.current = '';
                        break;
                    case '\u007F': // Backspace key
                        if (inputRef.current.length > 0) { // If there is something to delete
                            inputRef.current = inputRef.current.slice(0, -1); // Remove last character
                            terminalInstance.current?.write('\b \b'); // Erase last character
                        }
                        break;
                    case '\u000C': // CTRL-L
                        handleCommand("clear");
                        break;
                    default:
                        inputRef.current += e; // Add the character to the input
                        terminalInstance.current?.write(e); // Write the character to the terminal
                }
            });

            return () => {
                terminalInstance.current?.dispose();
                terminalInstance.current = null;
            };
        }
    }, []);

    //TODO: implement more common UNIX commands
    const handleCommand = (command: string) => {
        terminalInstance.current?.write("\r\n"); // Newline

        const lCommand = command.toLowerCase().trim(); // Lowercase and trim

        const commandBase = lCommand.split(" ")[0]; // The command itself, e.g. "neofetch"
        const commandArgs = lCommand.split(" ").slice(1).join(" "); // The arguments, e.g. "clear"

        switch (commandBase) {
            case "": // Empty commands
            case " ":
                break;
            case 'neofetch':
                neofetchEsque();
                break;
            case 'clear':
            case 'cls':
                terminalInstance.current?.clear();
                break;
            case 'echo':
                terminalInstance.current?.writeln(commandArgs);
                break;
            case 'help':
                terminalInstance.current?.writeln("NOTE: The command system is not mature enough yet to have a proper help system.");
                terminalInstance.current?.writeln("The currently implemented commands are neofetch, clear, and echo.");
                break;
            default:
                terminalInstance.current?.writeln(`Command '${commandBase}' not found!`);
                break;
        }
        printPromptString();
    };

    /**
     * Displays a neofetch-like ASCII thingy
     */
    const neofetchEsque = () => {
        const os = navigator.platform;
        const browser = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const language = navigator.language;
        const currentTime = new Date().toLocaleString();
        let batteryStatus = '';
        let batteryIsCharging = false;
        let batteryLevel = -1;

        navigator.getBattery().then((battery: { charging: boolean; level: number; addEventListener: (arg0: string, arg1: () => void) => void; }) => {
            batteryIsCharging = battery.charging;
            batteryStatus = batteryIsCharging ? ' is ' : ' is not ';
            batteryLevel = battery.level * 100;

            // Remove previous event listener to prevent multiple triggers
            const updateBatteryStatus = () => {
                batteryIsCharging = battery.charging;
                batteryStatus = batteryIsCharging ? ' is ' : ' is not ';
                terminalInstance.current?.clear();
                updateTerminalDisplay();
            };

            battery.addEventListener("chargingchange", updateBatteryStatus);
            terminalInstance.current?.clear();
            updateTerminalDisplay();
        });

        const username = props.profile.replace(" ", "-").replace(".", "").toLowerCase();
        let lenBlocker = username.length;
        let blocker = "=".repeat(lenBlocker+9); // To account for the "@Team2530"

        const wrapText = (text: string, maxWidth: number) => {
            if (text.length > maxWidth) {
                return text.slice(0, maxWidth - 3) + '...'; // Truncate the text if it goes past the max width
            }
            const words = text.split(' ');
            let wrappedText = '';
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxWidth) {
                    wrappedText += currentLine + '\r\n'; // Add the current line to the wrapped text and start a new line
                    currentLine = word + ' '; // Start the next line with the current word
                } else {
                    currentLine += word + ' ';
                }
            });

            return wrappedText + currentLine;
        };

        const updateTerminalDisplay = () => {
            terminalInstance.current?.write(`\r\n\x1B[92m                ////////////////////////////////      ////////// \x1B[0m\x1b[31m${username}@Team2530\x1B[0m\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////////////////////////      /////////// ${blocker}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                //////////////////////////////      //////////// \x1B[0m\x1b[31mOperating System:\x1B[0m ${os}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                /////////////////////////////      ///////////// \x1B[0m\x1b[31mBrowser:\x1B[0m ${wrapText(browser, 50)}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ////////////////////////////      ////////////// \x1B[0m\x1b[31mScreen Resolution:\x1B[0m ${screenWidth}x${screenHeight}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////////////////////      /////////////// \x1B[0m\x1b[31mLanguage:\x1B[0m ${language}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                //////////////////////////      //////////////// \x1B[0m\x1b[31mCurrent Date/Time:\x1B[0m ${currentTime}\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////                           ////////// \x1B[0m\x1b[31mBattery${batteryStatus}charging\x1B[0m @ ${batteryLevel}%\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////                           //////////\r\n`); // \x1B[92m test \x1B[0m starts and ends green text (31m is red)
            terminalInstance.current?.write(`\x1B[92m                ///////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m                ///////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m     //////////////////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m      /////////////////////      //////////////       //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m       ////////////////////                           //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m         //////////////////                           //////////\r\n`);
            terminalInstance.current?.write(`\x1B[92m          /////////////////                           //////////\r\n`);
            terminalInstance.current?.write("\r\n");
            printPromptString();
        };
        
    };

    return <div
        id="terminal"
        ref={terminalRef}
        style={{ height: '1000px', width: '1200px', margin: '60px 0 -300px 0' }}
    />
}