"use client";
import React from "react";

export interface TurboState {
    current_event?: string | null
}

export const defaultTurboState: TurboState = {
    current_event: "2024ndgf",
}

export const TurboContext = React.createContext<TurboState>(defaultTurboState);