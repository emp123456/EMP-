

export const DB = {

    KEYS: {
        BRIEFINGS: 'emp_briefings',
        MEETINGS: 'emp_meetings',
        USERS: 'emp_users',
        CHATS: 'emp_chats',
        ADMIN_SESSION: 'emp_admin_session',
        USER_SESSION: 'emp_user_session',
        SYNC_EVENT: 'emp_sync_event'
    },


    async hashPassword(password) {

        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Secure Context required for SHA-256. Falling back to simple encoding (INSECURE) for dev/file:// usage.");
            return btoa(password);
        }

        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },


    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        this.triggerSync(key);
    },

    triggerSync(key) {

        localStorage.setItem(this.KEYS.SYNC_EVENT, Date.now() + ':' + key);
    },

    onDataChange(callback) {
        window.addEventListener('storage', (e) => {
            if (e.key === this.KEYS.SYNC_EVENT || e.key === this.KEYS.CHATS) {
                callback();
            }
        });
    },


    addBriefing(briefing) {
        const list = this.get(this.KEYS.BRIEFINGS);
        briefing.id = Date.now().toString(36);
        briefing.timestamp = new Date().toISOString();
        briefing.status = 'NEW';

        list.push(briefing);
        this.save(this.KEYS.BRIEFINGS, list);
        return briefing;
    },

    getBriefings() {
        return this.get(this.KEYS.BRIEFINGS).reverse();
    },


    addMeeting(meeting) {
        const list = this.get(this.KEYS.MEETINGS);
        meeting.id = Date.now().toString(36);
        meeting.timestamp = new Date().toISOString();
        meeting.status = 'SCHEDULED';
        list.push(meeting);
        this.save(this.KEYS.MEETINGS, list);
        return meeting;
    },

    getMeetings() {
        return this.get(this.KEYS.MEETINGS).reverse();
    },




    async registerUser(name, password) {
        const users = this.get(this.KEYS.USERS);


        const existing = users.find(u => u.name === name);
        if (existing) {
            return { error: "USUÁRIO JÁ EXISTE." };
        }

        const passwordHash = await this.hashPassword(password);

        const user = {
            id: 'user_' + Date.now().toString(36),
            name: this.escapeHTML(name),
            password: passwordHash,
            joined: new Date().toISOString()
        };

        users.push(user);
        this.save(this.KEYS.USERS, users);


        localStorage.setItem(this.KEYS.USER_SESSION, JSON.stringify(user));
        return user;
    },

    async loginUser(name, password) {
        const users = this.get(this.KEYS.USERS);
        const passwordHash = await this.hashPassword(password);
        const user = users.find(u => u.name === name && u.password === passwordHash);

        if (user) {
            localStorage.setItem(this.KEYS.USER_SESSION, JSON.stringify(user));
            return user;
        }
        return null;
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.KEYS.USER_SESSION));
    },

    getUsers() {
        return this.get(this.KEYS.USERS);
    },


    sendMessage(fromId, toId, text) {
        const chats = this.get(this.KEYS.CHATS) || {};



        let chatId = (fromId === 'ADMIN') ? toId : fromId;

        if (!chats[chatId]) chats[chatId] = [];

        const msg = {
            from: fromId,
            text: this.escapeHTML(text),
            timestamp: new Date().toISOString()
        };

        chats[chatId].push(msg);
        localStorage.setItem(this.KEYS.CHATS, JSON.stringify(chats));
        return msg;
    },

    getMessages(userId) {
        const chats = this.get(this.KEYS.CHATS) || {};
        return chats[userId] || [];
    },


    async loginAdmin(password) {
        const hash = await this.hashPassword(password);
        const VALID_HASH = '482c811da5d5b4bc6d497c9c060e4514fdb2f0b70c1e874457b0553761b8f046';
        const FALLBACK_HASH = 'dm9pZDEyMw==';

        if (hash === VALID_HASH || hash === FALLBACK_HASH) {
            localStorage.setItem(this.KEYS.ADMIN_SESSION, 'true');
            return true;
        }
        return false;
    },

    isAdmin() {
        return localStorage.getItem(this.KEYS.ADMIN_SESSION) === 'true';
    },

    logoutAdmin() {
        localStorage.removeItem(this.KEYS.ADMIN_SESSION);
    }
};
