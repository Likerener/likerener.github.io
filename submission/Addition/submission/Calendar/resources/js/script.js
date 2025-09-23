let editingIndex = null;

function updateLocationOptions() {
    const modality = document.getElementById('event_modality').value;
    const locGroup = document.getElementById('group_location');
    const urlGroup = document.getElementById('group_remote_url');

    if (modality === 'in-person') {
        locGroup.style.display = '';
        urlGroup.style.display = 'none';
    } else {
        urlGroup.style.display = '';
        locGroup.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateLocationOptions();

    const openBtn = document.querySelector('[data-bs-target="#event_modal"]');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            editingIndex = null;
            document.getElementById('event_form').reset();
            document.getElementById('eventModalLabel').textContent = 'Add / Update Event';
            updateLocationOptions();
        });
    }
});


const events = [];

function saveEvent() {

    const name = document.getElementById('event_name').value?.trim();
    const weekday = document.getElementById('event_weekday').value;
    const time = document.getElementById('event_time').value;
    const modality = document.getElementById('event_modality').value;
    const location = document.getElementById('event_location').value.trim();
    const remoteUrl = document.getElementById('event_remote_url').value.trim();
    const attendees = document.getElementById('event_attendees').value.trim();
    const category = document.getElementById('event_category').value;


    // const eventDetails = {
    //     name: name || "",
    //     weekday,
    //     time,
    //     modality,
    //     location: (modality === 'in-person') ? location : null,
    //     remote_url: (modality === 'remote') ? remoteUrl : null,
    //     attendees
    // };

    const eventDetails = {
        name: name || "",
        weekday,
        time,
        modality,
        location: (modality === 'in-person') ? location : null,
        remote_url: (modality === 'remote') ? remoteUrl : null,
        attendees,
        category
    };



    if (editingIndex === null) {

        events.push(eventDetails);
        console.log('events:', events);
        addEventToCalendarUI(eventDetails, events.length - 1);
    } else {

        events[editingIndex] = eventDetails;
        console.log('events (updated):', events);


        const oldCard = document.querySelector(`[data-index="${editingIndex}"]`);
        if (oldCard) oldCard.remove();
        addEventToCalendarUI(eventDetails, editingIndex);

        editingIndex = null;
    }


    document.getElementById('event_form').reset();
    updateLocationOptions();




    const modalEl = document.getElementById('event_modal');
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
    }
}

function createEventCard(eventDetails) {
    const { name, weekday, time, modality, location, remote_url, attendees, category } = eventDetails;

    const card = document.createElement('div');
    card.className = `event row border rounded m-1 p-2 ${categoryClass(category)}`;

    const info = document.createElement('div');
    info.className = 'col small';

    const whereLabel = (modality === 'remote') ? 'Remote URL:' : 'Event Location:';
    const whereValue = (modality === 'remote') ? (remote_url || '') : (location || '');

    info.innerHTML = `
    <div><strong>Event Name:</strong> ${name || ''}</div>
    <div><strong>Category:</strong> ${category || ''}</div>
    <div><strong>Event Time:</strong> ${time || ''}</div>
    <div><strong>Event Modality:</strong> ${modality === 'remote' ? 'Remote' : 'In-Person'}</div>
    <div><strong>${whereLabel}</strong> ${whereValue}</div>
    <div><strong>Attendees:</strong> ${attendees || ''}</div>
  `;

    card.appendChild(info);
    return card;
}


// function createEventCard(eventDetails) {

//     const event_element = document.createElement('div');


//     event_element.className = 'event row border rounded m-1 py-1';

//     const card = document.createElement('div');
//     card.className = `event row border rounded m-1 p-2 ${categoryClass(category)}`;


//     const info = document.createElement('div');
//     info.className = 'col';


//     const { name, weekday, time, modality, location, remote_url, attendees, category } = eventDetails;
//     const where = (modality === 'remote') ? remote_url : location;

//     //     info.innerHTML = `
//     //     <div class="fw-semibold">${name || '(No title)'}</div>
//     //     <div class="small text-muted">
//     //       ${weekday || ''}${time ? ` · ${time}` : ''} · ${modality}${where ? ` · ${where}` : ''}
//     //     </div>
//     //     ${attendees ? `<div class="small">Attendees: ${attendees}</div>` : ''}
//     //   `;

//     info.innerHTML = `
//     <div><strong>Event Name:</strong> ${name || ''}</div>
//     <div><strong>Event Time:</strong> ${time || ''}</div>
//     <div><strong>Event Modality:</strong> ${modality === 'remote' ? 'Remote' : 'In-Person'}</div>
//     <div><strong>${modality === 'remote' ? 'Remote URL:' : 'Event Location:'}</strong> ${modality === 'remote' ? (remote_url || '') : (location || '')}</div>
//     <div><strong>Attendees:</strong> ${attendees || ''}</div>
//   `;


//     event_element.appendChild(info);


//     return event_element;
// }


// function addEventToCalendarUI(eventInfo) {
//     const event_card = createEventCard(eventInfo);

//     const dayId = (eventInfo.weekday || '').toLowerCase();
//     const dayDiv = document.getElementById(dayId);

//     if (!dayDiv) {
//         console.warn('No day column found for:', eventInfo.weekday);
//         return;
//     }

//     dayDiv.appendChild(event_card);
// }

function addEventToCalendarUI(eventInfo, idx) {
    const event_card = createEventCard(eventInfo);
    event_card.dataset.index = idx;
    event_card.style.cursor = 'pointer';
    event_card.addEventListener('click', () => openEditEvent(idx));

    const dayId = (eventInfo.weekday || '').toLowerCase();
    const dayDiv = document.getElementById(dayId);
    if (!dayDiv) {
        console.warn('No day column found for:', eventInfo.weekday);
        return;
    }
    dayDiv.appendChild(event_card);
}

function openEditEvent(idx) {
    editingIndex = idx;
    const e = events[idx];
    if (!e) return;

    document.getElementById('event_name').value = e.name || '';
    document.getElementById('event_category').value = e.category || 'Other';
    document.getElementById('event_weekday').value = e.weekday || 'Monday';
    document.getElementById('event_time').value = e.time || '';
    document.getElementById('event_modality').value = e.modality || 'in-person';
    updateLocationOptions();
    document.getElementById('event_location').value = e.location || '';
    document.getElementById('event_remote_url').value = e.remote_url || '';
    document.getElementById('event_attendees').value = e.attendees || '';

    const modalEl = document.getElementById('event_modal');
    document.getElementById('eventModalLabel').textContent = 'Update Event';
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}


function categoryClass(category) {
    switch ((category || '').toLowerCase()) {
        case 'academic': return 'cat-academic';
        case 'work': return 'cat-work';
        case 'vacation': return 'cat-vacation';
        case 'personal': return 'cat-personal';
        case 'sports': return 'cat-sports';
        default: return 'cat-other';
    }
}