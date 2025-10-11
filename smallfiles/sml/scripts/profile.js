document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    const changePhotoBtn = document.getElementById('change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', () => {
            alert('This feature would allow you to upload a new profile photo.');
        });
    }
    
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const bio = document.getElementById('bio').value;
     
            alert('Profile settings updated successfully!');
            
     
            document.getElementById('user-name').textContent = name;
            document.getElementById('user-bio').textContent = bio;
        });
    }
    
   
    loadUserData();
});


function loadUserData() {
 
    const userData = {
        name: 'Abdullah Al-Qahtani',
        bio: 'Event enthusiast from Riyadh with a passion for cultural festivals and music concerts. Member since 2020.',
        stats: {
            eventsAttended: 27,
            reviewsWritten: 14,
            yearsMember: 3
        },
        upcomingEvents: [
            {
                name: 'Riyadh Season 2025 Opening Ceremony',
                date: 'May 25, 2025',
                location: 'Boulevard City, Riyadh'
            },
            {
                name: 'Saudi National Day Concert',
                date: 'September 23, 2025',
                location: 'King Fahd Stadium, Riyadh'
            }
        ],
        pastEvents: [
            {
                name: 'AlUla Festival',
                date: 'January 15, 2025',
                location: 'AlUla Old Town'
            },
            {
                name: 'MDLBEAST Soundstorm',
                date: 'December 16-19, 2024',
                location: 'Banban, Riyadh'
            }
        ],
        savedEvents: [
            {
                name: 'Jeddah Food Festival',
                date: 'June 10-15, 2025',
                location: 'Jeddah Waterfront'
            },
            {
                name: 'Red Sea International Film Festival',
                date: 'December 5-14, 2025',
                location: 'Al-Balad, Jeddah'
            }
        ]
    };
    
    document.getElementById('events-attended').textContent = userData.stats.eventsAttended;
    document.getElementById('reviews-written').textContent = userData.stats.reviewsWritten;
    document.getElementById('years-member').textContent = userData.stats.yearsMember;
    

}

function handleEventAction(action, eventName) {
    switch(action) {
        case 'view-ticket':
            alert(`Loading ticket for ${eventName}...`);
            break;
        case 'add-calendar':
            alert(`Adding ${eventName} to your calendar...`);
            break;
        case 'write-review':
            alert(`Opening review form for ${eventName}...`);
            break;
        case 'view-photos':
            alert(`Loading photos from ${eventName}...`);
            break;
        case 'purchase':
            alert(`Redirecting to purchase tickets for ${eventName}...`);
            break;
        case 'remove-saved':
            // remove the event card from the saved list in the UI
            const savedList = document.getElementById('saved-events');
            if (savedList) {
                const items = Array.from(savedList.querySelectorAll('.event-item'));
                const item = items.find(i => i.dataset && i.dataset.name === eventName);
                if (item) item.remove();
            }
            alert(`Removed ${eventName} from saved events.`);
            break;
    }
}