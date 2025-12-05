// Panel Drag State Store - Tracks when a Golden Layout panel is being dragged
import { writable, get } from 'svelte/store';

export interface DraggedPanelInfo {
    componentType: string;
    title: string;
}

export interface PendingTransfer {
    targetTabId: string;
    componentType: string;
    title: string;
}

interface PanelDragState {
    isDragging: boolean;
    draggedPanel: DraggedPanelInfo | null;
    pendingTransfer: PendingTransfer | null;
}

function createPanelDragStateStore() {
    const { subscribe, set, update } = writable<PanelDragState>({
        isDragging: false,
        draggedPanel: null,
        pendingTransfer: null,
    });

    return {
        subscribe,

        /**
         * Start drag with panel info
         */
        startDrag: (componentType: string, title: string) => {
            set({
                isDragging: true,
                draggedPanel: { componentType, title },
                pendingTransfer: null,
            });
        },

        /**
         * Set pending transfer when hovering over a tab
         */
        setPendingTransfer: (targetTabId: string, componentType: string, title: string) => {
            update(state => ({
                ...state,
                pendingTransfer: { targetTabId, componentType, title },
            }));
        },

        /**
         * Clear pending transfer (when leaving tab area)
         */
        clearPendingTransfer: () => {
            update(state => ({
                ...state,
                pendingTransfer: null,
            }));
        },

        /**
         * End drag and return pending transfer if any
         */
        endDrag: (): PendingTransfer | null => {
            const state = get({ subscribe });
            const pendingTransfer = state.pendingTransfer;
            set({
                isDragging: false,
                draggedPanel: null,
                pendingTransfer: null,
            });
            return pendingTransfer;
        },

        /**
         * Get current state
         */
        getState: (): PanelDragState => {
            return get({ subscribe });
        },
    };
}

export const panelDragState = createPanelDragStateStore();
