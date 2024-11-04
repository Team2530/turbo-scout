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

    const profileDisplay = configuration && <Stack align="center">
        <Text>Welcome to Turbo Scout, {configuration.profile}</Text>
        <Button onClick={() => setConfiguration(undefined)}>Sign out</Button>
        <TurboTerminal profile={configuration.profile} />
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
        <Container size="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
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
 * TODO: fix text overflow issues
 */
function TurboTerminal(props: { profile: string }) {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const inputRef = useRef<string>('');

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
                    background: '#000000',
                    foreground: '#FFFFFF',
                },
            });
            terminalInstance.current.open(container);

            terminalInstance.current.resize(cols, rows); // Resize to new dimensions

            neofetchEsque();
            printPromptString();

            //TODO: implement more common control codes: CTRL-C, CTRL-D, HOME, END, UP/DOWN arrows, etc.
            terminalInstance.current.onData((e) => {
                switch (e) {
                    case '\r':
                        handleCommand(inputRef.current);
                        inputRef.current = '';
                        break;
                    case '\u007F':
                        if (inputRef.current.length > 0) {
                            inputRef.current = inputRef.current.slice(0, -1);
                            terminalInstance.current?.write('\b \b');
                        }
                        break;
                    case '\u000C': // CTRL-L
                        handleCommand("clear");
                        break;
                    default:
                        inputRef.current += e;
                        terminalInstance.current?.write(e);
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
        terminalInstance.current?.write("\r\n");

        const lCommand = command.toLowerCase().trim();

        const commandBase = lCommand.split(" ")[0];
        const commandArgs = lCommand.split(" ").slice(1).join(" ");

        switch (commandBase) {
            case "": // Empty command
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
                terminalInstance.current?.writeln("NOTE: The command system is not mature enough yet to have a proper help system. The currently implemented commands are neofetch, clear, and echo.");
                break;
            default:
                terminalInstance.current?.writeln(`Command '${commandBase}' not found!`);
                break;
        }
        printPromptString();
    };

    /**
     * Displays a neofetch-like ASCII thing
     */
    const neofetchEsque = () => {
        const os = navigator.platform;
        const browser = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const language = navigator.language;
        const currentTime = new Date().toLocaleString();

        const wrapText = (text: string, maxWidth: number) => {
            if (text.length > maxWidth) {
                return text.slice(0, maxWidth - 3) + '...';
            }
            const words = text.split(' ');
            let wrappedText = '';
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxWidth) {
                    wrappedText += currentLine + '\r\n';
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });

            return wrappedText + currentLine;
        };

        //TODO: add color and display more information
        terminalInstance.current?.write(`            ////////////////////////////////      ////////// username@team2530\r\n`);
        terminalInstance.current?.write(`            ///////////////////////////////      /////////// =================\r\n`);
        terminalInstance.current?.write(`            //////////////////////////////      //////////// \x1B[92mOperating System:\x1B[0m ${os}\r\n`);
        terminalInstance.current?.write(`            /////////////////////////////      ///////////// \x1B[92mBrowser:\x1B[0m ${wrapText(browser, 50)}\r\n`);
        terminalInstance.current?.write(`            ////////////////////////////      ////////////// \x1B[92mScreen Resolution:\x1B[0m ${screenWidth}x${screenHeight}\r\n`);
        terminalInstance.current?.write(`            ///////////////////////////      /////////////// \x1B[92mLanguage:\x1B[0m ${language}\r\n`);
        terminalInstance.current?.write(`            //////////////////////////      //////////////// \x1B[92mCurrent Time:\x1B[0m ${currentTime}\r\n`);
        terminalInstance.current?.write(`            ///////////                           //////////\r\n`);
        terminalInstance.current?.write(`            ///////////                           //////////\r\n`);
        terminalInstance.current?.write(`            ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`            ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`            ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`            ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(` //////////////////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`  /////////////////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`    ///////////////////                           //////////\r\n`);
        terminalInstance.current?.write(`     //////////////////                           //////////\r\n`);
        terminalInstance.current?.write(`        ///////////////                           //////////\r\n`);
        terminalInstance.current?.write("\r\n");
    };

    return <div
        id="terminal"
        ref={terminalRef}
        style={{ height: '1000px', width: '1200px', margin: '60px 0 -300px 0' }}
    />
}