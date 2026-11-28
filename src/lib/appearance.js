import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/auth-context';
import { settingsService } from '../services/settingsService';

export const DEFAULT_ACCENT = '#1B6B3A';
const STORAGE_KEY = 'cliks_accent_color';
const OWNER_KEY = 'cliks_accent_color_owner';

export const normalizeAccent = (value) =>
    typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null;

export function readSavedAccent(owner) {
    if (owner) {
        const userScoped = normalizeAccent(localStorage.getItem(`${STORAGE_KEY}_${owner}`));
        if (userScoped) return userScoped;
    }
    const savedOwner = localStorage.getItem(OWNER_KEY);
    if (owner && savedOwner && savedOwner !== owner) return DEFAULT_ACCENT;
    return normalizeAccent(localStorage.getItem(STORAGE_KEY)) || DEFAULT_ACCENT;
}

function whiteContrast(channels) {
    const linear = channels.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 1.05 / (0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2] + 0.05);
}

export function applyAccent(value) {
    const accent = normalizeAccent(value);
    if (!accent) return;
    const rgb = accent.slice(1).match(/../g).map(channel => parseInt(channel, 16));
    let solid = rgb;
    // Darken light selections only as much as needed for white button text.
    for (let scale = 0.98; whiteContrast(solid) < 4.5; scale -= 0.02) {
        solid = rgb.map(channel => Math.round(channel * scale));
    }
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-solid', '#' + solid.map(channel => channel.toString(16).padStart(2, '0')).join(''));
}

export function saveAccent(value, owner) {
    const accent = normalizeAccent(value);
    if (!accent) return;
    localStorage.setItem(STORAGE_KEY, accent);
    if (owner) {
        localStorage.setItem(OWNER_KEY, owner);
        try {
            localStorage.setItem(`${STORAGE_KEY}_${owner}`, accent);
        } catch {}
    }
}

export function useAppearanceSettings() {
    const { user } = useAuth();
    const identity = user?.id ?? user?.user_id ?? user?.email;
    const owner = identity == null ? null : String(identity);
    const queryKey = ['settings', owner];
    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await settingsService.getSettings();
            return response?.data?.settings ?? response?.settings ?? {};
        },
        enabled: Boolean(owner),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });
    return { ...query, owner, queryKey };
}

export function SavedAccent() {
    const { data, owner } = useAppearanceSettings();

    useEffect(() => {
        const local = readSavedAccent(owner);
        const remote = normalizeAccent(data?.accentColor);
        if (remote) {
            saveAccent(remote, owner);
            applyAccent(remote);
        } else if (local) {
            applyAccent(local);
        }
    }, [data, owner]);

    return null;
}
