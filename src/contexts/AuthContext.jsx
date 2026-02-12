// Authentication Context - Manages user authentication state using Supabase

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                setUser({ ...session.user, ...profile });
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (signed in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change event:', event);
            if (session) {
                // Prioritize the role from metadata to avoid race conditions with profile fetch
                // Supabase default user.role is 'authenticated', which causes mismatches
                const currentUser = {
                    ...session.user,
                    role: session.user.user_metadata?.role || 'candidate'
                };

                setUser(currentUser);
                setIsAuthenticated(true);
                // Unblock UI immediately with basic user so we don't get stuck
                setLoading(false);

                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profile) {
                        // Merge profile data
                        console.log('Profile loaded in background:', profile);
                        setUser(prevUser => ({
                            ...prevUser,
                            ...profile,
                            // Ensure role is at top level for easy access
                            role: profile.role || prevUser.user_metadata?.role || 'candidate'
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            }
        });

        // Safety timeout in case everything else fails
        const timeoutId = setTimeout(() => {
            setLoading(l => {
                if (l) console.warn('Auth loading safety timeout triggered');
                return false;
            });
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            // Step 1: Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        role: userData.role,
                    },
                },
            });

            if (authError) throw authError;

            // Step 2: Manually create profile (more reliable than trigger)
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: userData.email,
                        full_name: userData.fullName || userData.email.split('@')[0],
                        role: userData.role || 'candidate',
                    }, { onConflict: 'id' });

                // Log profile error but don't fail registration
                if (profileError) {
                    console.warn('Profile creation/update warning:', profileError);
                }
            }

            return authData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('Initiating logout...');

            // 1. CLEAR LOCAL STATE IMMEDIATELY (Optimistic Logout)
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);

            // 2. Clear all local storage
            const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // 3. Call Supabase SignOut (Fire and forget from UI perspective, but we await it for correctness)
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Supabase signOut error:', error);
            }

            console.log('Logout complete.');
        } catch (error) {
            console.error('Logout implementation error:', error);
            // Ensure state is cleared even if something weird happens above
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            setUser(prev => ({ ...prev, ...updates }));
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
