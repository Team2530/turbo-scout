//TODO: improve state management for this
//TODO: perhaps a context system could be of use?
//TODO: statbotics stats

"use client";

import React from "react";
import { Tabs } from "@mantine/core";

import { ProgressTab } from "./progress";
import { EntryTab } from "./entries";

export default function ViewDataPage() {

    const tabs = {
        /**
         * Ideas:
         *  Visual pit map display
         *  Match view / Alliance view
         */
        "Pit Progress": <ProgressTab  />,
        "Entries": <EntryTab />,
    };

    return <Tabs variant="outline" defaultValue={Object.keys(tabs)[0]}>
        <Tabs.List>
            {Object.keys(tabs).map(label => {
                return <Tabs.Tab value={label} key={label}>
                    {label}
                </Tabs.Tab>
            })}

        </Tabs.List>

        {Object.entries(tabs).map(([label, content]) => {
            return <Tabs.Panel value={label} key={label}>
                {content}
            </Tabs.Panel>
        })}
    </Tabs>
}