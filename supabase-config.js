// ============================================================================
// DAILY INTAKE TRACKER — Supabase Configuration & Data Bridge
// Step 2 from README: Fill in your Supabase project URL and anon public key below.
// ============================================================================

const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

// Check whether live Supabase credentials have been configured
const isSupabaseConfigured = () => {
  return (
    typeof SUPABASE_URL === 'string' &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    !SUPABASE_URL.includes("your-project-ref") &&
    !SUPABASE_ANON_KEY.includes("your-anon-key") &&
    SUPABASE_URL.startsWith("https://")
  );
};

// Initialize the official Supabase client if configured & library is loaded
let _supabaseClient = null;
if (isSupabaseConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Local demo storage keys (used as fallback before Supabase setup)
const LOCAL_STORAGE_KEY_RECORDS = 'daily_intake_local_records_v1';
const LOCAL_STORAGE_KEY_USER = 'daily_intake_local_user_v1';

// Seed sample records for immediate demo preview if running locally without Supabase
const seedSampleDataIfNeeded = () => {
  if (localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS)) return;

  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date(Date.now() - 86400000);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const samples = [
    {
      id: 'demo-1',
      intake_date: today,
      intake_time: '08:30',
      meal_type: 'Breakfast',
      food_name: 'Oatmeal with Almond Milk & Berries',
      category: 'Rice/Grains',
      quantity: 1,
      unit: 'Bowl',
      ingredients: 'Rolled oats, almond milk, blueberries, chia seeds',
      preparation_method: 'Boiled',
      brand_restaurant: 'Home Cooked',
      notes: 'No added sugar',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      intake_date: today,
      intake_time: '11:15',
      meal_type: 'Mid-Morning Snack',
      food_name: 'Organic Matcha Green Tea',
      category: 'Beverages',
      quantity: 1,
      unit: 'Cup',
      ingredients: 'Matcha powder, hot water',
      preparation_method: 'Steamed',
      brand_restaurant: 'Ippodo Tea',
      notes: 'Rich antioxidant boost',
      is_packaged_food: true,
      is_new_food: true,
      previously_consumed: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-3',
      intake_date: today,
      intake_time: '13:30',
      meal_type: 'Lunch',
      food_name: 'Grilled Salmon with Quinoa & Steamed Broccoli',
      category: 'Seafood',
      quantity: 1,
      unit: 'Plate',
      ingredients: 'Atlantic salmon, quinoa, broccoli, olive oil, lemon',
      preparation_method: 'Grilled',
      brand_restaurant: 'Healthy Kitchen',
      notes: 'Clean lunch',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4',
      intake_date: today,
      intake_time: '17:00',
      meal_type: 'Evening Snack',
      food_name: 'Greek Yogurt with Walnuts',
      category: 'Dairy',
      quantity: 1,
      unit: 'Cup',
      ingredients: 'Plain Greek yogurt, crushed walnuts, dash of cinnamon',
      preparation_method: 'Raw',
      brand_restaurant: 'Chobani',
      notes: 'Protein snack',
      is_packaged_food: true,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-5',
      intake_date: today,
      intake_time: '20:15',
      meal_type: 'Dinner',
      food_name: 'Lentil Soup (Dal Tadka) & Brown Rice',
      category: 'Pulses/Legumes',
      quantity: 1.5,
      unit: 'Bowl',
      ingredients: 'Yellow lentils, cumin, ginger, garlic, tomatoes, turmeric',
      preparation_method: 'Boiled',
      brand_restaurant: 'Home Cooked',
      notes: 'Comfort food',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-6',
      intake_date: yesterday,
      intake_time: '09:00',
      meal_type: 'Breakfast',
      food_name: 'Poached Eggs on Sourdough',
      category: 'Protein/Meat',
      quantity: 2,
      unit: 'Pieces',
      ingredients: 'Eggs, sourdough bread, avocado',
      preparation_method: 'Boiled',
      brand_restaurant: 'Artisan Bakery',
      notes: 'With black coffee',
      is_packaged_food: false,
      is_new_food: false,
      previously_consumed: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-7',
      intake_date: yesterday,
      intake_time: '13:00',
      meal_type: 'Lunch',
      food_name: 'Tofu Buddha Bowl',
      category: 'Vegetables',
      quantity: 1,
      unit: 'Bowl',
      ingredients: 'Tofu, kale, sweet potato, tahini dressing',
      preparation_method: 'Baked',
      brand_restaurant: 'Green Cafe',
      notes: 'New vegan dish tried',
      is_packaged_food: false,
      is_new_food: true,
      previously_consumed: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-8',
      intake_date: yesterday,
      intake_time: '20:00',
      meal_type: 'Dinner',
      food_name: 'Roasted Chicken Salad',
      category: 'Protein/Meat',
      quantity: 1,
      unit: 'Plate',
      ingredients: 'Chicken breast, mixed greens, cherry tomatoes, balsamic vinaigrette',
      preparation_method: 'Roasted',
      brand_restaurant: 'Home Cooked',
      notes: 'Light dinner',
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
      quantity: Number(record.quantity),
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
      quantity: Number(updates.quantity),
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
