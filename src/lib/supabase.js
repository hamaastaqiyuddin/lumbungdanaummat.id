// Use MySQL API instead of Supabase
export const isSupabaseConfigured = true; // Set to true to use the MySQL bridge

const API_BASE_URL = '/api';

export const mysqlApi = {
    from: (table) => {
        let currentId = null;
        return {
            select: async (query = '*') => {
                const res = await fetch(`${API_BASE_URL}/${table}.php`);
                const data = await res.json();
                return { data, error: res.ok ? null : data.error };
            },
            insert: async (payload) => {
                const res = await fetch(`${API_BASE_URL}/${table}.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload[0] || payload)
                });
                const data = await res.json();
                return { data, error: res.ok ? null : { message: data.error } };
            },
            update: async (payload) => {
                const url = currentId ? `${API_BASE_URL}/${table}.php?id=${currentId}` : `${API_BASE_URL}/${table}.php`;
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                return { data, error: res.ok ? null : { message: data.error } };
            },
            delete: async () => {
                const url = currentId ? `${API_BASE_URL}/${table}.php?id=${currentId}` : `${API_BASE_URL}/${table}.php`;
                const res = await fetch(url, { method: 'DELETE' });
                const data = await res.json();
                return { data, error: res.ok ? null : { message: data.error } };
            },
            eq: function (col, val) {
                if (col === 'id') currentId = val;
                return this;
            },
            upsert: async (payload) => {
                const res = await fetch(`${API_BASE_URL}/${table}.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                const dataArr = Array.isArray(data) ? data : [data];
                return { data: dataArr, error: res.ok ? null : { message: data.error } };
            },
            order: function () { return this; },
            limit: function () { return this; },
            select: function () { return this; }
        };
    },
    auth: {
        // ... auth methods stay same
        signInWithPassword: async ({ email, password }) => {
            const res = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            return { data, error: res.ok ? null : { message: data.error } };
        },
        signOut: async () => {
            await fetch(`${API_BASE_URL}/auth.php?action=logout`, { method: 'POST' });
            return { error: null };
        },
        getSession: async () => {
            const res = await fetch(`${API_BASE_URL}/auth.php`);
            if (res.ok) {
                const data = await res.json();
                return { data: { session: data.authenticated ? { user: data.user } : null } };
            }
            return { data: { session: null } };
        },
        onAuthStateChange: (callback) => {
            // Basic mock for session changes
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    }
}

// Export as supabase for backward compatibility to minimize refactoring
export const supabase = mysqlApi;
