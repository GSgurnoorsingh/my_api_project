const BACKEND_BASE = 'http://localhost:5000/api/v1';

const authPanel = document.getElementById('authPanel');
const dashboardPanel = document.getElementById('dashboardPanel');
const toast = document.getElementById('toast');
const dataListRender = document.getElementById('dataListRender');

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        mountDashboardLayout();
    }
});

function displayStatusAlert(promptString, statusFlag = true) {
    toast.innerText = promptString;
    toast.className = `msg-toast ${statusFlag ? 'msg-ok' : 'msg-err'}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

//Registration
document.getElementById('actionRegister').addEventListener('click', async () => {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const name = email.split('@')[0];

    try {
        const networkResponse = await fetch(`${BACKEND_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const parsePayload = await networkResponse.json();

        if (!networkResponse.ok) throw new Error(parsePayload.message || 'Registration structural refusal');
        displayStatusAlert('Account mapping finalized successfully! Proceed to sign-in.');
    } catch (error) {
        displayStatusAlert(error.message, false);
    }
});

//Sign in
document.getElementById('actionLogin').addEventListener('click', async () => {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    try {
        const networkResponse = await fetch(`${BACKEND_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const parsePayload = await networkResponse.json();

        if (!networkResponse.ok) throw new Error(parsePayload.message || 'Login rejection mismatch');

        localStorage.setItem('token', parsePayload.token);
        localStorage.setItem('username', parsePayload.user.name);
        localStorage.setItem('role', parsePayload.user.role);

        displayStatusAlert('Validation authenticated successfully.');
        mountDashboardLayout();
    } catch (error) {
        displayStatusAlert(error.message, false);
    }
});

//Logout 
document.getElementById('actionLogout').addEventListener('click', () => {
    localStorage.clear();
    dashboardPanel.classList.add('hidden');
    authPanel.classList.remove('hidden');
    displayStatusAlert('Session token storage purged cleanly.');
});

function mountDashboardLayout() {
    authPanel.classList.add('hidden');
    dashboardPanel.classList.remove('hidden');
    document.getElementById('labelUser').innerText = localStorage.getItem('username');
    document.getElementById('labelRole').innerText = localStorage.getItem('role');
    syncRecordCollection();
}

//Fetch data records
async function syncRecordCollection() {
    try {
        const networkResponse = await fetch(`${BACKEND_BASE}/tasks`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const parsePayload = await networkResponse.json();

        dataListRender.innerHTML = '';
        if (!parsePayload.data || parsePayload.data.length === 0) {
            dataListRender.innerHTML = '<p style="color: #64748b; font-style: italic;">No system tasks are tracked within this user scope scope.</p>';
            return;
        }

        parsePayload.data.forEach(taskItem => {
            const adminMetaTag = taskItem.User ? ` <span style="color:#059669; font-size:0.8rem;">[By: ${taskItem.User.name}]</span>` : '';
            const cardBlock = document.createElement('div');
            cardBlock.className = 'item-row';
            cardBlock.innerHTML = `
                <div>
                    <strong style="font-size: 1.1rem;">${taskItem.title}</strong>${adminMetaTag}
                    <p style="margin: 6px 0 0 0; font-size: 0.9rem; color: #475569;">${taskItem.description || 'No description added.'}</p>
                </div>
                <button class="btn-wipe" onclick="purgeRecordItem(${taskItem.id})">Delete</button>
            `;
            dataListRender.appendChild(cardBlock);
        });
    } catch (error) {
        displayStatusAlert('Failed loading current execution feed collection arrays.', false);
    }
}

//Push new data entry
document.getElementById('actionAddTask').addEventListener('click', async () => {
    const title = document.getElementById('taskTitleField').value;
    const description = document.getElementById('taskDescField').value;

    try {
        const networkResponse = await fetch(`${BACKEND_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description })
        });

        if (!networkResponse.ok) throw new Error('Data instantiation execution fault');

        document.getElementById('taskTitleField').value = '';
        document.getElementById('taskDescField').value = '';
        syncRecordCollection();
    } catch (error) {
        displayStatusAlert(error.message, false);
    }
});

//Wipe row record
async function purgeRecordItem(targetRowId) {
    try {
        const networkResponse = await fetch(`${BACKEND_BASE}/tasks/${targetRowId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const parsePayload = await networkResponse.json();

        if (!networkResponse.ok) throw new Error(parsePayload.message || 'Row execution restriction error');
        displayStatusAlert('Target tracking row wiped cleanly.');
        syncRecordCollection();
    } catch (error) {
        displayStatusAlert(error.message, false);
    }
}