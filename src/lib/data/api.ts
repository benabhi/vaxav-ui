// API Service - Toggle between mock and real backend
import { mockPilot, mockShip, mockSystems, mockResources } from './fixtures';
import type { Pilot, Ship, StarSystem, Resource } from './types';

// Set to false when backend is ready
const USE_MOCK = true;

// Simulate network delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    async getPilot(): Promise<Pilot> {
        if (USE_MOCK) {
            await delay(100);
            return mockPilot;
        }
        const res = await fetch('/api/pilot');
        return res.json();
    },

    async getShip(): Promise<Ship> {
        if (USE_MOCK) {
            await delay(100);
            return mockShip;
        }
        const res = await fetch('/api/ship');
        return res.json();
    },

    async getSystems(): Promise<StarSystem[]> {
        if (USE_MOCK) {
            await delay(150);
            return mockSystems;
        }
        const res = await fetch('/api/systems');
        return res.json();
    },

    async getResources(): Promise<Resource[]> {
        if (USE_MOCK) {
            await delay(100);
            return mockResources;
        }
        const res = await fetch('/api/resources');
        return res.json();
    },
};
