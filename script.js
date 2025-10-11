const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const eventModal = document.getElementById('event-modal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const eventsContainer = document.getElementById('events-container');
const searchInput = document.getElementById('search-input');
const locationFilter = document.getElementById('location-filter');
const categoryFilter = document.getElementById('category-filter');
const dateFilter = document.getElementById('date-filter');
const searchBtn = document.getElementById('search-btn');
const viewAllEvents = document.getElementById('view-all-events');
const categoryCards = document.querySelectorAll('.category-card');
const newsletterForm = document.getElementById('newsletter-form');
const togglePassword = document.getElementById('toggle-password');
const registerPassword = document.getElementById('register-password');
const toast = document.getElementById('toast');
const filterBtns = document.querySelectorAll('.filter-btn');
const backToTopBtn = document.getElementById('back-to-top');
const cookieConsent = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');

const sampleEvents = [
    {
        id: 1,
        title: "Riyadh Season Opening",
        description: "Experience the grand opening of Riyadh Season with spectacular performances and fireworks. This annual festival showcases Saudi culture with concerts, art exhibitions, and culinary experiences.",
        location: "Riyadh",
        date: "2025-10-01T19:00:00",
        category: "cultural",
        image: "https://via.placeholder.com/600x400?text=Riyadh+Season",
        price: 50,
        capacity: 1000,
        organizer: "Riyadh Season Committee",
        city: "riyadh"
    },
    {
        id: 2,
        title: "Jeddah Food Festival",
        description: "A celebration of Saudi and international cuisine with top chefs and food vendors. Taste traditional dishes from all regions of Saudi Arabia alongside international flavors.",
        location: "Jeddah",
        date: "2025-11-15T10:00:00",
        category: "food",
        image: "https://imgs.search.brave.com/VefoSpLLamYa3RzwKaoXJGfcXR7kqwMhoeZmgUbmMNM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vc29jaWFs/a2FuZHVyYS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MTEvU2F1ZGktRmVh/c3QtRm9vZC1GZXN0/aXZhbC0xLTEucG5n/P2ZpdD0xNTAwLDk4/NSZzc2w9MQ",
        price: 25,
        capacity: 500,
        organizer: "Jeddah Tourism",
        city: "jeddah"
    },
    {
        id: 3,
        title: "AlUla Desert Tour",
        description: "Guided tour through the stunning desert landscapes of AlUla with local experts. Visit historical sites, enjoy sunset views, and experience Bedouin hospitality.",
        location: "AlUla",
        date: "2025-12-05T08:00:00",
        category: "nature",
        image: "https://imgs.search.brave.com/YoXAFdhwyfI8NQhuvW6pgceQAbpd1ok4AGp2l_sWn1I/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZHI1eXo1dzJz/L2ltYWdlL3VwbG9h/ZC9mX3dlYnAsY19m/aWxsL2ZpbGVzL2xh/cmdlLzEwNzI5NDE3/NzhfQWxVbGExLndl/YnA",
        price: 75,
        capacity: 20,
        organizer: "AlUla Experiences",
        city: "alula"
    },
    {
        id: 4,
        title: "Red Sea Diving Adventure",
        description: "Scuba diving experience in the beautiful Red Sea coral reefs. Suitable for beginners and experienced divers with equipment provided and professional guides.",
        location: "Jeddah",
        date: "2025-11-22T07:00:00",
        category: "adventure",
        image: "https://imgs.search.brave.com/mfRGBWgnu-A5PMW45_0-BAoXN10mp6si5tOcOvp4yR8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudm9ndWUuY29t/L3Bob3Rvcy82NTM5/MGNjYzVlNGIxNjBj/OGY1ZTBhOTEvbWFz/dGVyL3dfMTYwMCxj/X2xpbWl0L1AxMDEw/NTg2LUVkaXQtRWRp/dF9TYXJhaC5qcGc",
        price: 120,
        capacity: 12,
        organizer: "Red Sea Adventures",
        city: "jeddah"
    },
    {
        id: 5,
        title: "Dammam Cultural Night",
        description: "Experience the rich cultural heritage of Dammam through traditional performances, art exhibitions, and local cuisine.",
        location: "Dammam",
        date: "2025-04-15T10:00:00",
        category: "cultural",
        image: "https://imgs.search.brave.com/w1AI0-ienjwJrW1Sf0SksVS7smYKcCpuEI7M5TUUNM8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Lndhc2FsdC5zYS9l/bi93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NC8wOS9EYW1tYW0t/Q29ybmljaGUtMi03/NTB4NTM2LmpwZw",
        price: 35,
        capacity: 200,
        organizer: "Dammam Tourism",
        city: "dammam"
    }
];

// Load events from API
async function loadEventsFromAPI() {
    try {
        const response = await fetch('http://localhost:4000/api/events');
        const data = await response.json();
        
        if (data.ok && data.events) {
            // Transform API events to match the expected format
            const apiEvents = data.events.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description || 'No description available',
                location: event.location,
                date: event.date,
                category: event.category || 'other',
                image: event.image || 'https://via.placeholder.com/600x400?text=Event+Image',
                price: event.price || 0,
                capacity: event.capacity || 0,
                organizer: event.organizerName || 'Unknown Organizer',
                city: event.location ? event.location.toLowerCase().replace(/\s+/g, '-') : 'unknown',
                savedBy: event.savedBy || [],
                likes: event.likes || 0,
                likedBy: event.likedBy || []
            }));
            
            // Combine API events with sample events (for demo purposes)
            const allEvents = [...apiEvents, ...sampleEvents];
            renderEvents(allEvents);
        } else {
            // Fallback to sample events if API fails
            renderEvents(sampleEvents);
        }
    } catch (error) {
        console.error('Error loading events from API:', error);
        // Fallback to sample events
        renderEvents(sampleEvents);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadEventsFromAPI();
    setupEventListeners();
    
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'block';
    }
 
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
      
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            

            showToast('Login successful! Redirecting...', 'success');
            

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            

            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
});


function setupEventListeners() {
   
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
    }
    
  
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
   
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
            openModal(registerModal);
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
            openModal(loginModal);
        });
    }
    

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }
    

    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    

    if (searchBtn) {
        searchBtn.addEventListener('click', filterEvents);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterEvents();
        });
    }
    

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterEventsByCategory(category);
        });
    });
    

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterEventsByCategory(filter);
        });
    });
    

    if (viewAllEvents) {
        viewAllEvents.addEventListener('click', (e) => {
            e.preventDefault();
            renderEvents(sampleEvents);
            filterBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        });
    }
    

    window.addEventListener('scroll', toggleBackToTop);
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    

    if (cookieAccept) {
        cookieAccept.addEventListener('click', acceptCookies);
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === registerModal || e.target === eventModal) {
            closeModal();
        }
    });
}


function toggleMobileMenu() {
    mainNav.classList.toggle('show');
    mobileMenuToggle.innerHTML = mainNav.classList.contains('show') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
}


function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (loginModal) loginModal.style.display = 'none';
    if (registerModal) registerModal.style.display = 'none';
    if (eventModal) eventModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('login-password');
    if (passwordInput) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
    }
}


function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const location = document.getElementById('register-location').value;
    const terms = document.getElementById('terms-checkbox').checked;
    

    if (!name || !email || !password || !confirmPassword || !location) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showToast('You must accept the terms and conditions', 'error');
        return;
    }
    
    showToast('Registration successful!', 'success');
    closeModal();
    resetForm(registerForm);
}

function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    showToast('Thank you for subscribing!', 'success');
    resetForm(newsletterForm);
}


function resetForm(form) {
    if (form) {
        form.reset();
    }
}


function showToast(message, type) {
    if (toast) {
        toast.textContent = message;
        toast.className = 'toast show';
        toast.classList.add(type);
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}


function renderEvents(events) {
    if (!eventsContainer) return;
    
    if (!events || events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <p>No events found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    eventsContainer.innerHTML = events.map(event => {
        const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : 'Date TBD';
        
        const priceText = event.price > 0 ? `${event.price} SAR` : 'Free';
        const categoryText = event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Other';
        
        return `
        <div class="event-card" data-id="${event.id}" data-category="${event.category}" data-city="${event.city}">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
                <div class="event-category-badge">${categoryText}</div>
            </div>
            <div class="event-info">
                <h3>${event.title}</h3>
                <p class="event-description">${event.description.substring(0, 120)}${event.description.length > 120 ? '...' : ''}</p>
                <div class="event-meta">
                    <div class="event-details">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        <span class="event-date"><i class="fas fa-calendar"></i> ${eventDate}</span>
                    </div>
                    <div class="event-pricing">
                        <span class="event-price">${priceText}</span>
                        <span class="event-organizer">by ${event.organizer}</span>
                    </div>
                </div>
                <div class="card-actions" style="margin-top:10px;display:flex;gap:8px;align-items:center;">
                    <button class="btn btn-sm btn-outline card-save" data-id="${event.id}"><i class="fas fa-heart"></i> <span class="save-text">${event.saved ? 'Saved' : 'Save'}</span></button>
                    <button class="btn btn-sm btn-outline card-like" data-id="${event.id}"><i class="fas fa-thumbs-up"></i> <span class="likes-count">${event.likes || 0}</span></button>
                    <button class="btn btn-sm btn-primary" onclick="window.location.href='reservation.html?eventId=${event.id}'">Book Now</button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    // Use event delegation so click on buttons doesn't trigger opening the modal
    // remove previous handler if exists to prevent duplicates
    if (eventsContainer._delegatedHandler) eventsContainer.removeEventListener('click', eventsContainer._delegatedHandler);
    eventsContainer._delegatedHandler = async (e) => {
        const cardEl = e.target.closest('.event-card');
        if (!cardEl) return;

        // Save button clicked
        const saveBtn = e.target.closest('.card-save');
        if (saveBtn) {
            e.stopPropagation();
            const id = Number(saveBtn.dataset.id);
            const token = localStorage.getItem('token');
            if (!token) { showToast('Please login to save events', 'info'); return; }
            try {
                const res = await fetch(`/api/events/${id}/save`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (res.ok) {
                    const txt = saveBtn.querySelector('.save-text'); if (txt) txt.textContent = (data.saved === false) ? 'Save' : 'Saved';
                    // update local state
                    const idx = sampleEvents.findIndex(s => s.id === id); if (idx !== -1) sampleEvents[idx].saved = !!data.saved;
                    showToast(data.message || 'تم الحفظ', 'success');
                } else showToast(data.error || 'Save failed', 'error');
            } catch (err) { showToast('Save failed', 'error'); }
            return;
        }

        // Like button clicked
        const likeBtn = e.target.closest('.card-like');
        if (likeBtn) {
            e.stopPropagation();
            const id = Number(likeBtn.dataset.id);
            try {
                const userEmail = localStorage.getItem('userEmail');
                const res = await fetch(`/api/events/${id}/like`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: userEmail })
                });
                const data = await res.json();
                if (res.ok) {
                    const likesSpan = likeBtn.querySelector('.likes-count'); if (likesSpan) likesSpan.textContent = data.likes;
                    const idx = sampleEvents.findIndex(s => s.id === id); if (idx !== -1) sampleEvents[idx].likes = data.likes;
                    showToast(`Liked (${data.likes})`, 'success');
                } else showToast(data.error || 'Like failed', 'error');
            } catch (err) { showToast('Like failed', 'error'); }
            return;
        }

        // Otherwise open modal for the event
        const eventId = parseInt(cardEl.dataset.id);
        const event = events.find(e => e.id === eventId);
        showEventDetails(event);
    };
    eventsContainer.addEventListener('click', eventsContainer._delegatedHandler);
}


function showEventDetails(event) {
    const eventDetails = document.getElementById('event-details');
    if (!eventDetails) return;
    
    eventDetails.innerHTML = `
        <div class="event-details-header">
            <div class="event-details-image">
                <img src="${event.image}" alt="${event.title}">
            </div>
            <div class="event-details-info">
                <h2>${event.title}</h2>
                <div class="event-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                    <span><i class="fas fa-tag"></i> ${event.category}</span>
                    <span><i class="fas fa-users"></i> ${event.capacity} spots available</span>
                    <span class="event-price">${event.price} SAR</span>
                </div>
                <button class="btn btn-primary btn-block book-btn">Book Now</button>
            </div>
        </div>
        <div class="event-details-body">
            <h3>About this event</h3>
            <p>${event.description}</p>
            
            <h3>Organizer</h3>
            <p>${event.organizer}</p>
            
                <div class="event-actions">
                <button class="btn btn-outline share-btn"><i class="fas fa-share-alt"></i> Share</button>
                <button class="btn btn-outline save-btn"><i class="fas fa-heart"></i> <span class="save-text">${event.saved ? 'Saved' : 'Save'}</span></button>
                <button class="btn btn-outline like-btn"><i class="fas fa-thumbs-up"></i> <span class="likes-count">${event.likes || 0}</span></button>
                <button class="btn btn-outline print-btn"><i class="fas fa-print"></i> Print</button>
            </div>
        </div>
    `;
    

    const bookBtn = document.querySelector('.book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (token) {
                // go to reservation page with event id
                window.location.href = `reservation.html?eventId=${event.id}`;
            } else {
                showToast('Please login to book this event', 'info');
                closeModal();
                openModal(loginModal);
            }
        });
    }

    // Action buttons
    const shareBtn = document.querySelector('.share-btn');
    const saveBtn = document.querySelector('.save-btn');
    const likeBtn = document.querySelector('.like-btn');
    const printBtn = document.querySelector('.print-btn');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = { title: event.title, text: event.description, url: window.location.href };
            if (navigator.share) {
                try { await navigator.share(shareData); showToast('Shared successfully', 'success'); } catch (e) { showToast('Share cancelled', 'info'); }
            } else {
                try { await navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard', 'success'); } catch (e) { showToast('Could not copy link', 'error'); }
            }
        });
    }

    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                const res = await fetch(`/api/events/${event.id}/like`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: userEmail })
                });
                const data = await res.json();
                if (res.ok) {
                    showToast(`Liked (${data.likes})`, 'success');
                    // update UI likes count
                    const likesSpan = likeBtn.querySelector('.likes-count');
                    if (likesSpan) likesSpan.textContent = data.likes;
                    // update local sampleEvents state so modal shows updated value next time
                    const idx = sampleEvents.findIndex(se => se.id === event.id);
                    if (idx !== -1) sampleEvents[idx].likes = data.likes;
                } else showToast(data.error || 'Like failed', 'error');
            } catch (e) { showToast('Like failed', 'error'); }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (!token) { showToast('Please login to save events', 'info'); closeModal(); openModal(loginModal); return; }
            try {
                const res = await fetch(`/api/events/${event.id}/save`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if (res.ok) {
                    showToast(data.message || 'Saved to your account', 'success');
                    // toggle save text
                    const saveText = saveBtn.querySelector('.save-text');
                    if (saveText) saveText.textContent = (data.saved === false) ? 'Save' : 'Saved';
                    // update local sampleEvents state
                    const idx = sampleEvents.findIndex(se => se.id === event.id);
                    if (idx !== -1) sampleEvents[idx].saved = !!data.saved;
                } else showToast(data.error || 'Save failed', 'error');
            } catch (e) { showToast('Save failed', 'error'); }
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', () => { window.print(); });
    }
    
    openModal(eventModal);
}


function filterEvents() {
    if (!searchInput || !locationFilter || !categoryFilter || !dateFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const location = locationFilter.value;
    const category = categoryFilter.value;
    const date = dateFilter.value;
    
    let filteredEvents = sampleEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                             event.description.toLowerCase().includes(searchTerm);
        
        const matchesLocation = !location || event.location.toLowerCase() === location;
        
        const matchesCategory = !category || event.category === category;
        
        const matchesDate = true; 
        return matchesSearch && matchesLocation && matchesCategory && matchesDate;
    });
    
    renderEvents(filteredEvents);
}


function filterEventsByCategory(category) {
    if (category === 'all') {
        renderEvents(sampleEvents);
        return;
    }
    
    const filteredEvents = sampleEvents.filter(event => event.category === category);
    renderEvents(filteredEvents);
}


function toggleBackToTop() {
    if (!backToTopBtn) return;
    
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
    }
}

// Function to filter events by city
function filterEventsByCity(city) {
    const eventsContainer = document.querySelector('#events-container');
    if (!eventsContainer) return;
    
    // Show loading state
    eventsContainer.innerHTML = `
        <div class="loading-events">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading events for ${city}...</p>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        const filteredEvents = sampleEvents.filter(event => event.city === city);
        
        if (filteredEvents.length === 0) {
            eventsContainer.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>No events found for ${city}</p>
                </div>
            `;
        } else {
            renderEvents(filteredEvents);
        }
        
        // Scroll to events section
        document.querySelector('#events').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Initialize events when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for city exploration
    const exploreButtons = document.querySelectorAll('.explore-city');
    exploreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const city = button.dataset.city;
            filterEventsByCity(city);
        });
    });
    
    // Initial render of all events
    renderEvents(sampleEvents);
});