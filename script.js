// Global Session Profile States
let currentUserProfile = localStorage.getItem('sanctuary_active_user') || ""; 
let globalAppState = {
    moods: { f_emoji: "✨", f_label: "Building Our Future", s_emoji: "🥰", s_label: "Deeply Loved" },
    telemetry: { f_lat: null, f_lon: null, s_lat: null, s_lon: null },
    ledger: []
};

// Load master setup dynamically on file load
window.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    if (currentUserProfile) {
        restoreActiveSession(currentUserProfile);
    }
});

// Dynamic Identity Verification Handshake Entrance Gate
function checkPassword() {
    const input = document.getElementById('password-input').value.trim();
    const errorMsg = document.getElementById('login-error');
    
    if (input === 'SF0805') {
        currentUserProfile = "F.."; 
        localStorage.setItem('sanctuary_active_user', "F..");
        proceedIntoSanctuary();
    } else if (input === 'SF0508') {
        currentUserProfile = "S.."; 
        localStorage.setItem('sanctuary_active_user', "S..");
        proceedIntoSanctuary();
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function restoreActiveSession(profile) {
    const badge = document.getElementById('user-session-badge');
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('sanctuary-app');
    
    if (profile === "F..") {
        badge.innerText = "Profile: F.. Synced";
        badge.style.borderColor = "rgba(147, 112, 219, 0.4)";
        badge.style.color = "#9370db";
    } else {
        badge.innerText = "Profile: S.. Synced";
        badge.style.borderColor = "rgba(255, 192, 203, 0.4)";
        badge.style.color = "#ffc0cb";
    }
    
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    initializeCoreSanctuary();
    renderAllLedgerNotes();
    calculateVectorDistance();
}

function proceedIntoSanctuary() {
    restoreActiveSession(currentUserProfile);
    triggerPushNotification("System Link", `Authenticated as ${currentUserProfile}. Matrix Loaded.`);
}

// Global UI Navigation Tab Engine
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(tab => tab.classList.add('hidden'));
    const activeLinks = document.querySelectorAll('.nav-link');
    activeLinks.forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    if(window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// ==========================================================================
// 📦 LOCAL MATRIX DATA STORAGE LAYER
// ==========================================================================
function saveStateToStorage() {
    localStorage.setItem('sanctuary_master_state', JSON.stringify(globalAppState));
}

function loadStateFromStorage() {
    const saved = localStorage.getItem('sanctuary_master_state');
    if (saved) {
        globalAppState = JSON.parse(saved);
    }
    
    // Push data elements directly into UI DOM nodes
    document.getElementById('f-emoji').innerText = globalAppState.moods.f_emoji;
    document.getElementById('f-label').innerText = globalAppState.moods.f_label;
    document.getElementById('s-emoji').innerText = globalAppState.moods.s_emoji;
    document.getElementById('s-label').innerText = globalAppState.moods.s_label;

    if (globalAppState.telemetry.f_lat) {
        document.getElementById('f-lat').innerText = `Lat: ${globalAppState.telemetry.f_lat.toFixed(4)}° N`;
        document.getElementById('f-lon').innerText = `Lon: ${globalAppState.telemetry.f_lon.toFixed(4)}° E`;
    }
    if (globalAppState.telemetry.s_lat) {
        document.getElementById('s-lat').innerText = `Lat: ${globalAppState.telemetry.s_lat.toFixed(4)}° N`;
        document.getElementById('s-lon').innerText = `Lon: ${globalAppState.telemetry.s_lon.toFixed(4)}° E`;
    }
}

// ==========================================================================
// ✨ MOOD LINK MECHANICS
// ==========================================================================
function updateLocalMood(emoji, description) {
    if (!currentUserProfile) return;

    if (currentUserProfile === "F..") {
        globalAppState.moods.f_emoji = emoji;
        globalAppState.moods.f_label = description;
    } else if (currentUserProfile === "S..") {
        globalAppState.moods.s_emoji = emoji;
        globalAppState.moods.s_label = description;
    }
    
    document.getElementById('f-emoji').innerText = globalAppState.moods.f_emoji;
    document.getElementById('f-label').innerText = globalAppState.moods.f_label;
    document.getElementById('s-emoji').innerText = globalAppState.moods.s_emoji;
    document.getElementById('s-label').innerText = globalAppState.moods.s_label;

    saveStateToStorage();
    triggerPushNotification("Mood Link", "Status logged. Copy Sync Token to share with your partner.");
}

// ==========================================================================
// 📍 HARDWARE CORE GEOLOCATION MATRIX
// ==========================================================================
function initializeLiveTracking() {
    if (navigator.geolocation) {
        triggerPushNotification("GPS Tracking", "Querying positioning parameters...");
        navigator.geolocation.getCurrentPosition(position => {
            if (currentUserProfile === "F..") {
                globalAppState.telemetry.f_lat = position.coords.latitude;
                globalAppState.telemetry.f_lon = position.coords.longitude;
            } else if (currentUserProfile === "S..") {
                globalAppState.telemetry.s_lat = position.coords.latitude;
                globalAppState.telemetry.s_lon = position.coords.longitude;
            }
            saveStateToStorage();
            loadStateFromStorage();
            calculateVectorDistance();
            triggerPushNotification("Telemetry", "Internal GPS coordinates saved locally.");
        }, () => {
            triggerPushNotification("Hardware Error", "Location query dropped.");
        }, { enableHighAccuracy: true });
    }
}

function calculateVectorDistance() {
    const lat1 = globalAppState.telemetry.f_lat;
    const lon1 = globalAppState.telemetry.f_lon;
    const lat2 = globalAppState.telemetry.s_lat;
    const lon2 = globalAppState.telemetry.s_lon;

    if (!lat1 || !lat2) {
        document.getElementById('distance-value').innerText = "Awaiting Token Sync...";
        return;
    }
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    document.getElementById('distance-value').innerText = `${(R * c).toFixed(1)} KM`;
}

// ==========================================================================
// 📝 SECURE LOCAL SHARED LEDGER NOTES
// ==========================================================================
function saveNote() {
    const title = document.getElementById('note-title').value.trim();
    const text = document.getElementById('note-text').value.trim();
    if (!title || !text) return;

    const newNote = { title, text, author: currentUserProfile, timestamp: Date.now() };
    globalAppState.ledger.push(newNote);
    
    saveStateToStorage();
    renderAllLedgerNotes();
    
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
    triggerPushNotification("Ledger", "Note committed to local memory files.");
}

function renderAllLedgerNotes() {
    const noteList = document.getElementById('notes-list');
    if (!noteList) return;
    noteList.innerHTML = '';
    
    // Sort array by newest timestamp
    const items = [...globalAppState.ledger].sort((a,b) => b.timestamp - a.timestamp);
    
    items.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card animate-slide-up';
        card.innerHTML = `
            <span style="font-size:0.65rem; color:#ffc0cb; letter-spacing:1px; text-transform:uppercase; font-weight:600;">By ${note.author}</span>
            <h3 style="margin-top:5px;">${note.title}</h3>
            <p style="color:#fff; line-height:1.6; margin-top:10px; font-size:0.95rem; white-space:pre-wrap;">${note.text}</p>
        `;
        noteList.appendChild(card);
    });
}

// ==========================================================================
// 🔗 CRYPTOGRAPHIC TOKEN SYNCHRONIZATION PORTS
// ==========================================================================
function exportSyncToken() {
    try {
        // Formulate lightweight JSON object payload string package
        const dataString = JSON.stringify(globalAppState);
        // Encode into secure base64 text package
        const secureToken = btoa(unescape(encodeURIComponent(dataString)));
        
        navigator.clipboard.writeText(secureToken).then(() => {
            triggerGlobalPopup("Sync Token Generated", "Your active system token has been copied to your clipboard. Send this text code string to your partner.");
        }).catch(() => {
            triggerGlobalPopup("Token Generated", secureToken);
        });
    } catch(err) {
        triggerPushNotification("Sync Error", "Failed to compile token parameters.");
    }
}

function importSyncToken() {
    const inputField = document.getElementById('import-token-input');
    const token = inputField.value.trim();
    if (!token) return;

    try {
        // Decode base64 data wrapper
        const decodedData = decodeURIComponent(escape(atob(token)));
        const foreignState = JSON.parse(decodedData);
        
        // Merge notes list carefully to prevent missing data duplication errors
        const uniqueNotesMap = new Map();
        globalAppState.ledger.forEach(n => uniqueNotesMap.set(`${n.author}-${n.timestamp}`, n));
        if (foreignState.ledger && Array.isArray(foreignState.ledger)) {
            foreignState.ledger.forEach(n => uniqueNotesMap.set(`${n.author}-${n.timestamp}`, n));
        }
        
        // Update master structure arrays
        globalAppState.ledger = Array.from(uniqueNotesMap.values());
        
        // Dynamic structural updates based on source origins
        globalAppState.moods = foreignState.moods;
        globalAppState.telemetry = foreignState.telemetry;
        
        saveStateToStorage();
        loadStateFromStorage();
        renderAllLedgerNotes();
        calculateVectorDistance();
        
        inputField.value = '';
        triggerGlobalPopup("Sync Complete", "Partner profile database parameters imported successfully. Profiles aligned.");
    } catch(e) {
        triggerGlobalPopup("Sync Failure", "The token string parsed could not be decoded. Ensure it was copied fully.");
    }
}

// ==========================================================================
// 🎬 RECOGNITION FALLBACK AND MEDIA UTILITIES
// ==========================================================================
function handleUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createMediaElement(e.target.result, file.type, `Memory Saved`);
        };
        reader.readAsDataURL(file);
    }
}

function createMediaElement(src, type, label) {
    const grid = document.getElementById('gallery-grid');
    const wrapper = document.createElement('div');
    wrapper.className = 'media-card-wrapper animate-fade-in';
    const card = document.createElement('div');
    card.className = 'media-card';
    if (type.startsWith('image/')) card.innerHTML = `<img src="${src}"><div class="media-overlay">${label}</div>`;
    else if (type.startsWith('video/')) card.innerHTML = `<video src="${src}" controls></video><div class="media-overlay">${label}</div>`;
    wrapper.appendChild(card);
    grid.insertBefore(wrapper, grid.firstChild);
}

let mediaRecorder, audioChunks = [], isRecording = false, recordTimerInterval, startTime;
function toggleVoiceRecording(e) {
    e.preventDefault();
    const card = document.getElementById('voice-card'), btn = e.target, text = document.getElementById('record-text'), controls = document.getElementById('rec-controls');
    if (!isRecording) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            mediaRecorder = new MediaRecorder(stream); audioChunks = [];
            mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                createMediaElement(audioUrl, 'audio/image', `Audio Clip Stored`);
            };
            mediaRecorder.start(); isRecording = true; card.classList.add('recording'); btn.innerText = "Stop"; text.innerText = `Recording Audio...`; controls.classList.remove('hidden');
            startTime = Date.now();
            recordTimerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                document.getElementById('rec-timer').innerText = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
            }, 1000);
        }).catch(() => triggerPushNotification("Error", "Mic access denied."));
    } else {
        mediaRecorder.stop(); mediaRecorder.stream.getTracks().forEach(t => t.stop()); isRecording = false; card.classList.remove('recording'); btn.innerText = "Start"; text.innerText = "Record Voice Memo"; controls.classList.add('hidden'); clearInterval(recordTimerInterval); document.getElementById('rec-timer').innerText = "00:00";
    }
}

function triggerPushNotification(sender, messageText) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = 'push-notification';
    notification.innerHTML = `<div class="notification-avatar">${sender[0]}</div><div class="notification-content"><div class="notification-header"><span class="notification-app-name">💬 SANCTUARY LINK</span></div><div class="notification-title">${sender}</div><div class="notification-body">${messageText}</div></div>`;
    container.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 5000);
}

function triggerGlobalPopup(title, body) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-body').innerText = body;
    document.getElementById('global-popup').classList.remove('hidden');
}
function closePopup() { document.getElementById('global-popup').classList.add('hidden'); }

function initializeCoreSanctuary() {
    const calGrid = document.getElementById('calendar-grid-dates');
    if (!calGrid) return; calGrid.innerHTML = '';
    for(let i=1; i<=31; i++) {
        const d = document.createElement('div'); d.innerText = i;
        if(i === 8) { d.className = 'marked'; d.onclick = () => triggerGlobalPopup("May 8th", "Our Anniversary Milestone."); }
        calGrid.appendChild(d);
    }
}
