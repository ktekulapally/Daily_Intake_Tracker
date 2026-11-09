// ============================================================================
// DAILY INTAKE TRACKER — Supabase Configuration & Data Bridge
// Connected to your live Supabase project
// ============================================================================

const SUPABASE_URL = "https://rzgwoubtuyrpmwsezhqw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6Z3dvdWJ0dXlycG13c2V6aHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjgwNjEsImV4cCI6MjEwMzg0NDA2MX0.RhlE5RDZ2P7pn4NTYfP8klhTTxDYvvykK0cKQLXpV1w";

// Check whether live Supabase credentials have been configured
const isSupabaseConfigured = () => {
  return (
    typeof SUPABASE_URL === 'string' &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_URL.includes("your-project-ref") &&
    SUPABASE_URL.startsWith("https://")
  );
};

// Initialize the official Supabase client if configured & library is loaded
let _supabaseClient = null;
if (isSupabaseConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = _supabaseClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Clear any stale local demo user when configured with real Supabase
if (isSupabaseConfigured() && typeof localStorage !== 'undefined') {
  try {
    localStorage.removeItem('daily_intake_local_user_v1');
  } catch (e) {}
}

// Local demo storage keys (used as fallback before Supabase setup)
const LOCAL_STORAGE_KEY_RECORDS = 'daily_intake_local_records_v1';
const LOCAL_STORAGE_KEY_USER = 'daily_intake_local_user_v1';

// Seed sample records for immediate demo preview only if running without live Supabase
const seedSampleDataIfNeeded = () => {
  if (isSupabaseConfigured()) return;
  if (localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS)) return;

  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date(Date.now() - 86400000);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const samples = [
    {
      id: 'demo-1',
      intake_date: today,
      intake_time: '12:00',
      meal_type: 'Breakfast',
      food_name: 'Boiled Eggs & Toast',
      category: 'Eggs',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Home Made',
      notes: 'High protein breakfast',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      intake_date: today,
      intake_time: '12:00',
      meal_type: 'Lunch',
      food_name: 'Chicken Curry with Steamed Rice',
      category: 'Meat',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Home Made',
      notes: 'Balanced lunch',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-3',
      intake_date: today,
      intake_time: '12:00',
      meal_type: 'Snack',
      food_name: 'Greek Yogurt with Honey',
      category: 'Dairy',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Home Made',
      notes: 'Afternoon refreshment',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4',
      intake_date: today,
      intake_time: '12:00',
      meal_type: 'Dinner',
      food_name: 'Basmati Rice & Paneer Butter Masala',
      category: 'Rice',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Restaurant',
      notes: 'Dinner from Punjab Grill',
      is_packaged_food: false,
      is_new_food: true,
      previously_consumed: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-5',
      intake_date: yesterday,
      intake_time: '12:00',
      meal_type: 'Breakfast',
      food_name: 'Scrambled Eggs with Butter',
      category: 'Eggs',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Home Made',
      notes: '',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6',
      intake_date: yesterday,
      intake_time: '12:00',
      meal_type: 'Lunch',
      food_name: 'Tandoori Grilled Fish & Fried Rice',
      category: 'Meat',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Restaurant',
      notes: 'Delicious seafood plate',
      is_packaged_food: false,
      is_new_food: true,
      previously_consumed: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-7',
      intake_date: yesterday,
      intake_time: '12:00',
      meal_type: 'Snack',
      food_name: 'Gulab Jamun',
      category: 'Sweets/Desserts',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Restaurant',
      notes: 'Sweet indulgence',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-8',
      intake_date: yesterday,
      intake_time: '12:00',
      meal_type: 'Dinner',
      food_name: 'Curd Rice with Pomegranate',
      category: 'Rice',
      quantity: 1,
      unit: 'Serving',
      ingredients: '',
      preparation_method: '',
      brand_restaurant: 'Home Made',
      notes: 'Cooling evening dinner',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    }
  ];

  localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(samples));
};

seedSampleDataIfNeeded();

// Unified Authentication Manager
window.intakeAuth = {
  isConfigured() {
    return isSupabaseConfigured();
  },

  async getUser() {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data: { session }, error } = await _supabaseClient.auth.getSession();
      if (error || !session) return null;
      return session.user;
    }
    // Local / Demo Mode User
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    // Default demo user when not logged in
    const defaultUser = {
      id: 'demo-user-123',
      email: 'demo@dailyintake.local',
      is_demo: true,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(defaultUser));
    return defaultUser;
  },

  async signIn(email, password) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    }
    // Demo Mode Sign In
    if (!email || !password) throw new Error("Please enter both email and password.");
    const user = {
      id: 'user-' + btoa(email).slice(0, 8),
      email: email,
      is_demo: true,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  async signUp(email, password) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      return data.user;
    }
    // Demo Mode Sign Up
    return this.signIn(email, password);
  },

  async signOut() {
    if (isSupabaseConfigured() && _supabaseClient) {
      await _supabaseClient.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  },

  async resetPassword(email) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const redirectUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/reset-password.html');
      const { data, error } = await _supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      if (error) throw error;
      return data;
    }
    // Demo Mode Reset
    return { message: "Demo mode: Password reset instructions simulated." };
  },

  async updatePassword(newPassword) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    }
    return { success: true };
  }
};

// Unified Database CRUD Bridge
window.intakeDB = {
  isConfigured() {
    return isSupabaseConfigured();
  },

  async getItemsForDate(dateStr) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient
        .from('intake_records')
        .select('*')
        .eq('intake_date', dateStr)
        .order('intake_time', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    // Local Storage Fallback
    try {
      const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS) || '[]');
      return list
        .filter((r) => r.intake_date === dateStr)
        .sort((a, b) => (a.intake_time || '').localeCompare(b.intake_time || ''));
    } catch (e) {
      return [];
    }
  },

  async getItemsForDateRange(startDate, endDate) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient
        .from('intake_records')
        .select('*')
        .gte('intake_date', startDate)
        .lte('intake_date', endDate)
        .order('intake_date', { ascending: false })
        .order('intake_time', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    // Local Storage Fallback
    try {
      const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS) || '[]');
      return list
        .filter((r) => r.intake_date >= startDate && r.intake_date <= endDate)
        .sort((a, b) => b.intake_date.localeCompare(a.intake_date) || (a.intake_time || '').localeCompare(b.intake_time || ''));
    } catch (e) {
      return [];
    }
  },

  async insertItem(record) {
    const user = await window.intakeAuth.getUser();
    if (!user) throw new Error("User must be signed in to add an intake record.");

    const row = {
      ...record,
      user_id: user.id,
      intake_time: record.intake_time || '12:00',
      quantity: record.quantity !== undefined && !isNaN(Number(record.quantity)) ? Number(record.quantity) : 1,
      unit: record.unit || 'Serving',
      brand_restaurant: record.brand_restaurant || 'Home Made',
      ingredients: record.ingredients || '',
      preparation_method: record.preparation_method || '',
      is_packaged_food: Boolean(record.is_packaged_food),
      is_new_food: Boolean(record.is_new_food),
      previously_consumed: Boolean(record.previously_consumed)
    };

    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient
        .from('intake_records')
        .insert([row])
        .select();
      if (error) throw error;
      return data ? data[0] : null;
    }

    // Local Storage Fallback
    const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS) || '[]');
    row.id = 'rec-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    row.created_at = new Date().toISOString();
    row.updated_at = new Date().toISOString();
    list.push(row);
    localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(list));
    return row;
  },

  async updateItem(id, updates) {
    const formatted = {
      ...updates,
      intake_time: updates.intake_time || '12:00',
      quantity: updates.quantity !== undefined && !isNaN(Number(updates.quantity)) ? Number(updates.quantity) : 1,
      unit: updates.unit || 'Serving',
      brand_restaurant: updates.brand_restaurant || 'Home Made',
      ingredients: updates.ingredients || '',
      preparation_method: updates.preparation_method || '',
      is_packaged_food: Boolean(updates.is_packaged_food),
      is_new_food: Boolean(updates.is_new_food),
      previously_consumed: Boolean(updates.previously_consumed),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && _supabaseClient) {
      const { data, error } = await _supabaseClient
        .from('intake_records')
        .update(formatted)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data ? data[0] : null;
    }

    // Local Storage Fallback
    const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS) || '[]');
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...formatted };
      localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteItem(id) {
    if (isSupabaseConfigured() && _supabaseClient) {
      const { error } = await _supabaseClient
        .from('intake_records')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    // Local Storage Fallback
    let list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS) || '[]');
    list = list.filter((r) => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(list));
    return true;
  }
};
