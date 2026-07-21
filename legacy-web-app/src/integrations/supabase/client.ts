import { apiClient } from "@/lib/api-client";

class SupabaseQueryBuilder {
  private table: string;
  private filters: Record<string, any> = {};
  private orderByField?: string;
  private orderDirection?: 'asc' | 'desc';
  private limitCount?: number;
  private isSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(field: string, value: any) {
    this.filters[field] = value;
    return this;
  }

  neq(field: string, value: any) {
    this.filters[`${field}_not`] = value;
    return this;
  }

  in(field: string, values: any[]) {
    this.filters[`${field}_in`] = values;
    return this;
  }

  gt(field: string, value: any) {
    this.filters[`${field}_gt`] = value;
    return this;
  }

  gte(field: string, value: any) {
    this.filters[`${field}_gte`] = value;
    return this;
  }

  lt(field: string, value: any) {
    this.filters[`${field}_lt`] = value;
    return this;
  }

  lte(field: string, value: any) {
    this.filters[`${field}_lte`] = value;
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    this.orderDirection = options?.ascending === false ? 'desc' : 'asc';
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    return this;
  }

  // Chainable executor
  async then(resolve: (value: any) => void, reject: (err: any) => void) {
    try {
      const params = new URLSearchParams();
      if (Object.keys(this.filters).length > 0) {
        params.append('filters', JSON.stringify(this.filters));
      }
      if (this.orderByField) {
        params.append('orderBy', this.orderByField);
        params.append('orderDir', this.orderDirection || 'asc');
      }
      if (this.limitCount) {
        params.append('limit', String(this.limitCount));
      }
      if (this.isSingle) {
        params.append('single', 'true');
      }

      const queryString = params.toString();
      const path = `/db/${this.table}${queryString ? `?${queryString}` : ''}`;
      
      const data = await apiClient.get(path);
      resolve({ data, error: null });
    } catch (error: any) {
      resolve({ data: null, error: { message: error.message || 'Query failed' } });
    }
  }

  async insert(values: any) {
    try {
      const data = await apiClient.post(`/db/${this.table}`, values);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Insert failed' } };
    }
  }

  async update(values: any) {
    try {
      const data = await apiClient.put(`/db/${this.table}`, { values, filters: this.filters });
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Update failed' } };
    }
  }

  async delete() {
    try {
      const filtersStr = encodeURIComponent(JSON.stringify(this.filters));
      const data = await apiClient.delete(`/db/${this.table}?filters=${filtersStr}`);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Delete failed' } };
    }
  }

  async upsert(values: any) {
    try {
      const data = await apiClient.post(`/db/${this.table}`, values);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Upsert failed' } };
    }
  }
}

export const supabase = {
  from(table: string) {
    return new SupabaseQueryBuilder(table);
  },

  rpc(fnName: string, args?: any) {
    return {
      then: async (resolve: any) => {
        try {
          const data = await apiClient.post(`/rpc/${fnName}`, args || {});
          resolve({ data, error: null });
        } catch (error: any) {
          resolve({ data: null, error: { message: error.message || 'RPC failed' } });
        }
      }
    };
  },

  auth: {
    async getUser() {
      try {
        const token = apiClient.getToken();
        if (!token) return { data: { user: null }, error: null };
        const res = await apiClient.get<any>('/auth/me');
        return { data: { user: res.user }, error: null };
      } catch (error: any) {
        return { data: { user: null }, error: { message: error.message } };
      }
    },

    async getSession() {
      try {
        const token = apiClient.getToken();
        if (!token) return { data: { session: null }, error: null };
        const res = await apiClient.get<any>('/auth/me');
        const session = {
          access_token: token,
          user: res.user,
          expires_at: Math.floor(Date.now() / 1000) + 3600 * 24
        };
        return { data: { session }, error: null };
      } catch (error: any) {
        return { data: { session: null }, error: { message: error.message } };
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Mock subscription - in a full implementation this would hook into token changes
      setTimeout(async () => {
        try {
          const sessionRes = await this.getSession();
          if (sessionRes.data.session) {
            callback("SIGNED_IN", sessionRes.data.session);
          }
        } catch (e) {}
      }, 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },

    async signOut() {
      apiClient.clearToken();
      return { error: null };
    },

    async signInWithPassword(credentials: { email: string; password?: string }) {
      try {
        const res = await apiClient.post<any>('/auth/login', {
          email: credentials.email,
          password: credentials.password
        });
        if (res.token) {
          apiClient.setToken(res.token);
        }
        const session = { access_token: res.token, user: res.user };
        return { data: { session, user: res.user }, error: null };
      } catch (error: any) {
        return { data: { session: null, user: null }, error: { message: error.message || 'Login failed' } };
      }
    },

    async signUp(credentials: { email: string; password?: string; options?: { data?: any } }) {
      try {
        const res = await apiClient.post<any>('/auth/register', {
          email: credentials.email,
          password: credentials.password,
          fullName: credentials.options?.data?.full_name || ''
        });
        if (res.token) {
          apiClient.setToken(res.token);
        }
        const session = { access_token: res.token, user: res.user };
        return { data: { session, user: res.user }, error: null };
      } catch (error: any) {
        return { data: { session: null, user: null }, error: { message: error.message || 'Signup failed' } };
      }
    }
  }
};
