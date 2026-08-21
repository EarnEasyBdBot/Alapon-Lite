// app.js — Alapon Lite (Custom Logo, Fixed Avatar Camera, Pro Messenger, Audio Call, Voice & Reactions)
import { supabase, isConfigured, uploadFile } from './supabase.js';

// Assets
const ASSETS = {
  appLogo: `https://i.postimg.cc/W39S6FFL/file-0000000025e8820b9949851f1e324c5f.png`,
  chatBg: `https://i.postimg.cc/QC2zcdNB/file-00000000f8bc820b9191ddc7162e54a0.png`,
  maleAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23315cff"/><stop offset="100%" stop-color="%237544ff"/></linearGradient></defs><rect width="100" height="100" fill="url(%23mg)"/><circle cx="50" cy="38" r="22" fill="%23ffffff"/><path d="M15 88 C15 65, 30 58, 50 58 C70 58, 85 65, 85 88 Z" fill="%23ffffff"/></svg>`,
  femaleAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%238b5cf6"/></linearGradient></defs><rect width="100" height="100" fill="url(%23fg)"/><circle cx="50" cy="38" r="20" fill="%23ffffff"/><path d="M25 45 Q50 60 75 45 Q70 20 50 20 Q30 20 25 45 Z" fill="%234a044e"/><path d="M18 88 C18 66, 32 60, 50 60 C68 60, 82 66, 82 88 Z" fill="%23ffffff"/></svg>`
};

// SVG Icons
const ICONS = {
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  friends: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  messages: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  profile: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e63946"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  heartOutline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  comment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  image: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  location: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>`,
  smile: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>`,
  camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  more: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  stop: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  reply: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`
};

// Global App State
const state = {
  user: null,
  profile: null,
  currentView: 'feed',
  profileTab: 'posts',
  activeChatUser: null,
  replyingToMessage: null,
  activeCallingState: null,
  onlineUsers: new Set(),
  posts: [],
  stories: [],
  friends: [],
  friendRequests: [],
  suggestedUsers: [],
  notifications: [],
  activeCommentsPostId: null,
  commentsList: [],
  unreadMessagesCount: 0,
  unreadNotificationsCount: 0,
  modal: null,
  settingsSubType: null,
  activeStory: null,
  signupStep: 1,
  signupDraft: { fullName: '', email: '', username: '', password: '', birthDate: '', gender: 'male', avatarUrl: '' },
  postDraft: { content: '', mediaUrl: '', privacy: 'public', location: '', feeling: '' }
};

let mediaRecorder = null;
let audioChunks = [];
let isRecordingAudio = false;

const app = document.getElementById('app');

function getUserAvatar(prof) {
  if (prof?.avatar_url && prof.avatar_url.trim().length > 5) return prof.avatar_url;
  return prof?.gender === 'female' ? ASSETS.femaleAvatar : ASSETS.maleAvatar;
}

// ----------------------------------------------------
// RICH TEXT PARSER (#tags, @mentions, URLs)
// ----------------------------------------------------
function formatRichText(rawText) {
  if (!rawText) return '';
  let text = escapeHtml(rawText);
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="rich-link" onclick="event.stopPropagation();">$1</a>');
  text = text.replace(/@([a-zA-Z0-9_]+)/g, '<span class="rich-mention" onclick="window.handleMentionClick(event, \'$1\')">@$1</span>');
  text = text.replace(/#([a-zA-Z0-9_\u0980-\u09FF]+)/g, '<span class="rich-hashtag" onclick="window.handleHashtagClick(event, \'$1\')">#$1</span>');
  return text;
}

window.handleMentionClick = async (event, username) => {
  event.stopPropagation();
  const { data } = await supabase.from('profiles').select('*').ilike('username', username).single();
  if (data) {
    if (data.id === state.user?.id) state.currentView = 'profile';
    else { state.activeChatUser = data; state.currentView = 'messages'; }
    renderApp();
  } else {
    showToast(`User @${username} not found.`);
  }
};

window.handleHashtagClick = (event, tag) => {
  event.stopPropagation();
  state.currentView = 'feed';
  showToast(`Filtering posts by #${tag}`);
  renderApp();
};

function showToast(msg) {
  const existing = document.getElementById('appToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'appToast';
  toast.className = 'toast-popup';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// ----------------------------------------------------
// 3D ANIMATED SPLASH SCREEN (Clean Logo & No Side Glow)
// ----------------------------------------------------
async function init() {
  if (!isConfigured()) {
    app.innerHTML = `<div class="boot"><div class="brand-logo-img"><img src="${ASSETS.appLogo}" alt="Logo"></div><h2>Alapon Lite Configuration</h2><p class="muted">Check credentials in supabase.js</p></div>`;
    return;
  }

  render3DSplashScreen();

  const sessionPromise = supabase.auth.getSession();
  const delayPromise = new Promise(resolve => setTimeout(resolve, 3800));
  const [{ data: { session } }] = await Promise.all([sessionPromise, delayPromise]);

  if (session?.user) {
    state.user = session.user;
    await loadUserProfile();
    await loadInitialData();
    setupRealtime();
    setupCallSignaling();
    renderApp();
  } else {
    renderAuth('login');
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      state.user = session.user;
      await loadUserProfile();
      await loadInitialData();
      setupRealtime();
      setupCallSignaling();
      renderApp();
    } else if (event === 'SIGNED_OUT') {
      state.user = null;
      state.profile = null;
      renderAuth('login');
    }
  });
}

function render3DSplashScreen() {
  app.innerHTML = `
    <div class="splash-3d-screen">
      <div class="floating-badge badge-top-left">👥</div>
      <div class="floating-badge badge-top-right">💬</div>
      <div class="floating-badge badge-mid-left">❤️</div>
      <div class="floating-badge badge-mid-right">👍</div>

      <div class="splash-3d-center">
        <!-- Clean Image Logo -->
        <div class="splash-clean-logo-box">
          <img src="${ASSETS.appLogo}" alt="Alapon Logo" class="splash-main-logo-img">
        </div>
        
        <h1 class="splash-3d-title">Alapon <span class="splash-verified-icon">✔</span></h1>
        <p class="splash-3d-tagline">Connect • Share • Grow</p>
        
        <div class="splash-3d-progress-container">
          <div class="splash-3d-progress-bar"></div>
        </div>
        <span class="splash-3d-loading-text">Loading...</span>
      </div>

      <div class="splash-3d-globe-wrap">
        <svg class="splash-3d-globe" viewBox="0 0 400 200" fill="none">
          <ellipse cx="200" cy="200" rx="190" ry="120" fill="url(#globeGrad)" opacity="0.85"/>
          <path d="M30 180 Q200 80 370 180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4"/>
          <path d="M80 190 Q200 110 320 190" stroke="#818cf8" stroke-width="1.5"/>
          <circle cx="90" cy="155" r="4" fill="#38bdf8" class="pulse-node"/>
          <circle cx="200" cy="115" r="5" fill="#f43f5e" class="pulse-node"/>
          <circle cx="310" cy="155" r="4" fill="#a855f7" class="pulse-node"/>
          <defs>
            <linearGradient id="globeGrad" x1="200" y1="80" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stop-color="#312e81"/>
              <stop offset="1" stop-color="#090527"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  `;
}

// Data loaders
async function loadUserProfile() {
  const { data } = await supabase.from('profiles').select('*').eq('id', state.user.id).single();
  if (data) state.profile = data;
}

async function loadInitialData() {
  await Promise.all([
    loadFeed(),
    loadStories(),
    loadFriendsData(),
    loadSuggestedUsers(),
    loadNotifications(),
    loadUnreadCounts()
  ]);
}

async function loadFeed() {
  const { data } = await supabase
    .from('posts')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender, is_verified), post_likes (id, user_id), comments (id), post_shares (id)`)
    .order('created_at', { ascending: false });
  if (data) state.posts = data;
}

async function loadStories() {
  const { data } = await supabase
    .from('stories')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender)`)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (data) state.stories = data;
}

async function loadFriendsData() {
  if (!state.user) return;
  const { data: reqs } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id (id, full_name, username, avatar_url, gender)`)
    .eq('receiver_id', state.user.id)
    .eq('status', 'pending');
  state.friendRequests = reqs || [];

  const { data: fList } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id(id, full_name, username, avatar_url, gender), receiver:receiver_id(id, full_name, username, avatar_url, gender)`)
    .or(`requester_id.eq.${state.user.id},receiver_id.eq.${state.user.id}`)
    .eq('status', 'accepted');
  state.friends = (fList || []).map(f => f.requester_id === state.user.id ? f.receiver : f.requester);
}

async function loadSuggestedUsers() {
  if (!state.user) return;
  const friendIds = new Set([state.user.id, ...state.friends.map(f => f.id), ...state.friendRequests.map(r => r.requester_id)]);
  const { data: allUsers } = await supabase.from('profiles').select('*').limit(20);
  state.suggestedUsers = (allUsers || []).filter(u => !friendIds.has(u.id));
}

async function loadNotifications() {
  if (!state.user) return;
  const { data } = await supabase
    .from('notifications')
    .select(`*, actor:actor_id (id, full_name, avatar_url, gender)`)
    .eq('user_id', state.user.id)
    .order('created_at', { ascending: false })
    .limit(20);
  state.notifications = data || [];
}

async function loadUnreadCounts() {
  if (!state.user) return;
  const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', state.user.id).eq('is_read', false);
  const { count: notifCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', state.user.id).eq('is_read', false);
  state.unreadMessagesCount = msgCount || 0;
  state.unreadNotificationsCount = notifCount || 0;
}

function setupRealtime() {
  const presenceChannel = supabase.channel('online_presence', {
    config: { presence: { key: state.user?.id } }
  });

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const presenceState = presenceChannel.presenceState();
      state.onlineUsers = new Set(Object.keys(presenceState));
      updateActiveUserStatus();
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ online_at: new Date().toISOString(), user_id: state.user?.id });
      }
    });

  supabase
    .channel('public:alapon_general_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => { loadFeed().then(renderApp); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
      loadFeed().then(renderApp);
      if (state.activeCommentsPostId === payload.new?.post_id) {
        loadPostComments(state.activeCommentsPostId);
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
      if (state.activeChatUser && (payload.new?.sender_id === state.activeChatUser.id || payload.new?.receiver_id === state.activeChatUser.id)) {
        loadChatMessages(state.activeChatUser.id);
      }
      loadUnreadCounts().then(renderApp);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => { loadStories().then(renderApp); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => { loadNotifications().then(renderApp); })
    .subscribe();
}

function updateActiveUserStatus() {
  const statusEl = document.getElementById('chatUserActiveStatus');
  if (statusEl && state.activeChatUser) {
    const isOnline = state.onlineUsers.has(state.activeChatUser.id);
    statusEl.innerHTML = isOnline ? `<span style="color:#10b981;">🟢 Active Now</span>` : `<span style="color:#94a3b8;">⚪ Offline</span>`;
  }
}

// ----------------------------------------------------
// CALL SYSTEM (Signaling over Supabase Broadcast)
// ----------------------------------------------------
let callChannel = null;

function setupCallSignaling() {
  if (!state.user) return;
  callChannel = supabase.channel(`call_channel_${state.user.id}`);
  callChannel
    .on('broadcast', { event: 'incoming_call' }, ({ payload }) => {
      if (state.activeCallingState) return;
      state.activeCallingState = {
        isIncoming: true,
        user: payload.caller,
        channelId: payload.channelId
      };
      playRingtone();
      renderApp();
    })
    .on('broadcast', { event: 'call_declined' }, () => {
      stopRingtone();
      endActiveCall();
      showToast('Call declined.');
    })
    .on('broadcast', { event: 'call_accepted' }, async () => {
      stopRingtone();
      showToast('Call connected! 🎙️');
      const banner = document.getElementById('callDurationText');
      if (banner) banner.innerText = 'Connected (Audio Active)';
    })
    .subscribe();
}

function playRingtone() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioContext.currentTime);
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    state._ringOsc = osc;
    state._ringCtx = audioContext;
  } catch(e) {}
}

function stopRingtone() {
  if (state._ringOsc) {
    try { state._ringOsc.stop(); } catch(e){}
    state._ringOsc = null;
  }
  if (state._ringCtx) {
    try { state._ringCtx.close(); } catch(e){}
    state._ringCtx = null;
  }
}

function startAudioCall(targetUser) {
  state.activeCallingState = {
    isIncoming: false,
    user: targetUser
  };
  renderApp();
  playRingtone();

  const targetChannel = supabase.channel(`call_channel_${targetUser.id}`);
  targetChannel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      targetChannel.send({
        type: 'broadcast',
        event: 'incoming_call',
        payload: { caller: state.profile, channelId: state.user.id }
      });
    }
  });
}

function endActiveCall() {
  stopRingtone();
  if (state.activeCallingState?.user) {
    const targetChannel = supabase.channel(`call_channel_${state.activeCallingState.user.id}`);
    targetChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        targetChannel.send({ type: 'broadcast', event: 'call_declined', payload: {} });
      }
    });
  }
  state.activeCallingState = null;
  renderApp();
}

// ----------------------------------------------------
// AUTH (Login & 5-Step Wizard)
// ----------------------------------------------------
function renderAuth(mode = 'login') {
  if (mode === 'login') {
    app.innerHTML = `
      <div class="auth">
        <div class="auth-hero">
          <div class="hero-inner">
            <div class="brand-logo-img" style="width:78px;height:78px;margin-bottom:16px;">
              <img src="${ASSETS.appLogo}" alt="Alapon Lite">
            </div>
            <h1>Alapon Lite</h1>
            <p>Connect • Share • Grow</p>
          </div>
        </div>
        <div class="auth-card">
          <div class="card">
            <h2>Login</h2>
            <p class="muted" style="margin-bottom:20px;">Welcome back! Please login to your account.</p>
            <form id="loginForm">
              <div class="field">
                <label>Email or Username</label>
                <input class="input" type="text" id="loginIdentifier" placeholder="Enter email or username" required>
              </div>
              <div class="field">
                <label>Password</label>
                <input class="input" type="password" id="loginPassword" placeholder="••••••••" required>
              </div>
              <div class="row between" style="margin: 15px 0;">
                <label style="font-size:13px;display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <input type="checkbox" id="rememberMe"> Remember Me
                </label>
                <a href="#" style="font-size:13px;color:#315cff;text-decoration:none;font-weight:700;">Forgot Password?</a>
              </div>
              <button class="btn primary full" type="submit">Login →</button>
              <p class="center muted" style="margin-top:28px;font-size:14px;">
                Don't have an account? <a href="#" id="toSignup" style="color:#315cff;font-weight:800;text-decoration:none;">Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    `;
    document.getElementById('toSignup').onclick = (e) => { e.preventDefault(); state.signupStep = 1; renderAuth('signup'); };
    document.getElementById('loginForm').onsubmit = handleLoginSubmit;
  } else {
    renderSignupStep();
  }
}

function renderSignupStep() {
  const step = state.signupStep;
  let stepHtml = '';

  if (step === 1) {
    stepHtml = `
      <h2>Full Name</h2>
      <p class="muted" style="margin-bottom:20px;">What is your full name?</p>
      <div class="field">
        <label>Full Name</label>
        <input class="input" type="text" id="stepFullName" placeholder="e.g. Hasan Ahmed" value="${escapeHtml(state.signupDraft.fullName)}" autofocus required>
      </div>
      <button class="btn primary full" id="nextStepBtn" style="margin-top:16px;">Next →</button>
    `;
  } else if (step === 2) {
    stepHtml = `
      <h2>Email & Username</h2>
      <p class="muted" style="margin-bottom:20px;">Choose your login details.</p>
      <div class="field">
        <label>Email Address</label>
        <input class="input" type="email" id="stepEmail" placeholder="hasan@example.com" value="${escapeHtml(state.signupDraft.email)}" required>
      </div>
      <div class="field">
        <label>Username</label>
        <input class="input" type="text" id="stepUsername" placeholder="hasan8273" value="${escapeHtml(state.signupDraft.username)}" required>
      </div>
      <button class="btn primary full" id="nextStepBtn" style="margin-top:16px;">Next →</button>
    `;
  } else if (step === 3) {
    stepHtml = `
      <h2>Create Password</h2>
      <p class="muted" style="margin-bottom:20px;">Choose a secure password (min 6 chars).</p>
      <div class="field">
        <label>Password</label>
        <input class="input" type="password" id="stepPassword" placeholder="••••••••" value="${escapeHtml(state.signupDraft.password)}" minlength="6" required>
      </div>
      <button class="btn primary full" id="nextStepBtn" style="margin-top:16px;">Next →</button>
    `;
  } else if (step === 4) {
    stepHtml = `
      <h2>Date of Birth & Gender</h2>
      <p class="muted" style="margin-bottom:20px;">Select your birthday and gender.</p>
      <div class="field">
        <label>Date of Birth</label>
        <input class="input" type="date" id="stepBirthDate" value="${state.signupDraft.birthDate}">
      </div>
      <div class="field">
        <label>Gender</label>
        <div class="row" style="gap:15px;margin-top:8px;">
          <label class="gender-pill ${state.signupDraft.gender === 'male' ? 'active' : ''}">
            <input type="radio" name="gender" value="male" ${state.signupDraft.gender === 'male' ? 'checked' : ''} style="display:none;">
            👨 Male
          </label>
          <label class="gender-pill ${state.signupDraft.gender === 'female' ? 'active' : ''}">
            <input type="radio" name="gender" value="female" ${state.signupDraft.gender === 'female' ? 'checked' : ''} style="display:none;">
            👩 Female
          </label>
        </div>
      </div>
      <button class="btn primary full" id="nextStepBtn" style="margin-top:20px;">Next →</button>
    `;
  } else if (step === 5) {
    const defaultImg = state.signupDraft.gender === 'female' ? ASSETS.femaleAvatar : ASSETS.maleAvatar;
    stepHtml = `
      <h2>Profile Picture</h2>
      <p class="muted" style="margin-bottom:20px;">Upload your picture or keep the default.</p>
      <div class="center" style="margin:25px 0;">
        <div class="avatar" id="signupAvatarPreview" style="width:110px;height:110px;margin:auto;box-shadow:0 8px 25px rgba(49,92,255,0.2);">
          <img src="${state.signupDraft.avatarUrl || defaultImg}">
        </div>
        <input type="file" id="stepAvatarFile" accept="image/*" style="display:none;">
        <button type="button" class="btn secondary" id="triggerAvatarUpload" style="margin-top:16px;">
          ${ICONS.camera} &nbsp; Upload Photo
        </button>
      </div>
      <button class="btn primary full" id="finishSignupBtn">Sign Up →</button>
    `;
  }

  app.innerHTML = `
    <div class="auth">
      <div class="auth-hero">
        <div class="hero-inner">
          <div class="brand-logo-img" style="width:78px;height:78px;margin-bottom:16px;">
            <img src="${ASSETS.appLogo}" alt="Alapon Lite">
          </div>
          <h1>Alapon Lite</h1>
          <p>Connect • Share • Grow</p>
        </div>
      </div>
      <div class="auth-card">
        <div class="card">
          <div class="row between" style="margin-bottom:15px;">
            <button class="btn ghost" id="stepBackBtn" style="padding:4px 8px;">${ICONS.back}</button>
            <span style="font-size:13px;color:#8a90a5;font-weight:700;">Alapon</span>
          </div>
          ${stepHtml}
          <p class="center muted" style="margin-top:20px;font-size:13.5px;">
            Already have an account? <a href="#" id="toLoginFromWizard" style="color:#315cff;font-weight:800;text-decoration:none;">Login</a>
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('toLoginFromWizard').onclick = (e) => { e.preventDefault(); renderAuth('login'); };
  document.getElementById('stepBackBtn').onclick = () => {
    if (state.signupStep > 1) { state.signupStep--; renderSignupStep(); }
    else { renderAuth('login'); }
  };

  if (step === 1) {
    document.getElementById('nextStepBtn').onclick = () => {
      const val = document.getElementById('stepFullName').value.trim();
      if (!val) return alert('Please enter your full name');
      state.signupDraft.fullName = val;
      state.signupStep = 2;
      renderSignupStep();
    };
  } else if (step === 2) {
    document.getElementById('nextStepBtn').onclick = () => {
      const email = document.getElementById('stepEmail').value.trim();
      const username = document.getElementById('stepUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
      if (!email || !username) return alert('Please fill in both fields');
      state.signupDraft.email = email;
      state.signupDraft.username = username;
      state.signupStep = 3;
      renderSignupStep();
    };
  } else if (step === 3) {
    document.getElementById('nextStepBtn').onclick = () => {
      const pass = document.getElementById('stepPassword').value;
      if (pass.length < 6) return alert('Password must be at least 6 characters');
      state.signupDraft.password = pass;
      state.signupStep = 4;
      renderSignupStep();
    };
  } else if (step === 4) {
    document.querySelectorAll('.gender-pill').forEach(pill => {
      pill.onclick = () => {
        const rad = pill.querySelector('input');
        state.signupDraft.gender = rad.value;
        renderSignupStep();
      };
    });
    document.getElementById('nextStepBtn').onclick = () => {
      state.signupDraft.birthDate = document.getElementById('stepBirthDate').value;
      state.signupStep = 5;
      renderSignupStep();
    };
  } else if (step === 5) {
    const fileInput = document.getElementById('stepAvatarFile');
    document.getElementById('triggerAvatarUpload').onclick = () => fileInput.click();
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const ext = file.name.split('.').pop();
        const path = `avatars/${Date.now()}_reg.${ext}`;
        const url = await uploadFile('avatars', path, file);
        state.signupDraft.avatarUrl = url;
        document.getElementById('signupAvatarPreview').innerHTML = `<img src="${url}">`;
      } catch (err) { alert('Upload failed: ' + err.message); }
    };
    document.getElementById('finishSignupBtn').onclick = handleFinalSignup;
  }
}

async function handleFinalSignup() {
  const d = state.signupDraft;
  const avatarToUse = d.avatarUrl || (d.gender === 'female' ? ASSETS.femaleAvatar : ASSETS.maleAvatar);
  
  const { data, error } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      data: { full_name: d.fullName, username: d.username, birth_date: d.birthDate, gender: d.gender, avatar_url: avatarToUse }
    }
  });

  if (error) {
    alert(error.message);
  } else {
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email: d.email, password: d.password });
    if (loginErr) {
      alert('Account created! Please login.');
      renderAuth('login');
    }
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const ident = document.getElementById('loginIdentifier').value.trim();
  const password = document.getElementById('loginPassword').value;
  let email = ident;
  if (!ident.includes('@')) {
    const { data } = await supabase.rpc('get_email_by_username', { p_username: ident });
    if (!data) return alert('Username not found. Please use email.');
    email = data;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

// ----------------------------------------------------
// MAIN APPLICATION SHELL
// ----------------------------------------------------
function renderApp() {
  const p = state.profile || { full_name: 'User', username: 'user' };
  const currentAvatar = getUserAvatar(p);
  const isChatActive = state.currentView === 'messages' && state.activeChatUser !== null;

  app.innerHTML = `
    <div class="app-shell ${isChatActive ? 'in-chat-mode' : ''}">
      <!-- TOP BAR -->
      <header class="topbar">
        <div class="brand" id="brandHomeBtn">
          <div class="brand-logo-img">
            <img src="${ASSETS.appLogo}" alt="Logo">
          </div>
          <span class="brand-title">Alapon Lite</span>
        </div>

        <div class="top-actions">
          <button class="icon-btn" id="openSearchBtn" title="Search">${ICONS.search}</button>
          <button class="icon-btn" id="openNotifBtn" title="Notifications">
            ${ICONS.bell}
            ${state.unreadNotificationsCount > 0 ? `<span class="badge">${state.unreadNotificationsCount}</span>` : ''}
          </button>
          ${state.currentView !== 'profile' ? `
            <div class="avatar" id="topbarAvatar" style="cursor:pointer;width:38px;height:38px;border:2px solid #eef2ff;">
              <img src="${currentAvatar}">
            </div>
          ` : `
            <button class="icon-btn" id="topbarMenuBtn" title="Menu">${ICONS.menu}</button>
          `}
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="layout ${isChatActive ? 'full-chat-layout' : ''}">
        <!-- DESKTOP SIDEBAR -->
        <aside class="side">
          <div class="card-ui" style="padding:10px;">
            <button class="navitem ${state.currentView === 'feed' ? 'active' : ''}" id="sideHomeBtn">${ICONS.home} Home</button>
            <button class="navitem ${state.currentView === 'friends' ? 'active' : ''}" id="sideFriendsBtn">${ICONS.friends} Friends</button>
            <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="sideMessagesBtn">
              ${ICONS.messages} Messages ${state.unreadMessagesCount > 0 ? `<span class="badge" style="position:static;display:inline-block;margin-left:auto;">${state.unreadMessagesCount}</span>` : ''}
            </button>
            <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="sideProfileBtn">${ICONS.profile} Profile</button>
            <button class="navitem ${state.currentView === 'settings' ? 'active' : ''}" id="sideSettingsBtn">${ICONS.settings} Settings</button>
            <div class="divider" style="margin:8px 0;"></div>
            <button class="navitem" id="sideLogoutBtn" style="color:#d92d20;">${ICONS.logout} Log Out</button>
          </div>
        </aside>

        <!-- MAIN VIEW -->
        <main class="feed">
          ${renderCurrentViewContent()}
        </main>

        <!-- RIGHT SIDEBAR -->
        <aside class="rightbar">
          <div class="card-ui">
            <div class="row between" style="margin-bottom:12px;">
              <b>Friend Requests</b>
              <small class="muted">${state.friendRequests.length}</small>
            </div>
            ${renderFriendRequestsSidebar()}
          </div>
        </aside>
      </div>

      <!-- MOBILE BOTTOM NAVIGATION -->
      ${!isChatActive ? `
        <nav class="bottom-nav">
          <button class="navitem ${state.currentView === 'feed' ? 'active' : ''}" id="botHome">${ICONS.home}<span>Home</span></button>
          <button class="navitem ${state.currentView === 'friends' ? 'active' : ''}" id="botFriends">${ICONS.friends}<span>Friends</span></button>
          <button class="navitem bot-create-btn" id="botCreate">${ICONS.plus}</button>
          <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="botMessages">${ICONS.messages}<span>Messages</span></button>
          <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="botProfile">${ICONS.profile}<span>Profile</span></button>
        </nav>
      ` : ''}

      <!-- AUDIO CALL POPUP -->
      ${renderAudioCallModal()}

      <!-- MODALS CONTAINER -->
      <div id="modalContainer"></div>
    </div>
  `;

  attachGlobalEvents();
  renderActiveModal();

  if (isChatActive) {
    loadChatMessages(state.activeChatUser.id);
  }
}

function renderFriendRequestsSidebar() {
  if (!state.friendRequests.length) return `<p class="muted center" style="font-size:13px;padding:12px 0;">No pending requests</p>`;
  return state.friendRequests.slice(0, 3).map(r => `
    <div class="list-row">
      <div class="avatar" style="width:38px;height:38px;">
        <img src="${getUserAvatar(r.requester)}">
      </div>
      <div class="grow" style="font-size:13px;">
        <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
        <div class="row" style="margin-top:6px;gap:6px;">
          <button class="btn primary acceptReqBtn" data-id="${r.id}" style="padding:4px 10px;font-size:11px;">Confirm</button>
          <button class="btn secondary rejectReqBtn" data-id="${r.id}" style="padding:4px 10px;font-size:11px;">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCurrentViewContent() {
  switch (state.currentView) {
    case 'feed': return renderFeedView();
    case 'profile': return renderProfileView();
    case 'friends': return renderFriendsView();
    case 'messages': return renderMessagesView();
    case 'settings': return renderSettingsView();
    default: return renderFeedView();
  }
}

// ----------------------------------------------------
// HOME FEED VIEW
// ----------------------------------------------------
function renderFeedView() {
  const p = state.profile || {};
  const userAvatar = getUserAvatar(p);
  const myStories = state.stories.filter(s => s.user_id === state.user?.id);
  const otherStories = state.stories.filter(s => s.user_id !== state.user?.id);

  return `
    <!-- STORIES ROW -->
    <div class="card-ui stories" style="padding:12px 14px;margin-bottom:12px;">
      <input type="file" id="storyUploadInput" accept="image/*" style="display:none;">
      <div class="story" id="addStoryBtn">
        <div class="avatar" style="border:2px dashed #5264f0;background:#f0f3ff;color:#315cff;">${ICONS.plus}</div>
        <span>Add Story</span>
      </div>

      <div class="story viewStoryBtn" data-story-user="${state.user?.id}" style="${myStories.length ? '' : 'opacity:0.6;'}">
        <div class="avatar" style="border:3px solid #7142ff;"><img src="${userAvatar}"></div>
        <span>Your Story</span>
      </div>

      ${otherStories.map(s => `
        <div class="story viewStoryBtn" data-story-id="${s.id}">
          <div class="avatar" style="border:3px solid #315cff;">
            <img src="${getUserAvatar(s.profiles)}">
          </div>
          <span>${escapeHtml(s.profiles?.full_name?.split(' ')[0] || 'Friend')}</span>
        </div>
      `).join('')}
    </div>

    <!-- POSTS LIST -->
    <div class="posts-list">
      ${state.posts.length === 0 ? `<div class="card-ui empty"><p class="muted">No posts yet. Tap ➕ below to create a post!</p></div>` : ''}
      ${state.posts.map(post => renderPostCard(post)).join('')}
    </div>
  `;
}

function renderPostCard(post) {
  const isLiked = post.post_likes?.some(l => l.user_id === state.user?.id);
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const sharesCount = post.post_shares?.length || 0;
  const postAuthorAvatar = getUserAvatar(post.profiles);

  return `
    <div class="card-ui post-card" data-post-id="${post.id}">
      <div class="post-head">
        <div class="avatar"><img src="${postAuthorAvatar}"></div>
        <div>
          <div style="font-weight:800;display:flex;align-items:center;gap:5px;">
            ${escapeHtml(post.profiles?.full_name || 'User')}
            ${post.profiles?.is_verified ? `<span style="color:#245bff;font-size:13px;">✔</span>` : ''}
            ${post.feeling ? `<span class="muted" style="font-size:12px;font-weight:500;">is feeling ${escapeHtml(post.feeling)}</span>` : ''}
          </div>
          <small class="muted">
            ${formatTimeAgo(post.created_at)} ${post.location ? `• 📍 ${escapeHtml(post.location)}` : ''} • 🌐 ${post.privacy}
          </small>
        </div>
        <button class="btn ghost more" style="margin-left:auto;padding:4px;">${ICONS.more}</button>
      </div>

      <!-- RICH TEXT CAPTION -->
      ${post.content ? `<div class="post-caption">${formatRichText(post.content)}</div>` : ''}

      ${post.media_url ? `<img class="post-media" src="${post.media_url}" loading="lazy">` : ''}

      <!-- COUNTERS -->
      <div class="row between muted post-counters">
        <div class="row" style="gap:4px;"><span style="color:#e63946;">❤️</span> <b>${likesCount}</b></div>
        <div><span>${commentsCount} Comments</span> • <span>${sharesCount} Shares</span></div>
      </div>

      <!-- ACTIONS -->
      <div class="post-actions">
        <button class="likePostBtn ${isLiked ? 'liked' : ''}" data-id="${post.id}">
          ${isLiked ? ICONS.heart : ICONS.heartOutline} &nbsp; Like
        </button>
        <button class="commentPostBtn" data-id="${post.id}">
          ${ICONS.comment} &nbsp; Comment
        </button>
        <button class="sharePostBtn" data-id="${post.id}" data-text="${escapeHtml(post.content || '')}">
          ${ICONS.share} &nbsp; Share
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PROFILE VIEW (Fixed Camera Badge)
// ----------------------------------------------------
function renderProfileView() {
  const p = state.profile || {};
  const userAvatar = getUserAvatar(p);
  const myPosts = state.posts.filter(item => item.user_id === state.user?.id);
  const myPhotos = myPosts.filter(item => item.media_url);

  let tabContentHtml = '';
  if (state.profileTab === 'posts') {
    tabContentHtml = myPosts.length === 0
      ? `<div class="card-ui empty"><p class="muted">You haven't posted yet.</p></div>`
      : myPosts.map(post => renderPostCard(post)).join('');
  } else if (state.profileTab === 'photos') {
    tabContentHtml = `
      <div class="card-ui">
        <b>Photos (${myPhotos.length})</b>
        <div class="photos-grid" style="margin-top:12px;">
          ${myPhotos.length === 0 ? `<p class="muted" style="padding:10px 0;">No photos uploaded yet.</p>` : ''}
          ${myPhotos.map(ph => `<img src="${ph.media_url}" loading="lazy">`).join('')}
        </div>
      </div>
    `;
  } else if (state.profileTab === 'about') {
    tabContentHtml = `
      <div class="card-ui">
        <b>About Details</b>
        <div style="margin-top:12px;">
          <div class="list-row"><div class="muted" style="width:120px;">Full Name</div><b>${escapeHtml(p.full_name || 'Not set')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Username</div><b>@${escapeHtml(p.username || '')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Email</div><b>${escapeHtml(p.email || state.user?.email || '')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Phone</div><b>${escapeHtml(p.phone || 'Not added')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Current City</div><b>${escapeHtml(p.current_city || p.location || 'Not set')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Hometown</div><b>${escapeHtml(p.hometown || 'Not set')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Workplace</div><b>${escapeHtml(p.workplace || 'Not set')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Education</div><b>${escapeHtml(p.education || 'Not set')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Gender</div><b style="text-transform:capitalize;">${escapeHtml(p.gender || 'Male')}</b></div>
          <div class="list-row"><div class="muted" style="width:120px;">Birthday</div><b>${escapeHtml(p.birth_date || 'Not specified')}</b></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="card-ui" style="padding:0;overflow:visible;margin-bottom:14px;">
      <div class="profile-cover" style="${p.cover_url ? `background:url(${p.cover_url}) center/cover;` : ''}">
        <input type="file" id="changeCoverInput" accept="image/*" style="display:none;">
        <button class="btn secondary" id="changeCoverBtn" style="position:absolute;right:12px;top:12px;padding:6px 12px;font-size:12px;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);">
          ${ICONS.camera} Change Cover
        </button>
      </div>

      <div class="profile-main">
        <div class="row between" style="align-items:flex-end;position:relative;">
          <div class="profile-avatar-wrapper">
            <div class="avatar profile-avatar" id="changeAvatarProfileBtn">
              <img src="${userAvatar}" alt="Profile">
            </div>
            <button class="profile-camera-badge" id="cameraBadgeUploadTrigger" title="Change Avatar">
              ${ICONS.camera}
            </button>
          </div>
          
          <input type="file" id="changeAvatarInput" accept="image/*" style="display:none;">
          <div class="row" style="gap:8px;margin-bottom:6px;">
            <button class="btn secondary" id="openEditProfileModal" style="padding:8px 14px;font-size:13px;border-radius:12px;">${ICONS.edit} &nbsp; Edit Profile</button>
          </div>
        </div>

        <div style="margin-top:14px;">
          <h2 style="margin:0;font-size:22px;display:flex;align-items:center;gap:6px;">
            ${escapeHtml(p.full_name || '')}
            ${p.is_verified ? `<span style="color:#245bff;">✔</span>` : ''}
          </h2>
          <span class="muted">@${escapeHtml(p.username || '')}</span>
          ${p.bio ? `<p style="margin:8px 0;font-size:14.5px;">${escapeHtml(p.bio)}</p>` : ''}
          ${(p.current_city || p.location) ? `<small class="muted" style="display:block;margin-top:4px;">📍 ${escapeHtml(p.current_city || p.location)}</small>` : ''}
        </div>

        <!-- STATS -->
        <div class="stats">
          <div class="stat"><b>${myPosts.length}</b><span class="muted">Posts</span></div>
          <div class="stat"><b>${state.friends.length}</b><span class="muted">Friends</span></div>
          <div class="stat"><b>0</b><span class="muted">Followers</span></div>
          <div class="stat"><b>0</b><span class="muted">Following</span></div>
        </div>

        <!-- TABS -->
        <div class="tabs">
          <button class="${state.profileTab === 'posts' ? 'active' : ''}" id="tabPostsBtn">Posts</button>
          <button class="${state.profileTab === 'photos' ? 'active' : ''}" id="tabPhotosBtn">Photos</button>
          <button class="${state.profileTab === 'about' ? 'active' : ''}" id="tabAboutBtn">About</button>
        </div>
      </div>
    </div>

    <div>${tabContentHtml}</div>
  `;
}

// ----------------------------------------------------
// FRIENDS VIEW
// ----------------------------------------------------
function renderFriendsView() {
  return `
    <div class="card-ui">
      <h2>Friends & Community</h2>

      <b style="font-size:16px;display:block;margin-top:10px;">Friend Requests (${state.friendRequests.length})</b>
      <div style="margin:10px 0 20px;">
        ${state.friendRequests.length === 0 ? `<p class="muted" style="padding:8px 0;font-size:13.5px;">No pending friend requests</p>` : ''}
        ${state.friendRequests.map(r => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(r.requester)}"></div>
            <div class="grow">
              <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(r.requester?.username || '')}</div>
            </div>
            <div class="row" style="gap:8px;">
              <button class="btn primary acceptReqBtn" data-id="${r.id}">Confirm</button>
              <button class="btn secondary rejectReqBtn" data-id="${r.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>

      <b style="font-size:16px;display:block;margin-top:10px;">Your Friends (${state.friends.length})</b>
      <div style="margin:10px 0 24px;">
        ${state.friends.length === 0 ? `<p class="muted" style="padding:8px 0;font-size:13.5px;">No friends added yet.</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(fr)}"></div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name || 'Friend')}</b>
              <div style="font-size:12px;">
                ${state.onlineUsers.has(fr.id) ? `<span style="color:#10b981;">🟢 Active Now</span>` : `<span style="color:#94a3b8;">⚪ Offline</span>`}
              </div>
            </div>
            <button class="icon-btn startChatBtn" data-user-id="${fr.id}">${ICONS.messages}</button>
          </div>
        `).join('')}
      </div>

      <b style="font-size:16px;display:block;margin-top:10px;">Discover People on Alapon</b>
      <div style="margin-top:10px;">
        ${state.suggestedUsers.length === 0 ? `<p class="muted" style="padding:8px 0;font-size:13.5px;">No new suggestions right now.</p>` : ''}
        ${state.suggestedUsers.map(u => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(u)}"></div>
            <div class="grow">
              <b>${escapeHtml(u.full_name || 'User')}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(u.username || '')}</div>
            </div>
            <button class="btn secondary sendSuggestedFriendReqBtn" data-id="${u.id}" style="padding:6px 12px;font-size:12px;">Add Friend</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// MESSENGER VIEW
// ----------------------------------------------------
function renderMessagesView() {
  if (state.activeChatUser) {
    const friendAvatar = getUserAvatar(state.activeChatUser);
    const isOnline = state.onlineUsers.has(state.activeChatUser.id);

    return `
      <div class="chat-fullscreen-wrapper">
        <!-- FIXED CHAT HEADER -->
        <div class="chat-header-bar">
          <button class="icon-btn-minimal" id="backToChatListBtn" title="Back">${ICONS.back}</button>
          <div class="avatar" style="width:40px;height:40px;margin-left:4px;"><img src="${friendAvatar}"></div>
          <div class="grow" style="margin-left:8px;">
            <b style="font-size:15px;display:block;line-height:1.2;">${escapeHtml(state.activeChatUser.full_name)}</b>
            <small id="chatUserActiveStatus" style="font-size:11px;font-weight:600;">
              ${isOnline ? `<span style="color:#10b981;">🟢 Active Now</span>` : `<span style="color:#94a3b8;">⚪ Offline</span>`}
            </small>
          </div>
          <button class="icon-btn-minimal" id="startVoiceCallBtn" title="Audio Call" style="color:#315cff;">
            ${ICONS.phone}
          </button>
        </div>

        <!-- WALLPAPER CONTAINER WITH DARK OVERLAY -->
        <div class="chat-wallpaper-container" style="background-image: url('${ASSETS.chatBg}');">
          <div class="chat-dark-overlay"></div>
          <div class="chat-scroll-stream" id="chatMessageList">
            <p class="muted center" style="margin-top:40px;color:#cbd5e1;">Loading conversation...</p>
          </div>
        </div>

        <!-- REPLY BANNER -->
        <div id="chatReplyPreviewBar" class="chat-reply-preview-bar ${state.replyingToMessage ? '' : 'hide'}">
          <div class="reply-bar-left">
            <span style="font-size:11px;color:#315cff;font-weight:800;">Replying to ${state.replyingToMessage?.sender_id === state.user.id ? 'yourself' : escapeHtml(state.activeChatUser.full_name)}</span>
            <p style="margin:0;font-size:12.5px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(state.replyingToMessage?.content || 'Attachment')}</p>
          </div>
          <button class="btn ghost" id="cancelReplyBtn" style="padding:4px 8px;">✕</button>
        </div>

        <!-- INPUT BAR -->
        <div class="chat-input-dock">
          <input type="file" id="chatMediaFileInput" accept="image/*" style="display:none;">
          <button class="icon-btn-minimal" id="triggerChatPhotoUpload" title="Send Image">${ICONS.image}</button>
          
          <button class="icon-btn-minimal ${isRecordingAudio ? 'recording-pulse' : ''}" id="toggleVoiceRecordBtn" title="Voice Message">
            ${isRecordingAudio ? ICONS.stop : ICONS.mic}
          </button>

          <textarea class="chat-auto-input" id="chatInputText" placeholder="Type a message..." rows="1"></textarea>
          
          <button class="chat-send-btn" id="submitChatMessageBtn">${ICONS.send}</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="card-ui">
      <h2>Messages</h2>
      <input class="input" type="text" id="filterChatConversations" placeholder="Search conversations..." style="margin:14px 0;">
      <div>
        ${state.friends.length === 0 ? `<p class="muted center" style="padding:20px 0;">Add friends to start messaging!</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row startChatBtn" data-user-id="${fr.id}" style="cursor:pointer;">
            <div class="avatar"><img src="${getUserAvatar(fr)}"></div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name)}</b>
              <div class="muted" style="font-size:13px;">Say hello! 👋</div>
            </div>
            <small style="font-size:11px;font-weight:700;">
              ${state.onlineUsers.has(fr.id) ? `<span style="color:#10b981;">🟢 Online</span>` : `<span style="color:#94a3b8;">Offline</span>`}
            </small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// AUDIO CALL MODAL
// ----------------------------------------------------
function renderAudioCallModal() {
  if (!state.activeCallingState) return '';
  const callUser = state.activeCallingState.user || {};
  const isInc = state.activeCallingState.isIncoming;

  return `
    <div class="full-modal-back audio-call-overlay">
      <div class="audio-call-card">
        <div class="avatar call-pulse-avatar" style="width:96px;height:96px;margin:0 auto 16px;">
          <img src="${getUserAvatar(callUser)}">
        </div>
        <h3 style="color:#fff;margin:0;font-size:22px;">${escapeHtml(callUser.full_name || 'Friend')}</h3>
        <p style="color:#a5b4fc;margin:6px 0 24px;" id="callDurationText">${isInc ? 'Incoming Audio Call...' : 'Calling...'}</p>

        <div class="row center" style="gap:20px;justify-content:center;">
          ${isInc ? `
            <button class="btn-call accept-call" id="acceptIncomingCallBtn" title="Accept">
              ${ICONS.phone}
            </button>
          ` : ''}
          <button class="btn-call end-call" id="declineOrEndCallBtn" title="Decline / End">
            ✕
          </button>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// SETTINGS VIEW
// ----------------------------------------------------
function renderSettingsView() {
  const p = state.profile || {};
  const userAvatar = getUserAvatar(p);

  return `
    <div class="card-ui">
      <h2>Settings</h2>
      <div class="list-row" style="margin:16px 0;">
        <div class="avatar"><img src="${userAvatar}"></div>
        <div class="grow">
          <b>${escapeHtml(p.full_name || '')}</b>
          <div class="muted">@${escapeHtml(p.username || '')}</div>
        </div>
      </div>

      <div class="list-row settingsOptRow" data-type="security" style="cursor:pointer;">
        <div class="grow"><b>🛡️ Account & Security</b></div>
        <span class="muted">❯</span>
      </div>
      <div class="list-row settingsOptRow" data-type="privacy" style="cursor:pointer;">
        <div class="grow"><b>🔒 Privacy & Policy</b></div>
        <span class="muted">❯</span>
      </div>
      <div class="list-row settingsOptRow" data-type="notifications" style="cursor:pointer;">
        <div class="grow"><b>🔔 Notification Preferences</b></div>
        <span class="muted">❯</span>
      </div>
      <div class="list-row settingsOptRow" data-type="language" style="cursor:pointer;">
        <div class="grow"><b>🌐 Language (English)</b></div>
        <span class="muted">❯</span>
      </div>

      <button class="btn secondary full" id="settingsLogoutBtn" style="margin-top:25px;color:#d92d20;background:#fee4e2;">
        ${ICONS.logout} &nbsp; Log Out
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// COMMENTS & SHARE LOGIC
// ----------------------------------------------------
async function openCommentsModal(postId) {
  state.activeCommentsPostId = postId;
  state.modal = 'comments';
  renderActiveModal();
  await loadPostComments(postId);
}

async function loadPostComments(postId) {
  const { data } = await supabase
    .from('comments')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender)`)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  state.commentsList = data || [];
  const container = document.getElementById('commentsContainerList');
  if (container) {
    if (state.commentsList.length === 0) {
      container.innerHTML = `<p class="muted center" style="padding:20px 0;">No comments yet. Be the first to comment!</p>`;
    } else {
      container.innerHTML = state.commentsList.map(c => `
        <div class="list-row" style="align-items:flex-start;padding:10px 0;">
          <div class="avatar" style="width:34px;height:34px;margin-top:2px;">
            <img src="${getUserAvatar(c.profiles)}">
          </div>
          <div class="comment-bubble-box">
            <b>${escapeHtml(c.profiles?.full_name || 'User')}</b>
            <div style="font-size:13.5px;margin-top:3px;word-break:break-word;">
              ${formatRichText(c.content)}
            </div>
            <small class="muted" style="font-size:11px;margin-top:4px;display:block;">${formatTimeAgo(c.created_at)}</small>
          </div>
        </div>
      `).join('');
      container.scrollTop = container.scrollHeight;
    }
  }
}

async function handleSharePost(postId, postText) {
  const shareUrl = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Alapon Lite Post',
        text: postText ? postText.substring(0, 100) : 'Check this post on Alapon Lite!',
        url: shareUrl
      });
      await recordShare(postId);
      showToast('Shared successfully! 🚀');
    } catch (e) {}
  } else {
    navigator.clipboard.writeText(shareUrl).then(async () => {
      await recordShare(postId);
      showToast('Post link copied to clipboard! 📋');
    });
  }
}

async function recordShare(postId) {
  await supabase.from('post_shares').insert({ post_id: postId, user_id: state.user.id });
  await loadFeed();
  renderApp();
}

// ----------------------------------------------------
// ALL MODALS CONTROLLER
// ----------------------------------------------------
function renderActiveModal() {
  const container = document.getElementById('modalContainer');
  if (!container) return;

  if (state.modal === 'edit-profile') {
    const p = state.profile || {};
    const curAvatar = getUserAvatar(p);

    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:min(720px, 95vh);">
          <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>Edit Complete Profile</b>
            <button class="btn ghost" id="closeEditModal">✕</button>
          </div>

          <div style="overflow-y:auto;flex:1;padding-right:4px;">
            <div class="row" style="gap:14px;margin-bottom:16px;align-items:center;">
              <div class="avatar" style="width:68px;height:68px;">
                <img src="${curAvatar}">
              </div>
              <div>
                <input type="file" id="modalChangeAvatarFile" accept="image/*" style="display:none;">
                <button class="btn secondary" id="modalChangeAvatarBtn" style="padding:6px 12px;font-size:12px;">Change Avatar</button>
                <button class="btn ghost" id="modalResetAvatarBtn" style="padding:6px 10px;font-size:12px;color:#d92d20;">Reset Default</button>
              </div>
            </div>

            <div class="field">
              <label>Full Name</label>
              <input class="input" type="text" id="editFullName" value="${escapeHtml(p.full_name || '')}">
            </div>
            <div class="field">
              <label>Username</label>
              <input class="input" type="text" id="editUsername" value="${escapeHtml(p.username || '')}">
            </div>
            <div class="field">
              <label>Bio (About you)</label>
              <textarea class="input" id="editBio" rows="2" placeholder="Write something about yourself...">${escapeHtml(p.bio || '')}</textarea>
            </div>
            <div class="field">
              <label>Phone Number</label>
              <input class="input" type="text" id="editPhone" placeholder="+880 1xxxxxxxxx" value="${escapeHtml(p.phone || '')}">
            </div>
            <div class="field">
              <label>Current City (বর্তমান শহর)</label>
              <input class="input locSearchInput" type="text" id="editCurrentCity" placeholder="Search City..." value="${escapeHtml(p.current_city || p.location || '')}">
              <div id="citySearchResults" class="search-drop-results"></div>
            </div>
            <div class="field">
              <label>Hometown (নিজ শহর / আদি নিবাস)</label>
              <input class="input locSearchInput" type="text" id="editHometown" placeholder="Search Hometown..." value="${escapeHtml(p.hometown || '')}">
              <div id="hometownSearchResults" class="search-drop-results"></div>
            </div>
            <div class="field">
              <label>Workplace / Work City (কর্মস্থল)</label>
              <input class="input" type="text" id="editWorkplace" placeholder="e.g. Software Engineer at Tech Corp" value="${escapeHtml(p.workplace || '')}">
            </div>
            <div class="field">
              <label>Education (শিক্ষাপ্রতিষ্ঠান)</label>
              <input class="input" type="text" id="editEducation" placeholder="e.g. Studied at Dhaka University" value="${escapeHtml(p.education || '')}">
            </div>
            <div class="field">
              <label>Gender</label>
              <select class="input" id="editGender">
                <option value="male" ${p.gender === 'male' ? 'selected' : ''}>👨 Male</option>
                <option value="female" ${p.gender === 'female' ? 'selected' : ''}>👩 Female</option>
              </select>
            </div>
          </div>

          <button class="btn primary full" id="saveProfileEditBtn" style="margin-top:14px;">Save All Changes</button>
        </div>
      </div>
    `;

    document.getElementById('closeEditModal').onclick = () => { state.modal = null; renderActiveModal(); };

    document.getElementById('modalChangeAvatarBtn').onclick = () => document.getElementById('modalChangeAvatarFile').click();
    document.getElementById('modalChangeAvatarFile').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop();
      const url = await uploadFile('avatars', `user_${state.user.id}_${Date.now()}.${ext}`, file);
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', state.user.id);
      await loadUserProfile();
      renderActiveModal();
    };
    document.getElementById('modalResetAvatarBtn').onclick = async () => {
      await supabase.from('profiles').update({ avatar_url: '' }).eq('id', state.user.id);
      await loadUserProfile();
      renderActiveModal();
    };

    setupLocationSearchInput('editCurrentCity', 'citySearchResults');
    setupLocationSearchInput('editHometown', 'hometownSearchResults');

    document.getElementById('saveProfileEditBtn').onclick = async () => {
      const full_name = document.getElementById('editFullName').value.trim();
      const username = document.getElementById('editUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
      const bio = document.getElementById('editBio').value.trim();
      const phone = document.getElementById('editPhone').value.trim();
      const current_city = document.getElementById('editCurrentCity').value.trim();
      const hometown = document.getElementById('editHometown').value.trim();
      const workplace = document.getElementById('editWorkplace').value.trim();
      const education = document.getElementById('editEducation').value.trim();
      const gender = document.getElementById('editGender').value;

      await supabase.from('profiles').update({
        full_name, username, bio, phone, current_city, location: current_city, hometown, workplace, education, gender
      }).eq('id', state.user.id);

      await loadUserProfile();
      state.modal = null;
      renderApp();
      showToast('Profile updated successfully! ✅');
    };
  } else if (state.modal === 'comments') {
    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal comments-modal">
          <div class="row between" style="border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>Comments</b>
            <button class="btn ghost" id="closeCommentsModal">✕</button>
          </div>
          <div id="commentsContainerList" class="comments-scroll-area">
            <p class="muted center" style="padding:20px 0;">Loading comments...</p>
          </div>
          <form class="comment-input-bar" id="submitCommentForm">
            <input class="input" type="text" id="newCommentInput" placeholder="Write a comment..." required>
            <button class="btn primary" type="submit" style="padding:10px 14px;">${ICONS.send}</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('closeCommentsModal').onclick = () => { state.modal = null; state.activeCommentsPostId = null; renderActiveModal(); };
    document.getElementById('submitCommentForm').onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById('newCommentInput');
      const text = input.value.trim();
      if (!text || !state.activeCommentsPostId) return;
      input.value = '';

      await supabase.from('comments').insert({
        post_id: state.activeCommentsPostId,
        user_id: state.user.id,
        content: text
      });
      loadPostComments(state.activeCommentsPostId);
      loadFeed();
    };
  } else if (state.modal === 'create-post') {
    const p = state.profile || {};
    const userAvatar = getUserAvatar(p);

    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal">
          <div class="row between" style="border-bottom:1px solid #edf0f5;padding-bottom:14px;">
            <button class="btn ghost" id="closeCreatePostModal">${ICONS.back}</button>
            <b>Create Post</b>
            <button class="btn primary" id="publishPostBtn" style="padding:7px 18px;">Publish</button>
          </div>

          <div class="row" style="margin:16px 0 12px;">
            <div class="avatar"><img src="${userAvatar}"></div>
            <div>
              <b>${escapeHtml(p.full_name || '')}</b>
              <select id="postPrivacySelect" style="border:1px solid #e2e5f2;border-radius:8px;padding:3px 8px;font-size:12px;margin-top:3px;display:block;">
                <option value="public" ${state.postDraft.privacy === 'public' ? 'selected' : ''}>🌐 Public</option>
                <option value="friends" ${state.postDraft.privacy === 'friends' ? 'selected' : ''}>👥 Friends Only</option>
                <option value="only_me" ${state.postDraft.privacy === 'only_me' ? 'selected' : ''}>🔒 Only Me</option>
              </select>
            </div>
          </div>

          <textarea class="create-post-textarea" id="createPostText" placeholder="What's on your mind? (Use #tags or @mentions)">${escapeHtml(state.postDraft.content)}</textarea>

          <div class="row" style="gap:8px;flex-wrap:wrap;margin:10px 0;">
            ${state.postDraft.feeling ? `<span class="tag">Feeling: ${escapeHtml(state.postDraft.feeling)} <b id="removeFeeling" style="cursor:pointer;margin-left:4px;">✕</b></span>` : ''}
            ${state.postDraft.location ? `<span class="tag">📍 ${escapeHtml(state.postDraft.location)} <b id="removeLocation" style="cursor:pointer;margin-left:4px;">✕</b></span>` : ''}
          </div>

          <div id="createPostMediaPreview">
            ${state.postDraft.mediaUrl ? `<div style="position:relative;margin:10px 0;"><img src="${state.postDraft.mediaUrl}" style="max-height:220px;border-radius:12px;width:100%;object-fit:cover;"><button id="removePostMedia" style="position:absolute;top:10px;right:10px;background:#000;color:#fff;border-radius:50%;width:26px;height:26px;">✕</button></div>` : ''}
          </div>

          <div id="feelingPickerBox" class="hide card-ui" style="background:#f8f9fe;padding:12px;margin:10px 0;">
            <b style="font-size:13px;">How are you feeling?</b>
            <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px;">
              ${['Happy 😊', 'Blessed 🙏', 'Excited 🤩', 'Loved ❤️', 'Crazy 🤪', 'Sad 😢', 'Cool 😎'].map(f => `
                <button class="btn secondary feelingSelectBtn" data-val="${f}" style="padding:5px 10px;font-size:12px;">${f}</button>
              `).join('')}
            </div>
          </div>

          <div id="locationSearchBox" class="hide card-ui" style="background:#f8f9fe;padding:12px;margin:10px 0;">
            <b style="font-size:13px;">Search World Location:</b>
            <input class="input" type="text" id="worldLocationSearchInput" placeholder="e.g. Dhaka, London, Tokyo..." style="margin-top:6px;">
            <div id="locationSearchResults" class="search-drop-results"></div>
          </div>

          <div class="card-ui row between" style="padding:10px 14px;margin-top:14px;background:#f9fbff;">
            <span style="font-size:13px;font-weight:700;">Add to post:</span>
            <div class="row" style="gap:6px;">
              <input type="file" id="postPhotoUploadInput" accept="image/*" style="display:none;">
              <button class="icon-btn" id="attachPhotoBtn" title="Photo">${ICONS.image}</button>
              <button class="icon-btn" id="toggleFeelingBtn" title="Feeling">${ICONS.smile}</button>
              <button class="icon-btn" id="toggleLocationBtn" title="Location">${ICONS.location}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeCreatePostModal').onclick = () => { state.modal = null; renderActiveModal(); };
    document.getElementById('attachPhotoBtn').onclick = () => document.getElementById('postPhotoUploadInput').click();
    document.getElementById('postPhotoUploadInput').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const ext = file.name.split('.').pop();
        const url = await uploadFile('post-media', `posts/${Date.now()}_img.${ext}`, file);
        state.postDraft.mediaUrl = url;
        renderActiveModal();
      } catch (err) { alert('Upload failed: ' + err.message); }
    };

    const rmImg = document.getElementById('removePostMedia');
    if (rmImg) rmImg.onclick = () => { state.postDraft.mediaUrl = ''; renderActiveModal(); };
    const rmFeel = document.getElementById('removeFeeling');
    if (rmFeel) rmFeel.onclick = () => { state.postDraft.feeling = ''; renderActiveModal(); };
    const rmLoc = document.getElementById('removeLocation');
    if (rmLoc) rmLoc.onclick = () => { state.postDraft.location = ''; renderActiveModal(); };

    document.getElementById('toggleFeelingBtn').onclick = () => document.getElementById('feelingPickerBox').classList.toggle('hide');
    document.querySelectorAll('.feelingSelectBtn').forEach(b => {
      b.onclick = () => { state.postDraft.feeling = b.dataset.val; renderActiveModal(); };
    });

    document.getElementById('toggleLocationBtn').onclick = () => document.getElementById('locationSearchBox').classList.toggle('hide');
    setupLocationSearchInput('worldLocationSearchInput', 'locationSearchResults', (val) => {
      state.postDraft.location = val;
      renderActiveModal();
    });

    document.getElementById('publishPostBtn').onclick = handlePostPublish;
  } else if (state.modal === 'drawer') {
    const p = state.profile || {};
    const userAvatar = getUserAvatar(p);

    container.innerHTML = `
      <div class="full-modal-back" style="justify-content:flex-start;">
        <div class="drawer-modal">
          <div class="row between" style="margin-bottom:18px;border-bottom:1px solid #f0f2f8;padding-bottom:14px;">
            <div class="row" style="gap:12px;">
              <div class="avatar"><img src="${userAvatar}"></div>
              <div>
                <b>${escapeHtml(p.full_name || '')}</b>
                <div class="muted" style="font-size:12px;">@${escapeHtml(p.username || '')}</div>
              </div>
            </div>
            <button class="btn ghost" id="closeDrawerBtn" style="font-size:18px;">✕</button>
          </div>

          <button class="navitem drawerNav" data-view="feed">${ICONS.home} Home</button>
          <button class="navitem drawerNav" data-view="friends">${ICONS.friends} Friends</button>
          <button class="navitem drawerNav" data-view="messages">${ICONS.messages} Messages</button>
          <button class="navitem drawerNav" data-view="profile">${ICONS.profile} Profile</button>
          <button class="navitem drawerNav" data-view="settings">${ICONS.settings} Settings</button>
          <div class="divider"></div>
          <button class="btn secondary full" id="drawerLogoutBtn" style="color:#d92d20;">${ICONS.logout} Log Out</button>
        </div>
      </div>
    `;

    document.getElementById('closeDrawerBtn').onclick = () => { state.modal = null; renderActiveModal(); };
    document.querySelectorAll('.drawerNav').forEach(btn => {
      btn.onclick = () => { state.currentView = btn.dataset.view; state.modal = null; renderApp(); };
    });
    document.getElementById('drawerLogoutBtn').onclick = () => supabase.auth.signOut();
  } else if (state.modal === 'search') {
    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:min(520px, 90vh);">
          <div class="row between" style="margin-bottom:14px;">
            <b>Search Alapon Users</b>
            <button class="btn ghost" id="closeSearchModal">✕</button>
          </div>
          <input class="input" type="text" id="liveSearchInput" placeholder="Type name or username..." autofocus>
          <div id="liveSearchResults" style="margin-top:14px;overflow-y:auto;flex:1;">
            <p class="muted center" style="padding:20px 0;">Type to find friends...</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById('closeSearchModal').onclick = () => { state.modal = null; renderActiveModal(); };
    document.getElementById('liveSearchInput').oninput = async (e) => {
      const q = e.target.value.trim();
      if (!q) return;
      const { data } = await supabase.from('profiles').select('*').or(`full_name.ilike.%${q}%,username.ilike.%${q}%`).limit(10);
      const resEl = document.getElementById('liveSearchResults');
      if (data && data.length) {
        resEl.innerHTML = data.map(u => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(u)}"></div>
            <div class="grow">
              <b>${escapeHtml(u.full_name)}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(u.username)}</div>
            </div>
            <button class="btn primary sendFriendReqBtn" data-id="${u.id}" style="padding:6px 12px;font-size:12px;">Add Friend</button>
          </div>
        `).join('');
        document.querySelectorAll('.sendFriendReqBtn').forEach(b => {
          b.onclick = async () => {
            await supabase.from('friendships').insert({ requester_id: state.user.id, receiver_id: b.dataset.id, status: 'pending' });
            b.innerText = 'Sent ✓';
            b.disabled = true;
          };
        });
      } else {
        resEl.innerHTML = `<p class="muted center">No user found.</p>`;
      }
    };
  } else if (state.modal === 'notifications') {
    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:min(520px, 90vh);">
          <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>Notifications</b>
            <button class="btn ghost" id="closeNotifModal">✕</button>
          </div>
          <div style="overflow-y:auto;flex:1;">
            ${state.notifications.length === 0 ? `<p class="muted center" style="padding:30px 0;">No notifications yet.</p>` : ''}
            ${state.notifications.map(n => `
              <div class="list-row">
                <div class="avatar" style="width:36px;height:36px;"><img src="${getUserAvatar(n.actor)}"></div>
                <div class="grow" style="font-size:13px;">
                  <b>${escapeHtml(n.actor?.full_name || 'Someone')}</b> ${escapeHtml(n.message)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    document.getElementById('closeNotifModal').onclick = () => { state.modal = null; renderActiveModal(); };
  } else if (state.modal === 'settings-sub') {
    let subTitle = 'Security';
    let subBody = '';
    if (state.settingsSubType === 'security') {
      subTitle = 'Account & Security';
      subBody = `<p class="muted" style="margin-bottom:12px;">Manage your login email and security settings.</p><div class="list-row"><div class="grow">Email: <b>${escapeHtml(state.user?.email || '')}</b></div></div><div class="list-row"><div class="grow">Two-Factor Authentication</div><input type="checkbox" checked></div>`;
    } else if (state.settingsSubType === 'privacy') {
      subTitle = 'Privacy & Policy';
      subBody = `<div class="list-row"><div class="grow">Private Account</div><input type="checkbox"></div><div class="list-row"><div class="grow">Allow search indexing</div><input type="checkbox" checked></div>`;
    } else if (state.settingsSubType === 'notifications') {
      subTitle = 'Notification Preferences';
      subBody = `<div class="list-row"><div class="grow">Push Notifications</div><input type="checkbox" checked></div><div class="list-row"><div class="grow">Friend Request Alerts</div><input type="checkbox" checked></div><div class="list-row"><div class="grow">Direct Message Alerts</div><input type="checkbox" checked></div>`;
    } else if (state.settingsSubType === 'language') {
      subTitle = 'Language';
      subBody = `<div class="list-row"><div class="grow">English</div><b>✓</b></div><div class="list-row"><div class="grow">বাংলা (Bangla)</div></div>`;
    }

    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:auto;max-height:90vh;">
          <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>${subTitle}</b>
            <button class="btn ghost" id="closeSettingsSubModal">✕</button>
          </div>
          <div>${subBody}</div>
        </div>
      </div>
    `;
    document.getElementById('closeSettingsSubModal').onclick = () => { state.modal = null; renderActiveModal(); };
  } else if (state.modal === 'view-story' && state.activeStory) {
    const s = state.activeStory;
    container.innerHTML = `
      <div class="full-modal-back" style="background:rgba(0,0,0,0.92);">
        <div style="position:relative;max-width:440px;width:100%;height:85vh;display:flex;flex-direction:column;justify-content:center;">
          <div class="row between" style="position:absolute;top:10px;left:10px;right:10px;z-index:10;color:#fff;">
            <div class="row" style="gap:8px;">
              <div class="avatar" style="width:36px;height:36px;"><img src="${getUserAvatar(s.profiles)}"></div>
              <b>${escapeHtml(s.profiles?.full_name || 'User')}</b>
            </div>
            <button class="btn ghost" id="closeStoryViewBtn" style="color:#fff;font-size:20px;">✕</button>
          </div>
          <img src="${s.media_url}" style="max-height:80vh;width:100%;object-fit:contain;border-radius:12px;">
        </div>
      </div>
    `;
    document.getElementById('closeStoryViewBtn').onclick = () => { state.modal = null; state.activeStory = null; renderActiveModal(); };
  } else if (state.modal === 'msg-options') {
    const msg = state._selectedMsg;
    const isMine = msg.sender_id === state.user.id;

    container.innerHTML = `
      <div class="full-modal-back msg-action-sheet-back" id="closeMsgOptionsBack">
        <div class="msg-action-sheet">
          <div class="reaction-palette">
            ${['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => `
              <button class="reaction-btn-pop" data-emoji="${emoji}">${emoji}</button>
            `).join('')}
          </div>

          <div class="sheet-action-list">
            <button class="sheet-action-btn" id="sheetReplyBtn">${ICONS.reply} &nbsp; Reply</button>
            ${isMine ? `
              <button class="sheet-action-btn" id="sheetDeleteForMeBtn">${ICONS.trash} &nbsp; Delete for Me</button>
              <button class="sheet-action-btn danger" id="sheetDeleteEveryoneBtn">${ICONS.trash} &nbsp; Delete for Everyone</button>
            ` : `
              <button class="sheet-action-btn" id="sheetDeleteForMeBtn">${ICONS.trash} &nbsp; Delete for Me</button>
            `}
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeMsgOptionsBack').onclick = (e) => {
      if (e.target.id === 'closeMsgOptionsBack') { state.modal = null; renderActiveModal(); }
    };

    document.querySelectorAll('.reaction-btn-pop').forEach(b => {
      b.onclick = async () => {
        const emoji = b.dataset.emoji;
        const currentReactions = msg.reactions || {};
        currentReactions[state.user.id] = emoji;
        await supabase.from('messages').update({ reactions: currentReactions }).eq('id', msg.id);
        state.modal = null;
        renderActiveModal();
        loadChatMessages(state.activeChatUser.id);
      };
    });

    document.getElementById('sheetReplyBtn').onclick = () => {
      state.replyingToMessage = msg;
      state.modal = null;
      renderActiveModal();
      const preview = document.getElementById('chatReplyPreviewBar');
      if (preview) preview.classList.remove('hide');
      const input = document.getElementById('chatInputText');
      if (input) input.focus();
    };

    const delMe = document.getElementById('sheetDeleteForMeBtn');
    if (delMe) delMe.onclick = async () => {
      const deletedFor = msg.deleted_for || [];
      if (!deletedFor.includes(state.user.id)) deletedFor.push(state.user.id);
      await supabase.from('messages').update({ deleted_for: deletedFor }).eq('id', msg.id);
      state.modal = null;
      renderActiveModal();
      loadChatMessages(state.activeChatUser.id);
    };

    const delAll = document.getElementById('sheetDeleteEveryoneBtn');
    if (delAll) delAll.onclick = async () => {
      await supabase.from('messages').update({ is_deleted: true, content: '🚫 This message was deleted' }).eq('id', msg.id);
      state.modal = null;
      renderActiveModal();
      loadChatMessages(state.activeChatUser.id);
    };
  } else {
    container.innerHTML = '';
  }
}

function setupLocationSearchInput(inputId, resultsDivId, onSelectCallback) {
  const input = document.getElementById(inputId);
  const resultsDiv = document.getElementById(resultsDivId);
  if (!input || !resultsDiv) return;

  input.oninput = async () => {
    const q = input.value.trim();
    if (q.length < 2) { resultsDiv.innerHTML = ''; return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=4`);
      const results = await res.json();
      resultsDiv.innerHTML = results.map(r => `
        <div class="list-row selectLocItem" data-val="${escapeHtml(r.display_name.split(',').slice(0,2).join(','))}" style="cursor:pointer;padding:6px 0;font-size:12px;">
          📍 ${escapeHtml(r.display_name.split(',').slice(0,3).join(','))}
        </div>
      `).join('');
      resultsDiv.querySelectorAll('.selectLocItem').forEach(item => {
        item.onclick = () => {
          input.value = item.dataset.val;
          resultsDiv.innerHTML = '';
          if (onSelectCallback) onSelectCallback(item.dataset.val);
        };
      });
    } catch (e) {}
  };
}

async function handlePostPublish() {
  const content = document.getElementById('createPostText').value.trim();
  const privacy = document.getElementById('postPrivacySelect').value;
  if (!content && !state.postDraft.mediaUrl) return alert('Please enter text or attach an image.');

  const { error } = await supabase.from('posts').insert({
    user_id: state.user.id,
    content,
    media_url: state.postDraft.mediaUrl,
    privacy,
    feeling: state.postDraft.feeling,
    location: state.postDraft.location
  });

  if (error) {
    alert('Error publishing post: ' + error.message);
  } else {
    state.modal = null;
    state.postDraft = { content: '', mediaUrl: '', privacy: 'public', location: '', feeling: '' };
    await loadFeed();
    renderApp();
  }
}

// ----------------------------------------------------
// EVENT BINDINGS
// ----------------------------------------------------
function attachGlobalEvents() {
  const bindNav = (id, view) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => { 
      state.currentView = view; 
      if (view !== 'messages') state.activeChatUser = null;
      renderApp(); 
    };
  };

  bindNav('brandHomeBtn', 'feed');
  bindNav('sideHomeBtn', 'feed');
  bindNav('botHome', 'feed');
  bindNav('sideFriendsBtn', 'friends');
  bindNav('botFriends', 'friends');
  bindNav('sideMessagesBtn', 'messages');
  bindNav('botMessages', 'messages');
  bindNav('sideProfileBtn', 'profile');
  bindNav('botProfile', 'profile');
  bindNav('topbarAvatar', 'profile');
  bindNav('sideSettingsBtn', 'settings');

  const topMenu = document.getElementById('topbarMenuBtn');
  if (topMenu) topMenu.onclick = () => { state.modal = 'drawer'; renderActiveModal(); };

  const openSearch = document.getElementById('openSearchBtn');
  if (openSearch) openSearch.onclick = () => { state.modal = 'search'; renderActiveModal(); };

  const openNotif = document.getElementById('openNotifBtn');
  if (openNotif) openNotif.onclick = () => { state.modal = 'notifications'; renderActiveModal(); };

  const botCreate = document.getElementById('botCreate');
  if (botCreate) botCreate.onclick = () => { state.modal = 'create-post'; renderActiveModal(); };

  const editProf = document.getElementById('openEditProfileModal');
  if (editProf) editProf.onclick = () => { state.modal = 'edit-profile'; renderActiveModal(); };

  // Profile avatar upload
  const avatarBadge = document.getElementById('cameraBadgeUploadTrigger');
  const avatarFile = document.getElementById('changeAvatarInput');
  if (avatarBadge && avatarFile) {
    avatarBadge.onclick = (e) => { e.stopPropagation(); avatarFile.click(); };
    avatarFile.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const ext = file.name.split('.').pop();
        const url = await uploadFile('avatars', `user_${state.user.id}_${Date.now()}.${ext}`, file);
        await supabase.from('profiles').update({ avatar_url: url }).eq('id', state.user.id);
        await loadUserProfile();
        renderApp();
        showToast('Profile photo updated! ✨');
      } catch (err) { alert('Upload failed: ' + err.message); }
    };
  }

  const changeAvatarProf = document.getElementById('changeAvatarProfileBtn');
  if (changeAvatarProf && avatarFile) {
    changeAvatarProf.onclick = () => avatarFile.click();
  }

  const addStoryBtn = document.getElementById('addStoryBtn');
  const storyInput = document.getElementById('storyUploadInput');
  if (addStoryBtn && storyInput) {
    addStoryBtn.onclick = () => storyInput.click();
    storyInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const ext = file.name.split('.').pop();
        const url = await uploadFile('post-media', `stories/${Date.now()}_story.${ext}`, file);
        await supabase.from('stories').insert({ user_id: state.user.id, media_url: url });
        await loadStories();
        renderApp();
      } catch (err) { alert('Story upload failed: ' + err.message); }
    };
  }

  document.querySelectorAll('.viewStoryBtn').forEach(b => {
    b.onclick = () => {
      const sId = b.dataset.storyId;
      const uId = b.dataset.storyUser;
      const story = sId ? state.stories.find(s => s.id === sId) : state.stories.find(s => s.user_id === uId);
      if (story) {
        state.activeStory = story;
        state.modal = 'view-story';
        renderActiveModal();
      }
    };
  });

  const tPosts = document.getElementById('tabPostsBtn');
  if (tPosts) tPosts.onclick = () => { state.profileTab = 'posts'; renderApp(); };
  const tPhotos = document.getElementById('tabPhotosBtn');
  if (tPhotos) tPhotos.onclick = () => { state.profileTab = 'photos'; renderApp(); };
  const tAbout = document.getElementById('tabAboutBtn');
  if (tAbout) tAbout.onclick = () => { state.profileTab = 'about'; renderApp(); };

  document.querySelectorAll('.settingsOptRow').forEach(r => {
    r.onclick = () => {
      state.settingsSubType = r.dataset.type;
      state.modal = 'settings-sub';
      renderActiveModal();
    };
  });

  const sideLogout = document.getElementById('sideLogoutBtn');
  if (sideLogout) sideLogout.onclick = () => supabase.auth.signOut();
  const settingsLogout = document.getElementById('settingsLogoutBtn');
  if (settingsLogout) settingsLogout.onclick = () => supabase.auth.signOut();

  document.querySelectorAll('.likePostBtn').forEach(btn => {
    btn.onclick = async () => {
      const postId = btn.dataset.id;
      const post = state.posts.find(p => p.id === postId);
      const existing = post?.post_likes?.find(l => l.user_id === state.user.id);
      if (existing) {
        await supabase.from('post_likes').delete().eq('id', existing.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: state.user.id });
      }
      await loadFeed();
      renderApp();
    };
  });

  document.querySelectorAll('.commentPostBtn').forEach(btn => {
    btn.onclick = () => { openCommentsModal(btn.dataset.id); };
  });

  document.querySelectorAll('.sharePostBtn').forEach(btn => {
    btn.onclick = () => { handleSharePost(btn.dataset.id, btn.dataset.text); };
  });

  document.querySelectorAll('.acceptReqBtn').forEach(btn => {
    btn.onclick = async () => {
      await supabase.from('friendships').update({ status: 'accepted' }).eq('id', btn.dataset.id);
      await loadFriendsData();
      await loadSuggestedUsers();
      renderApp();
    };
  });

  document.querySelectorAll('.rejectReqBtn').forEach(btn => {
    btn.onclick = async () => {
      await supabase.from('friendships').delete().eq('id', btn.dataset.id);
      await loadFriendsData();
      await loadSuggestedUsers();
      renderApp();
    };
  });

  document.querySelectorAll('.sendSuggestedFriendReqBtn').forEach(btn => {
    btn.onclick = async () => {
      await supabase.from('friendships').insert({ requester_id: state.user.id, receiver_id: btn.dataset.id, status: 'pending' });
      btn.innerText = 'Sent ✓';
      btn.disabled = true;
      showToast('Friend request sent! 👥');
    };
  });

  document.querySelectorAll('.startChatBtn').forEach(btn => {
    btn.onclick = () => {
      const friend = state.friends.find(f => f.id === btn.dataset.userId);
      if (friend) {
        state.activeChatUser = friend;
        state.currentView = 'messages';
        renderApp();
      }
    };
  });

  // Messenger actions
  const backChat = document.getElementById('backToChatListBtn');
  if (backChat) backChat.onclick = () => { 
    state.activeChatUser = null; 
    state.replyingToMessage = null;
    renderApp(); 
  };

  const startCall = document.getElementById('startVoiceCallBtn');
  if (startCall && state.activeChatUser) {
    startCall.onclick = () => startAudioCall(state.activeChatUser);
  }

  const acceptCall = document.getElementById('acceptIncomingCallBtn');
  if (acceptCall) {
    acceptCall.onclick = () => {
      stopRingtone();
      if (state.activeCallingState?.user) {
        const targetChannel = supabase.channel(`call_channel_${state.activeCallingState.user.id}`);
        targetChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            targetChannel.send({ type: 'broadcast', event: 'call_accepted', payload: {} });
          }
        });
      }
      const dur = document.getElementById('callDurationText');
      if (dur) dur.innerText = 'Connected (Audio Active)';
    };
  }

  const endCall = document.getElementById('declineOrEndCallBtn');
  if (endCall) endCall.onclick = endActiveCall;

  // Chat Image Upload
  const triggerImg = document.getElementById('triggerChatPhotoUpload');
  const imgInput = document.getElementById('chatMediaFileInput');
  if (triggerImg && imgInput) {
    triggerImg.onclick = () => imgInput.click();
    imgInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file || !state.activeChatUser) return;
      try {
        const ext = file.name.split('.').pop();
        const url = await uploadFile('chat-media', `chat/${Date.now()}_img.${ext}`, file);
        await sendChatMessage({ mediaUrl: url, mediaType: 'image' });
      } catch (err) { alert('Upload failed: ' + err.message); }
    };
  }

  // Voice recording
  const voiceBtn = document.getElementById('toggleVoiceRecordBtn');
  if (voiceBtn) {
    voiceBtn.onclick = async () => {
      if (!isRecordingAudio) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const ext = 'webm';
            const file = new File([audioBlob], `voice_${Date.now()}.${ext}`, { type: 'audio/webm' });
            const url = await uploadFile('chat-media', `voices/${Date.now()}_voice.${ext}`, file);
            await sendChatMessage({ mediaUrl: url, mediaType: 'audio' });
          };
          mediaRecorder.start();
          isRecordingAudio = true;
          voiceBtn.classList.add('recording-pulse');
          showToast('Recording voice note... 🎙️');
        } catch (e) {
          alert('Microphone access required to record voice.');
        }
      } else {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        isRecordingAudio = false;
        voiceBtn.classList.remove('recording-pulse');
      }
    };
  }

  // Chat Send
  const sendBtn = document.getElementById('submitChatMessageBtn');
  const chatInput = document.getElementById('chatInputText');
  if (sendBtn && chatInput) {
    const handleSend = async () => {
      const text = chatInput.value.trim();
      if (!text || !state.activeChatUser) return;
      chatInput.value = '';
      await sendChatMessage({ text });
    };

    sendBtn.onclick = handleSend;
    chatInput.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
  }

  const cancelReply = document.getElementById('cancelReplyBtn');
  if (cancelReply) {
    cancelReply.onclick = () => {
      state.replyingToMessage = null;
      document.getElementById('chatReplyPreviewBar')?.classList.add('hide');
    };
  }

  const coverChangeBtn = document.getElementById('changeCoverBtn');
  const coverChangeInput = document.getElementById('changeCoverInput');
  if (coverChangeBtn && coverChangeInput) {
    coverChangeBtn.onclick = () => coverChangeInput.click();
    coverChangeInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop();
      const url = await uploadFile('covers', `cover_${state.user.id}_${Date.now()}.${ext}`, file);
      await supabase.from('profiles').update({ cover_url: url }).eq('id', state.user.id);
      await loadUserProfile();
      renderApp();
    };
  }
}

async function sendChatMessage({ text = '', mediaUrl = '', mediaType = null }) {
  const replyData = state.replyingToMessage ? {
    id: state.replyingToMessage.id,
    content: state.replyingToMessage.content,
    sender_name: state.replyingToMessage.sender_id === state.user.id ? 'You' : state.activeChatUser.full_name
  } : null;

  await supabase.from('messages').insert({
    sender_id: state.user.id,
    receiver_id: state.activeChatUser.id,
    content: text,
    media_url: mediaUrl,
    media_type: mediaType,
    reply_to: replyData
  });

  state.replyingToMessage = null;
  document.getElementById('chatReplyPreviewBar')?.classList.add('hide');
  loadChatMessages(state.activeChatUser.id);
}

async function loadChatMessages(otherUserId) {
  const listEl = document.getElementById('chatMessageList');
  if (!listEl) return;

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${state.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${state.user.id})`)
    .order('created_at', { ascending: true });

  if (messages && messages.length > 0) {
    const unreadIds = messages.filter(m => m.receiver_id === state.user.id && !m.is_read).map(m => m.id);
    if (unreadIds.length > 0) {
      await supabase.from('messages').update({ is_read: true, read_at: new Date().toISOString() }).in('id', unreadIds);
    }

    const visibleMessages = messages.filter(m => !(m.deleted_for || []).includes(state.user.id));

    listEl.innerHTML = visibleMessages.map(m => {
      const isMine = m.sender_id === state.user.id;
      const reactions = m.reactions || {};
      const reactionEmojis = Object.values(reactions);
      const formattedTime = formatClockTime(m.created_at);

      return `
        <div class="msg-swipe-wrapper" data-msg-id="${m.id}">
          <div class="msg-swipe-action-icon">${ICONS.reply}</div>
          <div class="msg-container ${isMine ? 'mine' : 'theirs'}">
            ${m.reply_to ? `
              <div class="msg-reply-quote">
                <b>${escapeHtml(m.reply_to.sender_name || 'User')}:</b> ${escapeHtml(m.reply_to.content || 'Attachment')}
              </div>
            ` : ''}

            ${m.media_url && m.media_type === 'image' ? `
              <img src="${m.media_url}" class="msg-media-img" loading="lazy">
            ` : ''}

            ${m.media_url && m.media_type === 'audio' ? `
              <audio controls class="msg-audio-player" src="${m.media_url}"></audio>
            ` : ''}

            ${m.content ? `<div class="msg-text-content ${m.is_deleted ? 'msg-deleted-text' : ''}">${formatRichText(m.content)}</div>` : ''}

            <div class="msg-meta-row">
              <span class="msg-time-label">${formattedTime}</span>
              ${isMine ? `
                <span class="msg-seen-status">
                  ${m.is_read ? `Seen ${formatClockTime(m.read_at || m.created_at)}` : '✓ Sent'}
                </span>
              ` : ''}
            </div>

            ${reactionEmojis.length > 0 ? `
              <div class="msg-reactions-badge">${reactionEmojis.join(' ')}</div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    listEl.scrollTop = listEl.scrollHeight;
    attachMessageInteractions(visibleMessages);
  } else {
    listEl.innerHTML = `<p class="muted center" style="margin-top:40px;color:#cbd5e1;">No messages yet. Say hello to start chatting! 👋</p>`;
  }
}

function attachMessageInteractions(messagesList) {
  document.querySelectorAll('.msg-swipe-wrapper').forEach(wrapper => {
    const msgId = wrapper.dataset.msgId;
    const msg = messagesList.find(m => m.id === msgId);
    if (!msg) return;

    // Long Press to open reaction & delete action sheet
    let pressTimer = null;
    const startPress = () => {
      pressTimer = setTimeout(() => {
        state._selectedMsg = msg;
        state.modal = 'msg-options';
        renderActiveModal();
      }, 520);
    };
    const cancelPress = () => clearTimeout(pressTimer);

    wrapper.addEventListener('touchstart', startPress, { passive: true });
    wrapper.addEventListener('touchend', cancelPress);
    wrapper.addEventListener('mousedown', startPress);
    wrapper.addEventListener('mouseup', cancelPress);
    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      state._selectedMsg = msg;
      state.modal = 'msg-options';
      renderActiveModal();
    });

    // Swipe Left or Right to Reply
    let startX = 0;
    let currentX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 20 && Math.abs(diffX) < 90) {
        wrapper.style.transform = `translateX(${diffX * 0.5}px)`;
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 55) {
        state.replyingToMessage = msg;
        const bar = document.getElementById('chatReplyPreviewBar');
        if (bar) {
          bar.classList.remove('hide');
          bar.querySelector('p').innerText = msg.content || 'Attachment';
        }
        document.getElementById('chatInputText')?.focus();
        if (navigator.vibrate) navigator.vibrate(40);
      }
      wrapper.style.transform = 'translateX(0px)';
      startX = 0;
      currentX = 0;
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function formatClockTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

init();
