// Game entity types

export interface Pilot {
    id: string;
    name: string;
    level: number;
    experience: number;
    experienceToNext: number;
    credits: number;
    reputation: number;
    skills: Skill[];
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    experience: number;
    experienceToNext: number;
}

export interface Ship {
    id: string;
    name: string;
    type: ShipType;
    hull: number;
    maxHull: number;
    shield: number;
    maxShield: number;
    cargo: number;
    maxCargo: number;
    speed: number;
    modules: ShipModule[];
}

export type ShipType = 'scout' | 'fighter' | 'freighter' | 'miner' | 'explorer';

export interface ShipModule {
    id: string;
    name: string;
    type: string;
    level: number;
}

export interface StarSystem {
    id: string;
    name: string;
    x: number;
    y: number;
    type: 'yellow' | 'red' | 'blue' | 'white' | 'binary';
    planets: Planet[];
    stations: Station[];
    discovered: boolean;
}

export interface Planet {
    id: string;
    name: string;
    type: 'terrestrial' | 'gas' | 'ice' | 'desert' | 'ocean';
    orbitRadius: number;
    resources: Resource[];
}

export interface Station {
    id: string;
    name: string;
    type: 'trading' | 'mining' | 'military' | 'research';
    services: string[];
}

export interface Resource {
    id: string;
    name: string;
    amount: number;
    production: number;
}
