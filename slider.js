document.addEventListener('DOMContentLoaded', function() {
    // Initialize cities slider
    initCitiesSlider();
    // Initialize testimonials slider
    initTestimonialsSlider();
});

function initCitiesSlider() {
    const slider = document.querySelector('.cities-slider');
    const slides = document.querySelectorAll('.city-card');
    const prevBtn = document.querySelector('#popular .slider-arrow.prev');
    const nextBtn = document.querySelector('#popular .slider-arrow.next');
    const eventsContainer = document.querySelector('#events-container');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Update dots based on number of cities
    const dotsContainer = document.querySelector('#popular .slider-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    }
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            const offset = (index - currentIndex) * 100;
            slide.style.transform = `translateX(${offset}%)`;
            slide.style.opacity = index === currentIndex ? '1' : '0';
            slide.style.display = index === currentIndex ? 'block' : 'none';
        });
        
        // Update dots
        const dots = document.querySelectorAll('#popular .slider-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slideCount - 1;
        } else if (index >= slideCount) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSlider();
    }
    
    // Event listeners for cities slider
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    // Add click handlers for dots
    const dots = document.querySelectorAll('#popular .slider-dots .dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Handle city exploration
    const exploreButtons = document.querySelectorAll('.explore-city');
    exploreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const city = button.dataset.city;
            filterEventsByCity(city);
        });
    });
    
    function filterEventsByCity(city) {
        // Show loading state
        if (eventsContainer) {
            eventsContainer.innerHTML = `
                <div class="loading-events">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading events for ${city}...</p>
                </div>
            `;
            
            // Simulate loading delay
            setTimeout(() => {
                // Filter events based on city
                const events = document.querySelectorAll('.event-card');
                let hasEvents = false;
                
                events.forEach(event => {
                    const eventCity = event.dataset.city;
                    if (eventCity === city) {
                        event.style.display = 'block';
                        hasEvents = true;
                    } else {
                        event.style.display = 'none';
                    }
                });
                
                // If no events found, show message
                if (!hasEvents) {
                    eventsContainer.innerHTML = `
                        <div class="no-events">
                            <i class="fas fa-calendar-times"></i>
                            <p>No events found for ${city}</p>
                        </div>
                    `;
                }
                
                // Scroll to events section
                document.querySelector('#events').scrollIntoView({ behavior: 'smooth' });
            }, 1000); // 1 second delay to show loading state
        }
    }
    
    // Initialize cities slider
    updateSlider();
    
    // Auto slide every 5 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
}

function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const groups = document.querySelectorAll('.testimonial-group');
    const prevBtn = document.querySelector('.testimonials .slider-arrow.prev');
    const nextBtn = document.querySelector('.testimonials .slider-arrow.next');
    const dots = document.querySelectorAll('.testimonials .slider-dots .dot');
    
    if (!slider || groups.length === 0) return;
    
    let currentIndex = 0;

    // Initialize slider
    function initSlider() {
        groups.forEach((group, index) => {
            group.style.transform = `translateX(${index * 100}%)`;
        });
        updateDots();
    }

    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Slide to specific index
    function slideTo(index) {
        currentIndex = index;
        groups.forEach((group, i) => {
            group.style.transform = `translateX(${100 * (i - currentIndex)}%)`;
        });
        updateDots();
    }

    // Event listeners for testimonials slider
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + groups.length) % groups.length;
            slideTo(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % groups.length;
            slideTo(currentIndex);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideTo(index);
        });
    });

    // Initialize the testimonials slider
    initSlider();

    // Auto slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % groups.length;
        slideTo(currentIndex);
    }, 5000);
}