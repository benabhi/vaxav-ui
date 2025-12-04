// Game State Store - Central state management
import { api } from '$lib/data/api';
import type { Pilot, Ship, StarSystem, Resource } from '$lib/data/types';

// State using Svelte 5 $state rune pattern for module-level reactivity
let pilot = $state<Pilot | null>(null);
let ship = $state<Ship | null>(null);
let systems = $state<StarSystem[]>([]);
let resources = $state<Resource[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);

export const gameState = {
    get pilot() { return pilot; },
    get ship() { return ship; },
    get systems() { return systems; },
    get resources() { return resources; },
    get loading() { return loading; },
    get error() { return error; },

    async loadAll() {
        loading = true;
        error = null;
        try {
            const [p, s, sys, res] = await Promise.all([
                api.getPilot(),
                api.getShip(),
                api.getSystems(),
                api.getResources(),
            ]);
            pilot = p;
            ship = s;
            systems = sys;
            resources = res;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load game data';
        } finally {
            loading = false;
        }
    },

    async refreshPilot() {
        pilot = await api.getPilot();
    },

    async refreshShip() {
        ship = await api.getShip();
    },
};
