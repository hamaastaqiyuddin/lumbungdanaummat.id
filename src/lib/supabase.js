// Use MySQL API instead of Supabase
export const isSupabaseConfigured = true;

const API_BASE_URL = '/api';

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this.operation = 'select'; // default
        this.payload = null;
        this.filters = {};
        this.orderBy = null;
        this.limitVal = null;
    }

    select(query = '*') {
        this.operation = 'select';
        return this;
    }

    insert(payload) {
        this.operation = 'insert';
        this.payload = Array.isArray(payload) ? payload[0] : payload;
        return this;
    }

    update(payload) {
        this.operation = 'update';
        this.payload = payload;
        return this;
    }

    delete() {
        this.operation = 'delete';
        return this;
    }

    upsert(payload) {
        this.operation = 'upsert';
        this.payload = payload;
        return this;
    }

    eq(column, value) {
        this.filters[column] = value;
        return this;
    }

    order(column, { ascending = true } = {}) {
        this.orderBy = { column, ascending };
        return this;
    }

    limit(val) {
        this.limitVal = val;
        return this;
    }

    async then(onFulfilled, onRejected) {
        try {
            let url = `${API_BASE_URL}/${this.table}.php`;
            let method = 'GET';
            let body = null;

            if (this.operation === 'update' || this.operation === 'delete') {
                if (this.filters.id) {
                    url += `?id=${this.filters.id}`;
                }
            }

            switch (this.operation) {
                case 'insert':
                    method = 'POST';
                    body = JSON.stringify(this.payload);
                    break;
                case 'update':
                    method = 'PUT';
                    body = JSON.stringify(this.payload);
                    break;
                case 'delete':
                    method = 'DELETE';
                    break;
                case 'upsert':
                    method = 'POST';
                    body = JSON.stringify(this.payload);
                    break;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            });

            const data = await res.json();
            const result = { data, error: res.ok ? null : { message: data.error || 'Unknown error' } };

            return onFulfilled(result);
        } catch (err) {
            const result = { data: null, error: { message: err.message } };
            if (onRejected) return onRejected(result);
            return onFulfilled(result);
        }
    }
}

export const mysqlApi = {
    from: (table) => new QueryBuilder(table),
    auth: {
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
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    }
};

export const supabase = mysqlApi;
