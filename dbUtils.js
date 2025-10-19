// dbUtils.js
// Database utility functions for Supabase operations

// ============================================
// CASES / MISSING PERSONS OPERATIONS
// ============================================

// Fetch all active missing person cases
async function fetchAllCases(filters = {}) {
    try {
        let query = window.supabaseClient
            .from('cases')
            .select('*')
            .eq('status', filters.status || 'Active');

        if (filters.parish) {
            query = query.eq('parish', filters.parish);
        }

        if (filters.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters.sortBy === 'recent') {
            query = query.order('created_at', { ascending: false });
        } else if (filters.sortBy === 'oldest') {
            query = query.order('created_at', { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching cases:', error);
        return { data: null, error };
    }
}

// Fetch a single case by ID
async function fetchCaseById(caseId) {
    try {
        const { data, error } = await window.supabaseClient
            .from('cases')
            .select('*')
            .eq('id', caseId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching case:', error);
        return { data: null, error };
    }
}

// Create a new missing person case
async function createCase(caseData, photoFile) {
    try {
        let photoUrl = null;

        // Upload photo to Supabase Storage if provided
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `case-photos/${fileName}`;

            const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
                .from('photos')
                .upload(filePath, photoFile);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = window.supabaseClient.storage
                .from('photos')
                .getPublicUrl(filePath);

            photoUrl = publicUrl;
        }

        // Insert case data
        const { data, error } = await window.supabaseClient
            .from('cases')
            .insert([{
                full_name: caseData.fullName,
                age: parseInt(caseData.age),
                gender: caseData.gender,
                photo_url: photoUrl,
                description: caseData.description,
                last_known_clothing: caseData.clothing,
                last_seen_date: caseData.lastSeenDate,
                last_seen_time: caseData.lastSeenTime,
                last_seen_address: caseData.lastSeenAddress,
                parish: caseData.parish,
                lat: caseData.latitude ? parseFloat(caseData.latitude) : null,
                lng: caseData.longitude ? parseFloat(caseData.longitude) : null,
                reporter_name: caseData.reporterName,
                reporter_contact: caseData.reporterContact,
                reporter_email: caseData.reporterEmail,
                relationship: caseData.relationship,
                police_report_number: caseData.policeReport,
                status: 'Pending', // New reports start as pending
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating case:', error);
        return { data: null, error };
    }
}

// Update case status
async function updateCaseStatus(caseId, newStatus) {
    try {
        const { data, error } = await window.supabaseClient
            .from('cases')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', caseId)
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating case status:', error);
        return { data: null, error };
    }
}

// ============================================
// TIPS OPERATIONS
// ============================================

// Submit a tip for a case
async function submitTip(tipData) {
    try {
        const { data, error } = await window.supabaseClient
            .from('tips')
            .insert([{
                case_id: tipData.caseId,
                tip_text: tipData.tipText,
                contact_name: tipData.contactName,
                contact_phone: tipData.contactPhone,
                contact_email: tipData.contactEmail,
                anonymous: tipData.anonymous || false,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error submitting tip:', error);
        return { data: null, error };
    }
}

// Fetch tips for a case
async function fetchTipsByCase(caseId) {
    try {
        const { data, error } = await window.supabaseClient
            .from('tips')
            .select('*')
            .eq('case_id', caseId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching tips:', error);
        return { data: null, error };
    }
}

// ============================================
// SEARCH PARTIES OPERATIONS
// ============================================

// Fetch all search parties
async function fetchSearchParties(filters = {}) {
    try {
        let query = window.supabaseClient
            .from('search_parties')
            .select('*, cases(full_name, photo_url)')
            .eq('status', filters.status || 'Active');

        if (filters.parish) {
            query = query.eq('parish', filters.parish);
        }

        query = query.order('scheduled_date', { ascending: true });

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching search parties:', error);
        return { data: null, error };
    }
}

// Create a search party
async function createSearchParty(partyData) {
    try {
        const { data, error } = await window.supabaseClient
            .from('search_parties')
            .insert([{
                case_id: partyData.caseId,
                organizer_name: partyData.organizerName,
                organizer_contact: partyData.organizerContact,
                meeting_point: partyData.meetingPoint,
                parish: partyData.parish,
                scheduled_date: partyData.scheduledDate,
                scheduled_time: partyData.scheduledTime,
                description: partyData.description,
                max_volunteers: partyData.maxVolunteers ? parseInt(partyData.maxVolunteers) : null,
                status: 'Active',
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating search party:', error);
        return { data: null, error };
    }
}

// ============================================
// USER AUTHENTICATION
// ============================================

// Register a new user
async function registerUser(userData) {
    try {
        // Create auth user
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    full_name: userData.fullName,
                    parish: userData.parish,
                    address: userData.address,
                    notify_opt_in: userData.notifyOptIn
                }
            }
        });

        if (authError) throw authError;

        // Insert user profile
        if (authData.user) {
            const { error: profileError } = await window.supabaseClient
                .from('users')
                .insert([{
                    id: authData.user.id,
                    email: userData.email,
                    full_name: userData.fullName,
                    parish: userData.parish,
                    address: userData.address,
                    notify_opt_in: userData.notifyOptIn,
                    created_at: new Date().toISOString()
                }]);

            if (profileError) throw profileError;
        }

        return { data: authData, error: null };
    } catch (error) {
        console.error('Error registering user:', error);
        return { data: null, error };
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Fetch user profile
        if (data.user) {
            const { data: profile, error: profileError } = await window.supabaseClient
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (!profileError && profile) {
                localStorage.setItem('user', JSON.stringify(profile));
            }
        }

        return { data, error: null };
    } catch (error) {
        console.error('Error logging in:', error);
        return { data: null, error };
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'error' ? '#DC3545' : type === 'success' ? '#28A745' : '#0C243C'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
