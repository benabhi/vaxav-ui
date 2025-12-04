// Layout State Store
let savedLayoutJson = $state<string | null>(null);

export const layoutStore = {
    get savedLayout() { return savedLayoutJson; },

    save(config: object) {
        savedLayoutJson = JSON.stringify(config);
        localStorage.setItem('vaxav-layout', savedLayoutJson);
    },

    load(): object | null {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem('vaxav-layout');
        if (saved) {
            try {
                savedLayoutJson = saved;
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    },

    clear() {
        savedLayoutJson = null;
        localStorage.removeItem('vaxav-layout');
    },
};
