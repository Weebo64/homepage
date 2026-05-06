const GHOSTPAWZ_DISCORD_ID = '801089753038061669';
const KYTRONIX_DISCORD_ID = '331794107791835136';
const HARDERDK_DISCORD_ID = '188098872952881152';

async function loadHarderdkPresence() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${HARDERDK_DISCORD_ID}`);
        const data = await response.json();

        if (data.success && data.data) {
            const presence = data.data;
            const user = presence.discord_user;

            const avatarImg = document.getElementById('harderdk-avatar');
            const avatarPlaceholder = document.getElementById('harderdk-placeholder');
            if (avatarImg && user.avatar) {
                const avatarUrl = user.avatar.startsWith('a_') 
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=256`
                    : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
                avatarImg.src = avatarUrl;
                avatarImg.style.display = 'block';
                if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
            }

            const nameEl = document.getElementById('harderdk-name');
            if (nameEl && user.display_name) {
                nameEl.textContent = user.display_name;
            }

            const usernameEl = document.getElementById('harderdk-username');
            if (usernameEl) {
                usernameEl.textContent = `@${user.username}`;
            }

            const statusBadge = document.getElementById('harderdk-status');
            if (statusBadge) {
                statusBadge.className = `discord-status-badge status-${presence.discord_status}`;
                statusBadge.title = getStatusText(presence.discord_status);
            }

            const activityEl = document.getElementById('harderdk-activity');
            if (activityEl) {
                let activityHTML = '';

                if (presence.listening_to_spotify && presence.spotify) {
                    activityHTML = `<div class="activity-text">🎵 ${presence.spotify.song}</div>`;
                }
                else if (presence.activities && presence.activities.length > 0) {
                    const activity = presence.activities[0];
                    if (activity.type === 4) {
                        const emoji = activity.emoji ? (activity.emoji.name || '') : '';
                        activityHTML = `<div class="activity-text">${emoji} ${activity.state || ''}</div>`;
                    } else {
                        const activityTypes = {
                            0: 'Playing',
                            1: 'Streaming',
                            2: 'Listening to',
                            3: 'Watching',
                            5: 'Competing in'
                        };
                        const typeText = activityTypes[activity.type] || '';
                        activityHTML = `<div class="activity-text">${typeText} ${activity.name}</div>`;
                    }
                }

                activityEl.innerHTML = activityHTML;
            }

            console.log('✅ Harder DK presence loaded');
        }
    } catch (error) {
        console.error('Failed to load Harder DK presence:', error);
    }
}

async function loadKytronixPresence() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${KYTRONIX_DISCORD_ID}`);
        const data = await response.json();

        if (data.success && data.data) {
            const presence = data.data;
            const user = presence.discord_user;

            const avatarImg = document.getElementById('kytronix-avatar');
            const avatarPlaceholder = document.getElementById('kytronix-placeholder');
            if (avatarImg && user.avatar) {
                const avatarUrl = user.avatar.startsWith('a_') 
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=256`
                    : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
                avatarImg.src = avatarUrl;
                avatarImg.style.display = 'block';
                if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
            }

            const nameEl = document.getElementById('kytronix-name');
            if (nameEl && user.display_name) {
                nameEl.textContent = user.display_name;
            }

            const usernameEl = document.getElementById('kytronix-username');
            if (usernameEl) {
                usernameEl.textContent = `@${user.username}`;
            }

            const statusBadge = document.getElementById('kytronix-status');
            if (statusBadge) {
                statusBadge.className = `discord-status-badge status-${presence.discord_status}`;
                statusBadge.title = getStatusText(presence.discord_status);
            }

            const activityEl = document.getElementById('kytronix-activity');
            if (activityEl) {
                let activityHTML = '';

                if (presence.listening_to_spotify && presence.spotify) {
                    activityHTML = `<div class="activity-text">🎵 ${presence.spotify.song}</div>`;
                }
                else if (presence.activities && presence.activities.length > 0) {
                    const activity = presence.activities[0];
                    if (activity.type === 4) {
                        const emoji = activity.emoji ? (activity.emoji.name || '') : '';
                        activityHTML = `<div class="activity-text">${emoji} ${activity.state || ''}</div>`;
                    } else {
                        const activityTypes = {
                            0: 'Playing',
                            1: 'Streaming',
                            2: 'Listening to',
                            3: 'Watching',
                            5: 'Competing in'
                        };
                        const typeText = activityTypes[activity.type] || '';
                        activityHTML = `<div class="activity-text">${typeText} ${activity.name}</div>`;
                    }
                }

                activityEl.innerHTML = activityHTML;
            }

            console.log('✅ kytronix presence loaded');
        }
    } catch (error) {
        console.error('Failed to load kytronix presence:', error);
    }
}

async function loadGhostpawzPresence() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${GHOSTPAWZ_DISCORD_ID}`);
        const data = await response.json();

        if (data.success && data.data) {
            const presence = data.data;
            const user = presence.discord_user;

            const avatarImg = document.getElementById('gh0stp4wz-avatar');
            const avatarPlaceholder = document.getElementById('gh0stp4wz-placeholder');
            if (avatarImg && user.avatar) {
                avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
                avatarImg.style.display = 'block';
                if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
            }

            const usernameEl = document.getElementById('gh0stp4wz-username');
            if (usernameEl) {
                const displayName = user.display_name || user.global_name || user.username;
                usernameEl.textContent = `@${displayName}`;
            }

            const statusBadge = document.getElementById('gh0stp4wz-status');
            if (statusBadge) {
                statusBadge.className = `discord-status-badge status-${presence.discord_status}`;
                statusBadge.title = getStatusText(presence.discord_status);
            }

            const activityEl = document.getElementById('gh0stp4wz-activity');
            if (activityEl) {
                let activityHTML = '';

                if (presence.listening_to_spotify && presence.spotify) {
                    activityHTML = `<div class="activity-text">🎵 ${presence.spotify.song}</div>`;
                }
                else if (presence.activities && presence.activities.length > 0) {
                    const activity = presence.activities[0];
                    if (activity.type === 4) {
                        const emoji = activity.emoji ? (activity.emoji.name || '') : '';
                        activityHTML = `<div class="activity-text">${emoji} ${activity.state || ''}</div>`;
                    } else {
                        const activityTypes = {
                            0: 'Playing',
                            1: 'Streaming',
                            2: 'Listening to',
                            3: 'Watching',
                            5: 'Competing in'
                        };
                        const typeText = activityTypes[activity.type] || '';
                        activityHTML = `<div class="activity-text">${typeText} ${activity.name}</div>`;
                    }
                }

                activityEl.innerHTML = activityHTML;
            }

            console.log('✅ GH0STP4WZ presence loaded');
        }
    } catch (error) {
        console.error('Failed to load GH0STP4WZ presence:', error);
    }
}

function getStatusText(status) {
    const statusMap = {
        'online': 'Online',
        'idle': 'Idle',
        'dnd': 'Do Not Disturb',
        'offline': 'Offline'
    };
    return statusMap[status] || 'Unknown';
}

loadHarderdkPresence();
loadKytronixPresence();
loadGhostpawzPresence();

setInterval(loadHarderdkPresence, 30000);
setInterval(loadKytronixPresence, 30000);
setInterval(loadGhostpawzPresence, 30000);

// Modal functionality
function openFriendModal(friendCard) {
    const modal = document.createElement('div');
    modal.className = 'friend-modal active';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => modal.remove();
    
    // Clone the friend card content
    const avatar = friendCard.querySelector('.friend-avatar').cloneNode(true);
    avatar.className = 'modal-avatar';
    
    const info = friendCard.cloneNode(true);
    const modalInfo = document.createElement('div');
    modalInfo.className = 'modal-info';
    
    // Get all the info elements
    const name = info.querySelector('.friend-name').cloneNode(true);
    const username = info.querySelector('.friend-username').cloneNode(true);
    const aka = info.querySelector('.friend-aka')?.cloneNode(true);
    const role = info.querySelector('.friend-role')?.cloneNode(true);
    const pronouns = info.querySelector('.friend-pronouns')?.cloneNode(true);
    const activity = info.querySelector('.friend-activity')?.cloneNode(true);
    const links = info.querySelector('.friend-links')?.cloneNode(true);
    
    modalInfo.appendChild(name);
    modalInfo.appendChild(username);
    if (aka) modalInfo.appendChild(aka);
    if (role) modalInfo.appendChild(role);
    if (pronouns) modalInfo.appendChild(pronouns);
    if (activity) modalInfo.appendChild(activity);
    if (links) modalInfo.appendChild(links);
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(avatar);
    modalContent.appendChild(modalInfo);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

document.querySelectorAll('.friend-card').forEach((card, index) => {
    const avatar = card.querySelector('.avatar-placeholder');
    if (avatar) {
        avatar.style.animationDelay = `${index * 0.3}s`;
    }

    // Add click handler for modal
    card.addEventListener('click', function(e) {
        // Don't open modal if clicking on a link
        if (e.target.closest('.friend-link')) {
            return;
        }
        // Don't open modal if it's ilynora (has special page)
        if (this.hasAttribute('onclick')) {
            return;
        }
        openFriendModal(this);
    });

    // Reduced sparkle count on hover for better performance
    card.addEventListener('mouseenter', function () {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                if (typeof createSparkle === 'function') {
                    createSparkle(x, y);
                }
            }, i * 150);
        }
    });
});

let lastHighlighted = null;

function highlightRandomFriend() {
    const cards = document.querySelectorAll('.friend-card');
    if (cards.length === 0) return;

    if (lastHighlighted) {
        lastHighlighted.style.transform = '';
        lastHighlighted.style.boxShadow = '';
    }

    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    randomCard.style.transform = 'translateY(-10px) scale(1.05)';
    randomCard.style.boxShadow = '0 20px 60px rgba(255, 223, 0, 0.6)';

    lastHighlighted = randomCard;

    setTimeout(() => {
        if (lastHighlighted === randomCard) {
            randomCard.style.transform = '';
            randomCard.style.boxShadow = '';
            lastHighlighted = null;
        }
    }, 3000);
}

setInterval(highlightRandomFriend, 10000);
