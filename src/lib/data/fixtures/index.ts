// Mock data fixtures
import type { Pilot, Ship, StarSystem, Resource } from '../types';

export const mockPilot: Pilot = {
    id: 'pilot-1',
    name: 'Commander Vax',
    level: 5,
    experience: 2500,
    experienceToNext: 5000,
    credits: 15000,
    reputation: 750,
    skills: [
        { id: 'piloting', name: 'Piloting', level: 3, maxLevel: 10, experience: 150, experienceToNext: 300 },
        { id: 'trading', name: 'Trading', level: 2, maxLevel: 10, experience: 80, experienceToNext: 200 },
        { id: 'combat', name: 'Combat', level: 4, maxLevel: 10, experience: 350, experienceToNext: 500 },
        { id: 'mining', name: 'Mining', level: 1, maxLevel: 10, experience: 20, experienceToNext: 100 },
    ],
};

export const mockShip: Ship = {
    id: 'ship-1',
    name: 'Stellar Wanderer',
    type: 'explorer',
    hull: 85,
    maxHull: 100,
    shield: 60,
    maxShield: 80,
    cargo: 45,
    maxCargo: 100,
    speed: 120,
    modules: [
        { id: 'engine-1', name: 'Ion Drive Mk2', type: 'engine', level: 2 },
        { id: 'weapon-1', name: 'Laser Cannon', type: 'weapon', level: 1 },
        { id: 'shield-1', name: 'Energy Shield', type: 'shield', level: 2 },
    ],
};

export const mockSystems: StarSystem[] = [
    {
        id: 'system-1',
        name: 'Vaxav Prime',
        x: 0,
        y: 0,
        type: 'yellow',
        discovered: true,
        planets: [
            { id: 'planet-1', name: 'Vaxav I', type: 'terrestrial', orbitRadius: 100, resources: [] },
            { id: 'planet-2', name: 'Vaxav II', type: 'gas', orbitRadius: 200, resources: [] },
        ],
        stations: [
            { id: 'station-1', name: 'Vaxav Station', type: 'trading', services: ['trade', 'refuel', 'repair'] },
        ],
    },
    {
        id: 'system-2',
        name: 'Nebula Reach',
        x: 150,
        y: 80,
        type: 'blue',
        discovered: true,
        planets: [
            { id: 'planet-3', name: 'Nebula I', type: 'ice', orbitRadius: 120, resources: [] },
        ],
        stations: [],
    },
    {
        id: 'system-3',
        name: 'Unknown',
        x: -100,
        y: 200,
        type: 'red',
        discovered: false,
        planets: [],
        stations: [],
    },
];

export const mockResources: Resource[] = [
    { id: 'credits', name: 'Credits', amount: 15000, production: 50 },
    { id: 'fuel', name: 'Fuel', amount: 80, production: 2 },
    { id: 'ore', name: 'Ore', amount: 150, production: 10 },
    { id: 'alloys', name: 'Alloys', amount: 25, production: 1 },
];
