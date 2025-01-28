import { Database } from '../types/database';

export interface SupabaseClient {
  auth: {
    getSession: () => Promise<{ data: { session: any | null }, error: Error | null }>;
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ data: { user: any } | null, error: Error | null }>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => { unsubscribe: () => void };
    signOut: () => Promise<{ error: Error | null }>;
  };
  from: (collection: string) => {
    select: (query?: string) => Promise<any>;
    insert: (data: any) => Promise<any>;
    update: (values: any) => Promise<any>;
    delete: () => Promise<any>;
    eq: (field: string, value: any) => Promise<any>;
  };
}

class LocalStorageDB implements SupabaseClient {
  auth = {
    getSession: async () => ({
      data: { session: this.getCurrentSession() },
      error: null
    }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      if (email && password) {
        const user = { 
          id: `user_${Date.now()}`, 
          email,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.triggerAuthEvent('SIGNED_IN', user);
        return { data: { user }, error: null };
      }
      return { data: null, error: new Error('Invalid credentials') };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const handler = (event: StorageEvent) => {
        if (event.key === 'currentUser') {
          const user = event.newValue ? JSON.parse(event.newValue) : null;
          callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user });
        }
      };
      window.addEventListener('storage', handler);
      return { unsubscribe: () => window.removeEventListener('storage', handler) };
    },
    signOut: async () => {
      localStorage.removeItem('currentUser');
      this.triggerAuthEvent('SIGNED_OUT', null);
      return { error: null };
    }
  };

  private getCurrentSession() {
    const user = localStorage.getItem('currentUser');
    return user ? { user: JSON.parse(user) } : null;
  }

  private triggerAuthEvent(event: string, user: any) {
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'currentUser',
      newValue: user ? JSON.stringify(user) : null
    }));
  }

  from(collection: string) {
    return {
      select: async (query?: string) => {
        const data = localStorage.getItem(collection);
        return data ? JSON.parse(data) : [];
      },
      insert: async (data: any) => {
        const currentData = await this.from(collection).select();
        const newData = [...currentData, { ...data, id: `${collection}_${Date.now()}` }];
        localStorage.setItem(collection, JSON.stringify(newData));
        return { data: newData, error: null };
      },
      update: async (values: any) => {
        const currentData = await this.from(collection).select();
        const updatedData = currentData.map((item: any) => 
          item.id === values.id ? { ...item, ...values } : item
        );
        localStorage.setItem(collection, JSON.stringify(updatedData));
        return { data: updatedData, error: null };
      },
      delete: async () => {
        localStorage.removeItem(collection);
        return { error: null };
      },
      eq: async (field: string, value: any) => {
        const data = await this.from(collection).select();
        return data.filter((item: any) => item[field] === value);
      }
    };
  }
}

export const supabase = new LocalStorageDB();
