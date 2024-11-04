import { Button, Container, Select, Stack, Text, Image } from "@mantine/core";
import { BaseLayout } from "../layout";
import { IconUserCircle } from '@tabler/icons-react';
import EVENT from "../config/event.json";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useRef, useEffect } from 'react';

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

    const terminalRef = useRef<HTMLDivElement | null>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const inputRef = useRef<string>('');

    useEffect(() => {
        if (terminalRef.current && !terminalInstance.current) {
            const container = terminalRef.current;
            const width = container.clientWidth; // Get the width of the container
            const height = container.clientHeight; // Get the height of the container

            // Calculate the number of columns and rows based on the terminal font size
            const cols = 150; // Adjusted for larger font size
            const rows = Math.floor(height / 24); // Adjusted for larger font size

            terminalInstance.current = new Terminal({
                cols: cols,
                rows: rows,
                fontSize: 15, // Increased font size for larger terminal
                theme: {
                    background: '#110029', // Set your desired background color here
                    foreground: '#FFFFFF', // Optional: set the foreground color
                },
            });
            terminalInstance.current.open(container);

            // Resize the terminal to the new dimensions
            terminalInstance.current.resize(cols, rows); // Resize to new dimensions

            // Display system info first
            displaySystemInfo(); // Display system info first

            // Add a newline before the TURBO SCOUT message and make it red
            terminalInstance.current.write('\r\n\x1B[31mTURBO SCOUT\x1B[0m $ '); // Made TURBO SCOUT red

            terminalInstance.current.onData((e) => {
                switch (e) {
                    case '\r':
                        handleCommand(inputRef.current);
                        inputRef.current = '';
                        break;
                    case '\u007F':
                        if (inputRef.current.length > 0) {
                            inputRef.current = inputRef.current.slice(0, -1);
                            terminalInstance.current.write('\b \b');
                        }
                        break;
                    default:
                        inputRef.current += e;
                        terminalInstance.current.write(e);
                }
            });

            return () => {
                terminalInstance.current?.dispose();
                terminalInstance.current = null;
            };
        }
    }, []);

    const handleCommand = (command: string) => {
        console.log(`Received command: ${command}`); // Logging for debugging
        switch (command.toLowerCase().trim()) {
            case 'systeminfo':
                displaySystemInfo();
                break;
            case 'clear':
                terminalInstance.current?.clear();
                break;
            default:
                // Replace the message with ASCII art
                terminalInstance.current?.write('\r\n'); // Add a newline before the ASCII art
                terminalInstance.current?.write(`\x1B[32mFRC Team 2530\r\nCommands not yet implemented \r\n\r\n           /////////////////////////////////      //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////////////////////////      ///////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ///////////////////////////////      ////////////\r\n`); // Logo text
                terminalInstance.current?.write(`           //////////////////////////////      /////////////\r\n`); // Logo text
                terminalInstance.current?.write(`           /////////////////////////////      //////////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////////////////////      ///////////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ///////////////////////////      ////////////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////                           //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////                           //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(`           ////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(`///////////////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(` //////////////////////      //////////////       //////////\r\n`); // Logo text
                terminalInstance.current?.write(`   ////////////////////                           //////////\r\n`); // Logo text
                terminalInstance.current?.write(`    ///////////////////                           //////////\r\n`); // Logo text
                terminalInstance.current?.write(`       ////////////////                           //////////\x1B[0m\r\n`); // Reset color
        }
        terminalInstance.current?.write('\r\n> '); // Prompt for the next command
    };

    const displaySystemInfo = () => {
        const os = navigator.platform;
        const browser = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const language = navigator.language;
        const currentTime = new Date().toLocaleString();

        // Function to wrap text to fit within terminal width
        const wrapText = (text: string, maxWidth: number) => {
            if (text.length > maxWidth) {
                return text.slice(0, maxWidth - 3) + '...'; // Truncate and add ellipsis
            }
            const words = text.split(' ');
            let wrappedText = '';
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxWidth) {
                    wrappedText += currentLine + '\r\n'; // Add current line to wrapped text
                    currentLine = word + ' '; // Start a new line with the current word
                } else {
                    currentLine += word + ' '; // Add word to current line
                }
            });

            return wrappedText + currentLine; // Add any remaining text
        };
        terminalInstance.current?.write('PRESENTED BY FRC TEAM 2530\r\n\r\n\r\n'); // Add a newline before the ASCII art
        terminalInstance.current?.write(`           ////////////////////////////////      ////////// \x1B[31mOperating System:\x1B[0m ${os}\r\n`);
        terminalInstance.current?.write(`           ///////////////////////////////      /////////// \x1B[31mBrowser:\x1B[0m ${wrapText(browser, 50)}\r\n`);
        terminalInstance.current?.write(`           //////////////////////////////      //////////// \x1B[31mScreen Resolution:\x1B[0m ${screenWidth}x${screenHeight}\r\n`);
        terminalInstance.current?.write(`           /////////////////////////////      ///////////// \x1B[31mLanguage:\x1B[0m ${language}\r\n`);
        terminalInstance.current?.write(`           ////////////////////////////      ////////////// \x1B[31mCurrent Time:\x1B[0m ${currentTime}\r\n`);
        terminalInstance.current?.write(`           ///////////////////////////      ///////////////\r\n`);
        terminalInstance.current?.write(`           //////////////////////////      ////////////////\r\n`);
        terminalInstance.current?.write(`           ///////////                           //////////\r\n`);
        terminalInstance.current?.write(`           ///////////                           //////////\r\n`);
        terminalInstance.current?.write(`           ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`           ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`           ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`           ///////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`//////////////////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(` /////////////////////      //////////////       //////////\r\n`);
        terminalInstance.current?.write(`   ///////////////////                           //////////\r\n`);
        terminalInstance.current?.write(`    //////////////////                           //////////\r\n`);
        terminalInstance.current?.write(`       ///////////////                           //////////\r\n`);
    };

    return <BaseLayout>
        <Container size="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            {configuration ? profileDisplay : setupForm}
            <div 
                id="terminal" 
                ref={terminalRef} 
                style={{ height: '1000px', width: '1200px', margin: '60px 0 -300px 0' }}
            />
            <Stack align="center" mt="md" spacing="xs">
                <Stack spacing="xs" align="center" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
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