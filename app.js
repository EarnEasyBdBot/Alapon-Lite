// app.js — Alapon (Professional UI Icons, Nested Facebook Comments, Natural Messenger Images, Hashtag Search & Chat Themes)
import { supabase, isConfigured, uploadFile } from './supabase.js';

// Assets
const ASSETS = {
  appLogo: `https://i.postimg.cc/W39S6FFL/file-0000000025e8820b9949851f1e324c5f.png`,
  defaultChatBg: `https://i.postimg.cc/QC2zcdNB/file-00000000f8bc820b9191ddc7162e54a0.png`,
  maleAvatar: `https://i.postimg.cc/MK2yBQ0m/images-(8).jpg`,
  femaleAvatar: `https://i.postimg.cc/J4VbXk3x/woman-icon-for-user-profile-female-icon-human-or-people-sign-and-symbol-vector.jpg`
};

// Pure Professional Vector / SVG Icons (No UI Emojis)
const ICONS = {
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  friends: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  followers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  following: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  postsDoc: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>`,
  plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  messages: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  profile: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e63946"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  heartOutline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  comment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  image: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  location: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>`,
  smile: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="15 18 9 12 15 6"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  more: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  lock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  palette: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  archive: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`
};

// Global App State
const state = {
  user: null,
  profile: null,
  currentView: 'feed', // 'feed', 'profile', 'friends', 'messages', 'settings', 'hashtag-search', 'messaging-settings'
  profileTab: 'posts',
  activeChatUser: null,
  activeHashtag: '',
  hashtagPosts: [],
  onlineUsers: new Map(), // userId -> { online: boolean, last_active: ISOString }
  posts: [],
  stories: [],
  friends: [],
  friendRequests: [],
  suggestedUsers: [],
  notifications: [],
  activeCommentsPost: null,
  commentsList: [],
  replyingToCommentId: null,
  unreadMessagesCount: 0,
  unreadNotificationsCount: 0,
  chatThemes: {
    selectedBg: localStorage.getItem('alapon_chat_bg') || ASSETS.defaultChatBg,
    activeStatusEnabled: localStorage.getItem('alapon_active_status') !== 'false'
  },
  modal: null,
  settingsSubType: null,
  signupStep: 1,
  signupDraft: { fullName: '', email: '', username: '', password: '', birthDate: '', gender: 'male', avatarUrl: '' },
  postDraft: { content: '', mediaUrl: '', privacy: 'public', location: '', feeling: '' }
};

const app = document.getElementById('app');

function getUserAvatar(prof) {
  if (prof?.avatar_url && prof.avatar_url.trim().length > 5) return prof.avatar_url;
  return prof?.gender === 'female' ? ASSETS.femaleAvatar : ASSETS.maleAvatar;
}

// ----------------------------------------------------
// HASHTAG & RICH TEXT PARSER (Clickable Tags & Mentions)
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
  openHashtagSearchResult(tag);
};

async function openHashtagSearchResult(tag) {
  state.activeHashtag = tag.toLowerCase().replace('#', '');
  state.currentView = 'hashtag-search';
  renderApp();

  const { data } = await supabase
    .from('posts')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender, is_verified), post_likes (id, user_id), comments (id), post_shares (id)`)
    .ilike('content', `%#${state.activeHashtag}%`)
    .order('created_at', { ascending: false });

  state.hashtagPosts = data || [];
  renderApp();
}

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
// NOTIFICATIONS
// ----------------------------------------------------
async function triggerNotification(targetUserId, type, message, targetId = null) {
  if (!targetUserId || targetUserId === state.user?.id) return;
  await supabase.from('notifications').insert({
    user_id: targetUserId,
    actor_id: state.user.id,
    type,
    message,
    target_id: targetId,
    is_read: false
  });
}

function handleNotificationClick(n) {
  state.modal = null;
  supabase.from('notifications').update({ is_read: true }).eq('id', n.id).then(loadNotifications);

  if (n.type === 'post_like' || n.type === 'post_comment' || n.type === 'post_share') {
    openCommentsModal(n.target_id);
  } else if (n.type === 'friend_request') {
    state.currentView = 'friends';
    renderApp();
  } else if (n.type === 'message' || n.actor) {
    state.activeChatUser = n.actor;
    state.currentView = 'messages';
    renderApp();
  }
}

// ----------------------------------------------------
// 3D SPLASH SCREEN
// ----------------------------------------------------
async function init() {
  if (!isConfigured()) {
    app.innerHTML = `
      <div class="boot">
        <div style="width:50px;height:50px;margin:0 auto 12px;overflow:hidden;">
          <img src="${ASSETS.appLogo}" alt="Logo" style="width:50px;height:50px;object-fit:contain;">
        </div>
        <h2>Alapon Lite Configuration</h2>
        <p class="muted">Check credentials in supabase.js</p>
      </div>`;
    return;
  }

  render3DSplashScreen();

  const sessionPromise = supabase.auth.getSession();
  const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));
  const [{ data: { session } }] = await Promise.all([sessionPromise, delayPromise]);

  if (session?.user) {
    state.user = session.user;
    await loadUserProfile();
    await loadInitialData();
    setupRealtime();
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
      <div class="floating-badge badge-top-left">${ICONS.friends}</div>
      <div class="floating-badge badge-top-right">${ICONS.messages}</div>
      <div class="floating-badge badge-mid-left">${ICONS.heart}</div>
      <div class="floating-badge badge-mid-right">${ICONS.search}</div>

      <div class="splash-3d-center">
        <div style="width:105px;height:105px;max-width:105px;max-height:105px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <img src="${ASSETS.appLogo}" alt="Alapon Logo" style="width:105px;height:105px;object-fit:contain;display:block;">
        </div>
        <h1 class="splash-3d-title">Alapon</h1>
        <p class="splash-3d-tagline">Connect • Share • Grow</p>
        <div class="splash-3d-progress-container"><div class="splash-3d-progress-bar"></div></div>
        <span class="splash-3d-loading-text">Loading...</span>
      </div>

      <div class="splash-3d-globe-wrap">
        <svg class="splash-3d-globe" viewBox="0 0 400 200" fill="none">
          <ellipse cx="200" cy="200" rx="190" ry="120" fill="url(#globeGrad)" opacity="0.85"/>
          <path d="M30 180 Q200 80 370 180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4"/>
          <path d="M80 190 Q200 110 320 190" stroke="#818cf8" stroke-width="1.5"/>
          <circle cx="90" cy="155" r="4" fill="#38bdf8"/>
          <circle cx="200" cy="115" r="5" fill="#f43f5e"/>
          <circle cx="310" cy="155" r="4" fill="#a855f7"/>
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
  state.friends = (fList || []).map((f) => (f.requester_id === state.user.id ? f.receiver : f.requester));
}

async function loadSuggestedUsers() {
  if (!state.user) return;
  const friendIds = new Set([state.user.id, ...state.friends.map((f) => f.id), ...state.friendRequests.map((r) => r.requester_id)]);
  const { data: allUsers } = await supabase.from('profiles').select('*').limit(20);
  state.suggestedUsers = (allUsers || []).filter((u) => !friendIds.has(u.id));
}

async function loadNotifications() {
  if (!state.user) return;
  const { data } = await supabase
    .from('notifications')
    .select(`*, actor:actor_id (id, full_name, avatar_url, gender, username)`)
    .eq('user_id', state.user.id)
    .order('created_at', { ascending: false })
    .limit(30);
  state.notifications = data || [];
}

async function loadUnreadCounts() {
  if (!state.user) return;
  const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', state.user.id).eq('is_read', false);
  const { count: notifCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', state.user.id).eq('is_read', false);
  state.unreadMessagesCount = msgCount || 0;
  state.unreadNotificationsCount = notifCount || 0;
}

// ----------------------------------------------------
// REALTIME & PRESENCE (Online / Last Active Tracking)
// ----------------------------------------------------
function setupRealtime() {
  const presenceChannel = supabase.channel('online_presence', {
    config: { presence: { key: state.user?.id } }
  });

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const presenceState = presenceChannel.presenceState();
      const onlineMap = new Map();
      Object.entries(presenceState).forEach(([uId, presences]) => {
        if (presences.length > 0) {
          onlineMap.set(uId, { online: true, last_active: presences[0].online_at });
        }
      });
      state.onlineUsers = onlineMap;
      updateChatHeaderActiveStatus();
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        if (state.chatThemes.activeStatusEnabled) {
          await presenceChannel.track({ online_at: new Date().toISOString(), user_id: state.user?.id });
        }
      }
    });

  supabase
    .channel('public:alapon_general_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, async () => { await loadFeed(); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
      if (state.activeCommentsPost?.id === payload.new?.post_id) {
        loadPostComments(state.activeCommentsPost.id);
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
      if (state.activeChatUser && (payload.new?.sender_id === state.activeChatUser.id || payload.new?.receiver_id === state.activeChatUser.id)) {
        loadChatMessages(state.activeChatUser.id);
      }
      loadUnreadCounts().then(renderTopbarCounters);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
      loadNotifications().then(() => { loadUnreadCounts().then(renderTopbarCounters); });
    })
    .subscribe();
}

function renderTopbarCounters() {
  const notifBadge = document.querySelector('#openNotifBtn .badge');
  if (notifBadge) {
    if (state.unreadNotificationsCount > 0) {
      notifBadge.innerText = state.unreadNotificationsCount;
      notifBadge.style.display = 'grid';
    } else {
      notifBadge.style.display = 'none';
    }
  }

  const msgBadges = document.querySelectorAll('.header-msg-badge, .bot-msg-badge');
  msgBadges.forEach(b => {
    if (state.unreadMessagesCount > 0) {
      b.innerText = state.unreadMessagesCount;
      b.style.display = 'grid';
    } else {
      b.style.display = 'none';
    }
  });
}

function formatLastActiveStatus(otherUserId) {
  if (!state.chatThemes.activeStatusEnabled) return `Offline`;
  const pres = state.onlineUsers.get(otherUserId);
  if (pres && pres.online) {
    return `<span style="color:#10b981;">🟢 Online</span>`;
  }
  if (pres?.last_active) {
    return `Offline • Last active ${formatTimeAgo(pres.last_active)}`;
  }
  return `Offline`;
}

function updateChatHeaderActiveStatus() {
  const statusEl = document.getElementById('chatUserActiveStatus');
  if (statusEl && state.activeChatUser) {
    statusEl.innerHTML = formatLastActiveStatus(state.activeChatUser.id);
  }
}

// ----------------------------------------------------
// AUTH (Login & 5-Step Signup)
// ----------------------------------------------------
function renderAuth(mode = 'login') {
  if (mode === 'login') {
    app.innerHTML = `
      <div class="auth">
        <div class="auth-hero">
          <div class="hero-inner">
            <div style="width:68px;height:68px;margin-bottom:16px;overflow:hidden;">
              <img src="${ASSETS.appLogo}" alt="Alapon Lite" style="width:68px;height:68px;object-fit:contain;display:block;">
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
            Male
          </label>
          <label class="gender-pill ${state.signupDraft.gender === 'female' ? 'active' : ''}">
            <input type="radio" name="gender" value="female" ${state.signupDraft.gender === 'female' ? 'checked' : ''} style="display:none;">
            Female
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
          <div style="width:68px;height:68px;margin-bottom:16px;overflow:hidden;">
            <img src="${ASSETS.appLogo}" alt="Alapon Lite" style="width:68px;height:68px;object-fit:contain;display:block;">
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
    document.querySelectorAll('.gender-pill').forEach((pill) => {
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
        <button class="icon-btn-minimal" id="topbarHamburgerBtn" title="Menu" style="margin-right:2px;">
          ${ICONS.menu}
        </button>

        <div class="brand" id="brandHomeBtn">
          <div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
            <img src="${ASSETS.appLogo}" alt="Logo" style="width:34px;height:34px;object-fit:contain;display:block;">
          </div>
          <div>
            <span class="brand-title" style="display:block;line-height:1.1;">Alapon</span>
            <small style="font-size:10px;color:#8a90a5;font-weight:600;letter-spacing:0.2px;">Connect • Share • Grow</small>
          </div>
        </div>

        <div class="top-actions">
          <button class="icon-btn" id="openSearchBtn" title="Search">${ICONS.search}</button>
          <button class="icon-btn" id="openNotifBtn" title="Notifications">
            ${ICONS.bell}
            ${state.unreadNotificationsCount > 0 ? `<span class="badge">${state.unreadNotificationsCount}</span>` : ''}
          </button>
          <button class="icon-btn" id="openHeaderMsgBtn" title="Messages">
            ${ICONS.messages}
            ${state.unreadMessagesCount > 0 ? `<span class="badge header-msg-badge">${state.unreadMessagesCount}</span>` : ''}
          </button>
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

        <!-- MAIN SCROLLABLE VIEW -->
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
          <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="botMessages">
            <div style="position:relative;display:inline-block;">
              ${ICONS.messages}
              ${state.unreadMessagesCount > 0 ? `<span class="badge bot-msg-badge" style="top:-6px;right:-10px;">${state.unreadMessagesCount}</span>` : ''}
            </div>
            <span>Messages</span>
          </button>
          <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="botProfile">${ICONS.profile}<span>Profile</span></button>
        </nav>
      ` : ''}

      <!-- MODALS & FACEBOOK STYLE COMMENT VIEW -->
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
  return state.friendRequests.slice(0, 3).map((r) => `
    <div class="list-row">
      <div class="avatar" style="width:38px;height:38px;">
        <img src="${getUserAvatar(r.requester)}">
      </div>
      <div class="grow" style="font-size:13px;">
        <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
        <div class="row" style="margin-top:6px;gap:6px;">
          <button class="btn primary acceptReqBtn" data-id="${r.id}" data-requester="${r.requester_id}" style="padding:4px 10px;font-size:11px;">Confirm</button>
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
    case 'messaging-settings': return renderMessagingSettingsView();
    case 'hashtag-search': return renderHashtagSearchView();
    default: return renderFeedView();
  }
}

// ----------------------------------------------------
// FEED VIEW
// ----------------------------------------------------
function renderFeedView() {
  const p = state.profile || {};
  const userAvatar = getUserAvatar(p);
  const myStories = state.stories.filter((s) => s.user_id === state.user?.id);
  const otherStories = state.stories.filter((s) => s.user_id !== state.user?.id);

  return `
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

      ${otherStories.map((s) => `
        <div class="story viewStoryBtn" data-story-id="${s.id}">
          <div class="avatar" style="border:3px solid #315cff;">
            <img src="${getUserAvatar(s.profiles)}">
          </div>
          <span>${escapeHtml(s.profiles?.full_name?.split(' ')[0] || 'Friend')}</span>
        </div>
      `).join('')}
    </div>

    <div class="posts-list">
      ${state.posts.length === 0 ? `<div class="card-ui empty"><p class="muted">No posts yet. Tap ➕ below to create a post!</p></div>` : ''}
      ${state.posts.map((post) => renderPostCard(post)).join('')}
    </div>
  `;
}

function renderPostCard(post) {
  const isLiked = post.post_likes?.some((l) => l.user_id === state.user?.id);
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
            ${post.profiles?.is_verified ? `<span class="verified-badge-pill">✔</span>` : ''}
            ${post.feeling ? `<span class="muted" style="font-size:12px;font-weight:500;">is feeling ${escapeHtml(post.feeling)}</span>` : ''}
          </div>
          <small class="muted">
            ${formatTimeAgo(post.created_at)} ${post.location ? `• ${escapeHtml(post.location)}` : ''} • 🌐 ${post.privacy || 'Public'}
          </small>
        </div>
        <button class="btn ghost more" style="margin-left:auto;padding:4px;">${ICONS.more}</button>
      </div>

      ${post.content ? `<div class="post-caption">${formatRichText(post.content)}</div>` : ''}
      ${post.media_url ? `<img class="post-media" src="${post.media_url}" loading="lazy" onclick="window.openPostDetail('${post.id}')">` : ''}

      <div class="row between muted post-counters">
        <div class="row" style="gap:4px;"><span style="color:#e63946;">${ICONS.heart}</span> <b class="post-like-count">${likesCount}</b></div>
        <div><span>${commentsCount} Comments</span> • <span>${sharesCount} Shares</span></div>
      </div>

      <div class="post-actions">
        <button class="likePostBtn ${isLiked ? 'liked' : ''}" data-id="${post.id}" data-author="${post.user_id}">
          <span class="like-icon-holder">${isLiked ? ICONS.heart : ICONS.heartOutline}</span> &nbsp; Like
        </button>
        <button class="commentPostBtn" data-id="${post.id}">
          ${ICONS.comment} &nbsp; Comment
        </button>
        <button class="sharePostBtn" data-id="${post.id}" data-author="${post.user_id}" data-text="${escapeHtml(post.content || '')}">
          ${ICONS.share} &nbsp; Share
        </button>
      </div>
    </div>
  `;
}

window.openPostDetail = (postId) => {
  openCommentsModal(postId);
};

// ----------------------------------------------------
// HASHTAG SEARCH RESULT VIEW
// ----------------------------------------------------
function renderHashtagSearchView() {
  return `
    <div class="card-ui">
      <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
        <div class="row" style="gap:8px;">
          <button class="icon-btn-minimal" id="backToFeedFromHash">${ICONS.back}</button>
          <h2 style="font-size:20px;margin:0;">#${escapeHtml(state.activeHashtag)}</h2>
        </div>
        <small class="muted">${state.hashtagPosts.length} posts</small>
      </div>
      <div class="posts-list">
        ${state.hashtagPosts.length === 0 ? `<p class="muted center" style="padding:30px 0;">No posts found with #${escapeHtml(state.activeHashtag)}</p>` : ''}
        ${state.hashtagPosts.map((post) => renderPostCard(post)).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PROFILE VIEW (Real Dynamic Counts, No Fake Badges, Original SVG Icons)
// ----------------------------------------------------
function renderProfileView() {
  const p = state.profile || {};
  const userAvatar = getUserAvatar(p);
  const myPosts = state.posts.filter((item) => item.user_id === state.user?.id);
  const myPhotos = myPosts.filter((item) => item.media_url);

  let tabContentHtml = '';
  if (state.profileTab === 'posts') {
    tabContentHtml = `
      <!-- CREATE POST IN PROFILE -->
      <div class="card-ui profile-create-post-dock">
        <div class="row" style="gap:10px;align-items:center;">
          <div class="avatar" style="width:40px;height:40px;"><img src="${userAvatar}"></div>
          <div class="profile-create-fake-input" id="profileTriggerCreatePost">
            What's on your mind?
          </div>
        </div>
        <div class="profile-create-actions-row">
          <button class="profile-post-action-btn" id="profBtnPhoto">${ICONS.image} <span>Photo</span></button>
          <button class="profile-post-action-btn" id="profBtnFeeling">${ICONS.smile} <span>Feeling</span></button>
          <button class="profile-post-action-btn" id="profBtnLocation">${ICONS.location} <span>Check In</span></button>
          <button class="btn primary profile-quick-post-btn" id="profBtnSubmitPost">
            ${ICONS.send} Post
          </button>
        </div>
      </div>

      <!-- POSTS STREAM -->
      <div class="profile-posts-list">
        ${myPosts.length === 0 ? `<div class="card-ui empty"><p class="muted center" style="padding:20px 0;">You haven't created any posts yet.</p></div>` : ''}
        ${myPosts.map((post) => renderPostCard(post)).join('')}
      </div>
    `;
  } else if (state.profileTab === 'photos') {
    tabContentHtml = `
      <div class="card-ui">
        <b>Photos (${myPhotos.length})</b>
        <div class="photos-grid" style="margin-top:12px;">
          ${myPhotos.length === 0 ? `<p class="muted" style="padding:10px 0;">No photos uploaded yet.</p>` : ''}
          ${myPhotos.map((ph) => `<img src="${ph.media_url}" loading="lazy" onclick="window.openPostDetail('${ph.id}')">`).join('')}
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
    <div class="premium-profile-card">
      <!-- COVER PHOTO WITH WORKING GALLERY UPLOAD -->
      <div class="premium-profile-cover" id="coverPhotoBox" style="${p.cover_url ? `background-image:url('${p.cover_url}');` : ''}">
        <input type="file" id="changeCoverInput" accept="image/*" style="display:none;">
        <button class="premium-change-cover-btn" id="changeCoverBtn" type="button">
          ${ICONS.camera} <span>Change Cover</span>
        </button>
      </div>

      <!-- PROFILE HEADER MAIN -->
      <div class="premium-profile-header-wrap">
        <div class="premium-avatar-row">
          <!-- AVATAR WITH WORKING CAMERA BADGE -->
          <div class="premium-avatar-glow-box">
            <img src="${userAvatar}" class="premium-big-avatar" alt="Avatar">
            <button class="premium-avatar-camera-btn" id="cameraBadgeUploadTrigger" title="Upload Photo">
              ${ICONS.camera}
            </button>
            ${p.is_verified ? `<span class="premium-verified-sub-badge">✔</span>` : ''}
          </div>
          <input type="file" id="changeAvatarInput" accept="image/*" style="display:none;">

          <!-- EDIT PROFILE BUTTON -->
          <button class="premium-edit-profile-pill-btn" id="openEditProfileModal">
            ${ICONS.edit} <span>Edit Profile</span>
          </button>
        </div>

        <!-- USER INFO -->
        <div class="premium-user-info-meta">
          <h2 class="premium-profile-name">
            ${escapeHtml(p.full_name || 'User')}
            ${p.is_verified ? `<span class="premium-name-tick">✔</span>` : ''}
          </h2>
          <span class="premium-profile-username">@${escapeHtml(p.username || 'username')}</span>
          ${p.bio ? `<p class="premium-profile-bio">${escapeHtml(p.bio)}</p>` : `<p class="premium-profile-bio muted" style="font-size:13px;font-style:italic;">No bio added yet.</p>`}
        </div>

        <!-- STATS CARDS (ORIGINAL ICONS, NO HARDCODED NUMBERS) -->
        <div class="premium-stats-grid">
          <div class="premium-stat-card">
            <span class="stat-card-icon">${ICONS.postsDoc}</span>
            <b class="stat-card-number">${myPosts.length}</b>
            <span class="stat-card-label">Posts</span>
          </div>
          <div class="premium-stat-card">
            <span class="stat-card-icon">${ICONS.friends}</span>
            <b class="stat-card-number">${state.friends.length}</b>
            <span class="stat-card-label">Friends</span>
          </div>
          <div class="premium-stat-card">
            <span class="stat-card-icon">${ICONS.followers}</span>
            <b class="stat-card-number">0</b>
            <span class="stat-card-label">Followers</span>
          </div>
          <div class="premium-stat-card">
            <span class="stat-card-icon">${ICONS.following}</span>
            <b class="stat-card-number">0</b>
            <span class="stat-card-label">Following</span>
          </div>
        </div>

        <!-- TABS ROW (ORIGINAL ICONS) -->
        <div class="premium-profile-tabs-bar">
          <button class="premium-tab-btn ${state.profileTab === 'posts' ? 'active' : ''}" id="tabPostsBtn">
            ${ICONS.postsDoc} <span>Posts</span>
          </button>
          <button class="premium-tab-btn ${state.profileTab === 'photos' ? 'active' : ''}" id="tabPhotosBtn">
            ${ICONS.image} <span>Photos</span>
          </button>
          <button class="premium-tab-btn ${state.profileTab === 'about' ? 'active' : ''}" id="tabAboutBtn">
            ${ICONS.info} <span>About</span>
          </button>
        </div>
      </div>
    </div>

    <div style="margin-top:12px;">${tabContentHtml}</div>
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
        ${state.friendRequests.map((r) => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(r.requester)}"></div>
            <div class="grow">
              <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(r.requester?.username || '')}</div>
            </div>
            <div class="row" style="gap:8px;">
              <button class="btn primary acceptReqBtn" data-id="${r.id}" data-requester="${r.requester_id}">Confirm</button>
              <button class="btn secondary rejectReqBtn" data-id="${r.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>

      <b style="font-size:16px;display:block;margin-top:10px;">Your Friends (${state.friends.length})</b>
      <div style="margin:10px 0 24px;">
        ${state.friends.length === 0 ? `<p class="muted" style="padding:8px 0;font-size:13.5px;">No friends added yet.</p>` : ''}
        ${state.friends.map((fr) => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(fr)}"></div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name || 'Friend')}</b>
              <div style="font-size:12px;">
                ${formatLastActiveStatus(fr.id)}
              </div>
            </div>
            <button class="icon-btn-minimal startChatBtn" data-user-id="${fr.id}" title="Chat">${ICONS.messages}</button>
          </div>
        `).join('')}
      </div>

      <b style="font-size:16px;display:block;margin-top:10px;">Discover People on Alapon</b>
      <div style="margin-top:10px;">
        ${state.suggestedUsers.length === 0 ? `<p class="muted" style="padding:8px 0;font-size:13.5px;">No new suggestions right now.</p>` : ''}
        ${state.suggestedUsers.map((u) => `
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
// PRO MESSENGER VIEW (Natural Facebook Messenger Image & Text Layout)
// ----------------------------------------------------
function renderMessagesView() {
  if (state.activeChatUser) {
    const friendAvatar = getUserAvatar(state.activeChatUser);

    return `
      <div class="chat-fullscreen-wrapper">
        <!-- FIXED CHAT HEADER -->
        <div class="chat-header-bar">
          <button class="icon-btn-minimal" id="backToChatListBtn" title="Back">${ICONS.back}</button>
          <div class="avatar" style="width:40px;height:40px;margin-left:4px;"><img src="${friendAvatar}"></div>
          <div class="grow" style="margin-left:8px;">
            <b style="font-size:15px;display:block;line-height:1.2;">${escapeHtml(state.activeChatUser.full_name)}</b>
            <small id="chatUserActiveStatus" style="font-size:11px;font-weight:600;">
              ${formatLastActiveStatus(state.activeChatUser.id)}
            </small>
          </div>
          <button class="icon-btn-minimal" id="openChatThemeSettingBtn" title="Theme & Settings">
            ${ICONS.palette}
          </button>
        </div>

        <!-- CHAT STREAM WITH CHOSEN THEME / WALLPAPER -->
        <div class="chat-wallpaper-container" style="background-image: url('${state.chatThemes.selectedBg}');">
          <div class="chat-dark-overlay"></div>
          
          <div class="chat-inner-profile-card">
            <div class="avatar" style="width:78px;height:78px;margin:0 auto 8px;border:3px solid #fff;">
              <img src="${friendAvatar}">
            </div>
            <b style="font-size:18px;color:#fff;display:block;">${escapeHtml(state.activeChatUser.full_name)}</b>
            <p style="font-size:12px;color:#cbd5e1;margin-top:4px;">You're connected on Alapon</p>
          </div>

          <div class="chat-scroll-stream" id="chatMessageList">
            <p class="muted center" style="margin-top:20px;color:#cbd5e1;">Loading conversation...</p>
          </div>
        </div>

        <!-- MESSENGER COMPACT COMPOSER (GALLERY, INPUT, SEND) -->
        <div class="chat-input-dock" id="normalChatInputDock">
          <input type="file" id="chatMediaFileInput" accept="image/*" style="display:none;">
          <button class="icon-btn-minimal" id="triggerChatPhotoUpload" title="Send Image">${ICONS.image}</button>

          <textarea class="chat-auto-input" id="chatInputText" placeholder="Type a message..." rows="1"></textarea>
          
          <button class="chat-send-btn" id="submitChatMessageBtn">${ICONS.send}</button>
        </div>
      </div>
    `;
  }

  // INBOX CONVERSATION LIST
  return `
    <div class="card-ui" style="padding:14px 16px;">
      <div class="row between" style="margin-bottom:12px;">
        <h2 style="font-size:24px;font-weight:900;">Messages</h2>
        <button class="icon-btn-minimal" id="toMessagingSettingsBtn" title="Messaging Settings">${ICONS.settings}</button>
      </div>

      <input class="input" type="text" id="filterChatConversations" placeholder="Search conversations..." style="margin:10px 0;border-radius:99px;background:#f1f5f9;">
      
      <div class="messenger-inbox-list">
        ${state.friends.length === 0 ? `<p class="muted center" style="padding:20px 0;">No conversations yet. Add friends to chat!</p>` : ''}
        ${state.friends.map((fr) => `
          <div class="messenger-chat-row startChatBtn" data-user-id="${fr.id}">
            <div class="avatar" style="width:52px;height:52px;position:relative;">
              <img src="${getUserAvatar(fr)}">
              ${state.onlineUsers.get(fr.id)?.online ? `<span class="messenger-online-dot"></span>` : ''}
            </div>
            <div class="grow" style="margin-left:12px;">
              <b style="font-size:15px;color:#0f172a;display:block;">${escapeHtml(fr.full_name)}</b>
              <div class="muted" style="font-size:12px;margin-top:2px;">Say hello! 👋</div>
            </div>
            <small class="muted" style="font-size:11px;">${formatLastActiveStatus(fr.id)}</small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// MESSAGING SETTINGS VIEW
// ----------------------------------------------------
function renderMessagingSettingsView() {
  return `
    <div class="card-ui">
      <div class="row between" style="margin-bottom:16px;border-bottom:1px solid #edf0f5;padding-bottom:12px;">
        <div class="row" style="gap:8px;">
          <button class="icon-btn-minimal" id="backFromMsgSettings">${ICONS.back}</button>
          <h2 style="font-size:20px;margin:0;">Messaging Settings</h2>
        </div>
      </div>

      <div class="list-row">
        <div class="grow">
          <b>Active Status</b>
          <div class="muted" style="font-size:12px;">Show when you are online and last active</div>
        </div>
        <input type="checkbox" id="toggleActiveStatusSetting" ${state.chatThemes.activeStatusEnabled ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer;">
      </div>

      <div class="list-row">
        <div class="grow">
          <b>Messaging Notifications</b>
          <div class="muted" style="font-size:12px;">Receive push notifications for new messages</div>
        </div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer;">
      </div>

      <div class="list-row">
        <div class="grow">
          <b>Message Requests</b>
          <div class="muted" style="font-size:12px;">Allow messages from non-friends</div>
        </div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer;">
      </div>

      <div class="list-row">
        <div class="grow">
          <b>Privacy & Safety</b>
          <div class="muted" style="font-size:12px;">End-to-end encrypted messaging filters</div>
        </div>
        <span class="muted">❯</span>
      </div>

      <b style="display:block;margin:20px 0 10px;font-size:15px;">Chat Themes & Background</b>
      <div class="chat-theme-palette-grid">
        <div class="theme-option-box" data-bg="${ASSETS.defaultChatBg}" style="background:url('${ASSETS.defaultChatBg}') center/cover;">
          <span>Abstract</span>
        </div>
        <div class="theme-option-box" data-bg="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500" style="background:#3b82f6;">
          <span>Solid Blue</span>
        </div>
        <div class="theme-option-box" data-bg="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500" style="background:#1e1b4b;">
          <span>Dark Blue</span>
        </div>
        <div class="theme-option-box" data-bg="https://images.unsplash.com/photo-1557683316-973673baf926?w=500" style="background:linear-gradient(135deg,#7c3aed,#db2777);">
          <span>Purple Pink</span>
        </div>
      </div>

      <input type="file" id="customChatBgUpload" accept="image/*" style="display:none;">
      <button class="btn secondary full" id="triggerCustomChatBgUpload" style="margin-top:14px;">
        ${ICONS.image} &nbsp; Choose Custom Background from Gallery
      </button>
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
        <div class="grow"><b>Account & Security</b></div>
        <span class="muted">❯</span>
      </div>
      <div class="list-row settingsOptRow" data-type="privacy" style="cursor:pointer;">
        <div class="grow"><b>Privacy & Policy</b></div>
        <span class="muted">❯</span>
      </div>
      <div class="list-row settingsOptRow" data-type="messaging" style="cursor:pointer;" id="toMessagingSettingsRow">
        <div class="grow"><b>Messaging Settings</b></div>
        <span class="muted">❯</span>
      </div>

      <button class="btn secondary full" id="settingsLogoutBtn" style="margin-top:25px;color:#d92d20;background:#fee4e2;">
        ${ICONS.logout} &nbsp; Log Out
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// FACEBOOK STYLE POST DETAIL, NESTED COMMENTS & REACTIONS
// ----------------------------------------------------
async function openCommentsModal(postId) {
  let post = state.posts.find((p) => p.id === postId);
  if (!post) {
    const { data } = await supabase
      .from('posts')
      .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender, is_verified), post_likes (id, user_id), comments (id), post_shares (id)`)
      .eq('id', postId)
      .single();
    if (data) post = data;
  }
  
  if (!post) return;
  state.activeCommentsPost = post;
  state.replyingToCommentId = null;
  state.modal = 'post-comments';
  renderActiveModal();
  await loadPostComments(post.id);
}

async function loadPostComments(postId) {
  const { data } = await supabase
    .from('comments')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, gender)`)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  state.commentsList = data || [];
  renderCommentsStream();
}

function renderCommentsStream() {
  const container = document.getElementById('fbPostCommentsStream');
  if (!container) return;

  if (state.commentsList.length === 0) {
    container.innerHTML = `<p class="muted center" style="padding:24px 0;">Be the first to comment on this post!</p>`;
    return;
  }

  // Nested comments grouping (Parent and Replies)
  const parents = state.commentsList.filter(c => !c.parent_id);
  const replies = state.commentsList.filter(c => c.parent_id);

  container.innerHTML = parents.map((c) => {
    const childReplies = replies.filter(r => r.parent_id === c.id);
    return `
      <div class="fb-comment-block" data-comment-id="${c.id}">
        <div class="fb-comment-row">
          <div class="avatar" style="width:36px;height:36px;">
            <img src="${getUserAvatar(c.profiles)}">
          </div>
          <div class="fb-comment-bubble">
            <b class="fb-comment-author">${escapeHtml(c.profiles?.full_name || 'User')}</b>
            <div class="fb-comment-text">${formatRichText(c.content)}</div>
            ${c.media_url ? `<img src="${c.media_url}" class="fb-comment-media" onclick="window.open('${c.media_url}')">` : ''}
          </div>
        </div>

        <div class="fb-comment-actions-bar">
          <span class="fb-comment-time">${formatTimeAgo(c.created_at)}</span>
          <button class="fb-comment-action-btn likeCommentBtn" data-id="${c.id}">Like</button>
          <button class="fb-comment-action-btn replyCommentBtn" data-id="${c.id}" data-author="${escapeHtml(c.profiles?.full_name || 'User')}">Reply</button>
          ${c.user_id === state.user?.id ? `<button class="fb-comment-action-btn deleteCommentBtn" data-id="${c.id}" style="color:#ef4444;">Delete</button>` : ''}
        </div>

        <!-- NESTED REPLIES -->
        ${childReplies.length > 0 ? `
          <div class="fb-nested-replies-wrap">
            ${childReplies.map(r => `
              <div class="fb-comment-row nested" data-comment-id="${r.id}">
                <div class="avatar" style="width:30px;height:30px;">
                  <img src="${getUserAvatar(r.profiles)}">
                </div>
                <div class="fb-comment-bubble">
                  <b class="fb-comment-author">${escapeHtml(r.profiles?.full_name || 'User')}</b>
                  <div class="fb-comment-text">${formatRichText(r.content)}</div>
                </div>
              </div>
              <div class="fb-comment-actions-bar nested">
                <span class="fb-comment-time">${formatTimeAgo(r.created_at)}</span>
                <button class="fb-comment-action-btn likeCommentBtn" data-id="${r.id}">Like</button>
                ${r.user_id === state.user?.id ? `<button class="fb-comment-action-btn deleteCommentBtn" data-id="${r.id}" style="color:#ef4444;">Delete</button>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  attachCommentInteractions();
}

function attachCommentInteractions() {
  document.querySelectorAll('.replyCommentBtn').forEach(btn => {
    btn.onclick = () => {
      state.replyingToCommentId = btn.dataset.id;
      const input = document.getElementById('fbCommentTextInput');
      if (input) {
        input.placeholder = `Replying to ${btn.dataset.author}...`;
        input.focus();
      }
    };
  });

  document.querySelectorAll('.deleteCommentBtn').forEach(btn => {
    btn.onclick = async () => {
      const cId = btn.dataset.id;
      await supabase.from('comments').delete().eq('id', cId);
      state.commentsList = state.commentsList.filter(c => c.id !== cId);
      renderCommentsStream();
      loadFeed();
    };
  });

  document.querySelectorAll('.likeCommentBtn').forEach(btn => {
    btn.onclick = () => {
      btn.classList.toggle('liked');
      btn.innerText = btn.classList.contains('liked') ? 'Liked' : 'Like';
    };
  });
}

// ----------------------------------------------------
// ALL MODALS
// ----------------------------------------------------
function renderActiveModal() {
  const container = document.getElementById('modalContainer');
  if (!container) return;

  if (state.modal === 'post-comments' && state.activeCommentsPost) {
    const post = state.activeCommentsPost;
    const authorAvatar = getUserAvatar(post.profiles);
    const isLiked = post.post_likes?.some((l) => l.user_id === state.user?.id);
    const likesCount = post.post_likes?.length || 0;
    const commentsCount = post.comments?.length || state.commentsList.length;
    const sharesCount = post.post_shares?.length || 0;

    container.innerHTML = `
      <div class="fb-post-detail-screen">
        <div class="fb-detail-topbar">
          <button class="icon-btn-minimal" id="closePostDetailBtn">${ICONS.back}</button>
          <b class="fb-detail-title">${escapeHtml(post.profiles?.full_name || 'User')}'s post</b>
          <button class="icon-btn-minimal" id="detailSearchBtn">${ICONS.search}</button>
        </div>

        <div class="fb-detail-scroll-area">
          <div class="fb-post-author-row">
            <div class="avatar" style="width:44px;height:44px;"><img src="${authorAvatar}"></div>
            <div>
              <div style="font-weight:800;font-size:15px;display:flex;align-items:center;gap:4px;">
                ${escapeHtml(post.profiles?.full_name || 'User')}
                ${post.profiles?.is_verified ? `<span class="verified-badge-pill">✔</span>` : ''}
              </div>
              <small class="muted" style="font-size:12px;">
                ${formatTimeAgo(post.created_at)} • 🌐
              </small>
            </div>
            <button class="btn ghost" style="margin-left:auto;padding:4px;">${ICONS.more}</button>
          </div>

          ${post.content ? `
            <div class="fb-post-text-content">
              ${formatRichText(post.content)}
            </div>
          ` : ''}

          ${post.media_url ? `
            <div class="fb-post-media-wrap">
              <img src="${post.media_url}" class="fb-post-full-image" loading="lazy">
            </div>
          ` : ''}

          <div class="fb-post-reactions-bar">
            <div class="row" style="gap:4px;align-items:center;">
              <span style="color:#e63946;">${ICONS.heart}</span>
              <b style="font-size:13px;color:#475569;">${likesCount}</b>
            </div>
            <div class="row" style="gap:10px;font-size:12.5px;color:#64748b;">
              <span>${commentsCount} Comments</span>
              <span>${sharesCount} Shares</span>
            </div>
          </div>

          <div class="fb-post-actions-dock">
            <button class="fb-action-tab-btn ${isLiked ? 'liked' : ''}" id="detailPostLikeBtn">
              ${isLiked ? ICONS.heart : ICONS.heartOutline} &nbsp; <span>Like</span>
            </button>
            <button class="fb-action-tab-btn" id="focusCommentInputBtn">
              ${ICONS.comment} &nbsp; <span>Comment</span>
            </button>
            <button class="fb-action-tab-btn" id="detailPostShareBtn">
              ${ICONS.share} &nbsp; <span>Share</span>
            </button>
          </div>

          <div class="fb-comments-stream" id="fbPostCommentsStream">
            <p class="muted center" style="padding:20px 0;">Loading comments...</p>
          </div>
        </div>

        <form class="fb-comment-input-bar" id="submitFbCommentForm">
          <input type="file" id="fbCommentMediaInput" accept="image/*" style="display:none;">
          <button type="button" class="icon-btn-minimal" id="triggerFbCommentMedia">${ICONS.image}</button>
          
          <input class="fb-comment-input-field" type="text" id="fbCommentTextInput" placeholder="Write a comment..." autocomplete="off">
          
          <button type="submit" class="chat-send-btn" style="width:36px;height:36px;">${ICONS.send}</button>
        </form>
      </div>
    `;

    document.getElementById('closePostDetailBtn').onclick = () => { 
      state.modal = null; 
      state.activeCommentsPost = null; 
      renderActiveModal(); 
    };

    document.getElementById('focusCommentInputBtn').onclick = () => {
      document.getElementById('fbCommentTextInput')?.focus();
    };

    document.getElementById('detailPostLikeBtn').onclick = async () => {
      const btn = document.getElementById('detailPostLikeBtn');
      const authorId = post.user_id;
      const existingIndex = post.post_likes?.findIndex((l) => l.user_id === state.user.id);
      const isCurrentlyLiked = existingIndex > -1;

      if (isCurrentlyLiked) {
        post.post_likes.splice(existingIndex, 1);
        btn.classList.remove('liked');
        await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', state.user.id);
      } else {
        if (!post.post_likes) post.post_likes = [];
        post.post_likes.push({ post_id: post.id, user_id: state.user.id });
        btn.classList.add('liked');
        await supabase.from('post_likes').insert({ post_id: post.id, user_id: state.user.id });
        await triggerNotification(authorId, 'post_like', `reacted to your post`, post.id);
      }
      loadFeed();
    };

    document.getElementById('detailPostShareBtn').onclick = () => {
      handleSharePost(post.id, post.user_id, post.content);
    };

    const mediaTrigger = document.getElementById('triggerFbCommentMedia');
    const mediaInput = document.getElementById('fbCommentMediaInput');
    let attachedCommentImg = '';

    if (mediaTrigger && mediaInput) {
      mediaTrigger.onclick = () => mediaInput.click();
      mediaInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          attachedCommentImg = re.target.result;
          showToast('Image attached! 📷');
        };
        reader.readAsDataURL(file);
      };
    }

    document.getElementById('submitFbCommentForm').onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById('fbCommentTextInput');
      const text = input.value.trim();
      if (!text && !attachedCommentImg) return;
      input.value = '';

      const imgToSubmit = attachedCommentImg;
      attachedCommentImg = '';

      const newComm = {
        id: `temp_${Date.now()}`,
        post_id: post.id,
        user_id: state.user.id,
        content: text,
        media_url: imgToSubmit,
        parent_id: state.replyingToCommentId,
        created_at: new Date().toISOString(),
        profiles: state.profile
      };

      state.commentsList.push(newComm);
      renderCommentsStream();
      state.replyingToCommentId = null;

      try {
        await supabase.from('comments').insert({
          post_id: post.id,
          user_id: state.user.id,
          content: text
        });
      } catch (err) {}

      await triggerNotification(post.user_id, 'post_comment', `commented on your post`, post.id);
      loadFeed();
    };
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
          <div class="divider" style="margin:12px 0;"></div>
          <button class="btn secondary full" id="drawerLogoutBtn" style="color:#d92d20;">${ICONS.logout} Log Out</button>
        </div>
      </div>
    `;

    document.getElementById('closeDrawerBtn').onclick = () => { state.modal = null; renderActiveModal(); };
    document.querySelectorAll('.drawerNav').forEach((btn) => {
      btn.onclick = () => { 
        state.currentView = btn.dataset.view; 
        state.modal = null; 
        renderApp(); 
      };
    });
    document.getElementById('drawerLogoutBtn').onclick = () => supabase.auth.signOut();
  } else if (state.modal === 'notifications') {
    container.innerHTML = `
      <div class="full-modal-back notif-fullscreen-overlay">
        <div class="full-modal notif-modal-card">
          <div class="row between" style="border-bottom:1px solid #edf0f5;padding-bottom:14px;margin-bottom:8px;">
            <div class="row" style="gap:8px;">
              <span style="color:#315cff;">${ICONS.bell}</span>
              <b style="font-size:17px;">Notifications (${state.notifications.length})</b>
            </div>
            <button class="btn ghost" id="closeNotifModal" style="font-size:18px;">✕</button>
          </div>
          
          <div class="notif-scroll-body" style="overflow-y:auto;flex:1;">
            ${state.notifications.length === 0 ? `
              <div class="empty-notif-box">
                <b>No notifications yet.</b>
                <p class="muted" style="font-size:13px;margin-top:4px;">When people interact with you, alerts will appear here!</p>
              </div>
            ` : ''}
            
            ${state.notifications.map((n) => `
              <div class="list-row notif-interactive-item ${n.is_read ? '' : 'unread'}" data-notif-id="${n.id}">
                <div class="avatar" style="width:42px;height:42px;">
                  <img src="${getUserAvatar(n.actor)}">
                </div>
                <div class="grow" style="font-size:13.5px;line-height:1.35;">
                  <b>${escapeHtml(n.actor?.full_name || 'Someone')}</b> ${escapeHtml(n.message)}
                  <small class="muted" style="display:block;font-size:11px;margin-top:3px;">${formatTimeAgo(n.created_at)}</small>
                </div>
                <span class="notif-arrow-indicator">❯</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeNotifModal').onclick = () => { state.modal = null; renderActiveModal(); };
    document.querySelectorAll('.notif-interactive-item').forEach((item) => {
      item.onclick = () => {
        const notif = state.notifications.find((n) => n.id === item.dataset.notifId);
        if (notif) handleNotificationClick(notif);
      };
    });
  } else if (state.modal === 'edit-profile') {
    const p = state.profile || {};
    const curAvatar = getUserAvatar(p);

    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:min(720px, 95vh);">
          <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>Edit Profile</b>
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
              </div>
            </div>

            <div class="field"><label>Full Name</label><input class="input" type="text" id="editFullName" value="${escapeHtml(p.full_name || '')}"></div>
            <div class="field"><label>Username</label><input class="input" type="text" id="editUsername" value="${escapeHtml(p.username || '')}"></div>
            <div class="field"><label>Bio</label><textarea class="input" id="editBio" rows="2" placeholder="Write about yourself...">${escapeHtml(p.bio || '')}</textarea></div>
            <div class="field"><label>Phone</label><input class="input" type="text" id="editPhone" value="${escapeHtml(p.phone || '')}"></div>
            <div class="field"><label>Current City</label><input class="input locSearchInput" type="text" id="editCurrentCity" value="${escapeHtml(p.current_city || p.location || '')}"></div>
            <div class="field"><label>Hometown</label><input class="input locSearchInput" type="text" id="editHometown" value="${escapeHtml(p.hometown || '')}"></div>
            <div class="field"><label>Workplace</label><input class="input" type="text" id="editWorkplace" value="${escapeHtml(p.workplace || '')}"></div>
            <div class="field"><label>Education</label><input class="input" type="text" id="editEducation" value="${escapeHtml(p.education || '')}"></div>
          </div>

          <button class="btn primary full" id="saveProfileEditBtn" style="margin-top:14px;">Save Changes</button>
        </div>
      </div>
    `;

    document.getElementById('closeEditModal').onclick = () => { state.modal = null; renderActiveModal(); };
    document.getElementById('modalChangeAvatarBtn').onclick = () => document.getElementById('modalChangeAvatarFile').click();
    document.getElementById('modalChangeAvatarFile').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const ext = file.name.split('.').pop();
        const url = await uploadFile('avatars', `user_${state.user.id}_${Date.now()}.${ext}`, file);
        await supabase.from('profiles').update({ avatar_url: url }).eq('id', state.user.id);
        await loadUserProfile();
        renderActiveModal();
      } catch(err) { alert('Upload error: ' + err.message); }
    };

    document.getElementById('saveProfileEditBtn').onclick = async () => {
      const full_name = document.getElementById('editFullName').value.trim();
      const username = document.getElementById('editUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
      const bio = document.getElementById('editBio').value.trim();
      const phone = document.getElementById('editPhone').value.trim();
      const current_city = document.getElementById('editCurrentCity').value.trim();
      const hometown = document.getElementById('editHometown').value.trim();
      const workplace = document.getElementById('editWorkplace').value.trim();
      const education = document.getElementById('editEducation').value.trim();

      await supabase.from('profiles').update({
        full_name, username, bio, phone, current_city, location: current_city, hometown, workplace, education
      }).eq('id', state.user.id);

      await loadUserProfile();
      state.modal = null;
      renderApp();
      showToast('Profile updated! ✅');
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
                <option value="public">🌐 Public</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>

          <textarea class="create-post-textarea" id="createPostText" placeholder="What's on your mind? (Use #tags or @mentions)">${escapeHtml(state.postDraft.content)}</textarea>

          <div id="createPostMediaPreview">
            ${state.postDraft.mediaUrl ? `<div style="position:relative;margin:10px 0;"><img src="${state.postDraft.mediaUrl}" style="max-height:220px;border-radius:12px;width:100%;object-fit:cover;"><button id="removePostMedia" style="position:absolute;top:10px;right:10px;background:#000;color:#fff;border-radius:50%;width:26px;height:26px;">✕</button></div>` : ''}
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

    document.getElementById('publishPostBtn').onclick = handlePostPublish;
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
        resEl.innerHTML = data.map((u) => `
          <div class="list-row">
            <div class="avatar"><img src="${getUserAvatar(u)}"></div>
            <div class="grow">
              <b>${escapeHtml(u.full_name)}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(u.username)}</div>
            </div>
            <button class="btn primary sendFriendReqBtn" data-id="${u.id}" style="padding:6px 12px;font-size:12px;">Add Friend</button>
          </div>
        `).join('');
        document.querySelectorAll('.sendFriendReqBtn').forEach((b) => {
          b.onclick = async () => {
            await supabase.from('friendships').insert({ requester_id: state.user.id, receiver_id: b.dataset.id, status: 'pending' });
            await triggerNotification(b.dataset.id, 'friend_request', 'sent you a friend request');
            b.innerText = 'Sent ✓';
            b.disabled = true;
          };
        });
      } else {
        resEl.innerHTML = `<p class="muted center">No user found.</p>`;
      }
    };
  } else {
    container.innerHTML = '';
  }
}

async function handlePostPublish() {
  const content = document.getElementById('createPostText').value.trim();
  const privacy = document.getElementById('postPrivacySelect').value;
  if (!content && !state.postDraft.mediaUrl) return alert('Please enter text or attach an image.');

  const { error } = await supabase.from('posts').insert({
    user_id: state.user.id,
    content,
    media_url: state.postDraft.mediaUrl,
    privacy
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
  bindNav('sideSettingsBtn', 'settings');

  const backHash = document.getElementById('backToFeedFromHash');
  if (backHash) backHash.onclick = () => { state.currentView = 'feed'; renderApp(); };

  const topMenu = document.getElementById('topbarHamburgerBtn');
  if (topMenu) topMenu.onclick = () => { state.modal = 'drawer'; renderActiveModal(); };

  const openSearch = document.getElementById('openSearchBtn');
  if (openSearch) openSearch.onclick = () => { state.modal = 'search'; renderActiveModal(); };

  const openNotif = document.getElementById('openNotifBtn');
  if (openNotif) openNotif.onclick = () => { state.modal = 'notifications'; renderActiveModal(); };

  const headerMsg = document.getElementById('openHeaderMsgBtn');
  if (headerMsg) headerMsg.onclick = () => { state.currentView = 'messages'; renderApp(); };

  const botCreate = document.getElementById('botCreate');
  if (botCreate) botCreate.onclick = () => { state.modal = 'create-post'; renderActiveModal(); };

  const editProf = document.getElementById('openEditProfileModal');
  if (editProf) editProf.onclick = () => { state.modal = 'edit-profile'; renderActiveModal(); };

  // Profile Fake Input
  const profFakeInput = document.getElementById('profileTriggerCreatePost');
  if (profFakeInput) profFakeInput.onclick = () => { state.modal = 'create-post'; renderActiveModal(); };

  ['profBtnPhoto', 'profBtnFeeling', 'profBtnLocation', 'profBtnSubmitPost'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => { state.modal = 'create-post'; renderActiveModal(); };
  });

  // Profile Avatar Upload
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

  // Cover Photo Upload
  const coverChangeBtn = document.getElementById('changeCoverBtn');
  const coverChangeInput = document.getElementById('changeCoverInput');
  if (coverChangeBtn && coverChangeInput) {
    coverChangeBtn.onclick = () => coverChangeInput.click();
    coverChangeInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        showToast('Uploading cover photo... 🖼️');
        const ext = file.name.split('.').pop();
        const url = await uploadFile('covers', `cover_${state.user.id}_${Date.now()}.${ext}`, file);
        await supabase.from('profiles').update({ cover_url: url }).eq('id', state.user.id);
        await loadUserProfile();
        renderApp();
        showToast('Cover photo updated! ✨');
      } catch (err) {
        const reader = new FileReader();
        reader.onload = async (re) => {
          await supabase.from('profiles').update({ cover_url: re.target.result }).eq('id', state.user.id);
          await loadUserProfile();
          renderApp();
          showToast('Cover photo updated! ✨');
        };
        reader.readAsDataURL(file);
      }
    };
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

  document.querySelectorAll('.viewStoryBtn').forEach((b) => {
    b.onclick = () => {
      const sId = b.dataset.storyId;
      const uId = b.dataset.storyUser;
      const story = sId ? state.stories.find((s) => s.id === sId) : state.stories.find((s) => s.user_id === uId);
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

  // Smooth Like Click
  document.querySelectorAll('.likePostBtn').forEach((btn) => {
    btn.onclick = async () => {
      const postId = btn.dataset.id;
      const authorId = btn.dataset.author;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      const existingIndex = post.post_likes?.findIndex((l) => l.user_id === state.user.id);
      const isCurrentlyLiked = existingIndex > -1;

      const iconHolder = btn.querySelector('.like-icon-holder');
      const counterEl = btn.closest('.post-card')?.querySelector('.post-like-count');

      if (isCurrentlyLiked) {
        post.post_likes.splice(existingIndex, 1);
        btn.classList.remove('liked');
        if (iconHolder) iconHolder.innerHTML = ICONS.heartOutline;
        if (counterEl) counterEl.innerText = Math.max(0, parseInt(counterEl.innerText || 1) - 1);
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', state.user.id);
      } else {
        if (!post.post_likes) post.post_likes = [];
        post.post_likes.push({ post_id: postId, user_id: state.user.id });
        btn.classList.add('liked');
        if (iconHolder) iconHolder.innerHTML = ICONS.heart;
        if (counterEl) counterEl.innerText = parseInt(counterEl.innerText || 0) + 1;
        await supabase.from('post_likes').insert({ post_id: postId, user_id: state.user.id });
        await triggerNotification(authorId, 'post_like', `reacted ❤️ to your post`, postId);
      }
    };
  });

  document.querySelectorAll('.commentPostBtn').forEach((btn) => {
    btn.onclick = () => { openCommentsModal(btn.dataset.id); };
  });

  document.querySelectorAll('.sharePostBtn').forEach((btn) => {
    btn.onclick = () => { handleSharePost(btn.dataset.id, btn.dataset.author, btn.dataset.text); };
  });

  document.querySelectorAll('.acceptReqBtn').forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from('friendships').update({ status: 'accepted' }).eq('id', btn.dataset.id);
      await triggerNotification(btn.dataset.requester, 'friend_request', `accepted your friend request`);
      await loadFriendsData();
      await loadSuggestedUsers();
      renderApp();
    };
  });

  document.querySelectorAll('.rejectReqBtn').forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from('friendships').delete().eq('id', btn.dataset.id);
      await loadFriendsData();
      await loadSuggestedUsers();
      renderApp();
    };
  });

  document.querySelectorAll('.sendSuggestedFriendReqBtn').forEach((btn) => {
    btn.onclick = async () => {
      await supabase.from('friendships').insert({ requester_id: state.user.id, receiver_id: btn.dataset.id, status: 'pending' });
      await triggerNotification(btn.dataset.id, 'friend_request', 'sent you a friend request');
      btn.innerText = 'Sent ✓';
      btn.disabled = true;
      showToast('Friend request sent! 👥');
    };
  });

  document.querySelectorAll('.startChatBtn').forEach((btn) => {
    btn.onclick = () => {
      const friend = state.friends.find((f) => f.id === btn.dataset.userId);
      if (friend) {
        state.activeChatUser = friend;
        state.currentView = 'messages';
        renderApp();
      }
    };
  });

  const backChat = document.getElementById('backToChatListBtn');
  if (backChat) backChat.onclick = () => {
    state.activeChatUser = null;
    state.replyingToMessage = null;
    renderApp();
  };

  const toMsgSettings = document.getElementById('toMessagingSettingsBtn');
  if (toMsgSettings) toMsgSettings.onclick = () => { state.currentView = 'messaging-settings'; renderApp(); };

  const toMsgRow = document.getElementById('toMessagingSettingsRow');
  if (toMsgRow) toMsgRow.onclick = () => { state.currentView = 'messaging-settings'; renderApp(); };

  const backFromMsgSettings = document.getElementById('backFromMsgSettings');
  if (backFromMsgSettings) backFromMsgSettings.onclick = () => { state.currentView = 'settings'; renderApp(); };

  const toggleActiveStatus = document.getElementById('toggleActiveStatusSetting');
  if (toggleActiveStatus) {
    toggleActiveStatus.onchange = (e) => {
      state.chatThemes.activeStatusEnabled = e.target.checked;
      localStorage.setItem('alapon_active_status', e.target.checked);
      showToast('Active status updated!');
    };
  }

  // Theme option clicks
  document.querySelectorAll('.theme-option-box').forEach(box => {
    box.onclick = () => {
      const bg = box.dataset.bg;
      state.chatThemes.selectedBg = bg;
      localStorage.setItem('alapon_chat_bg', bg);
      showToast('Chat background updated! 🎨');
    };
  });

  const customBgBtn = document.getElementById('triggerCustomChatBgUpload');
  const customBgInput = document.getElementById('customChatBgUpload');
  if (customBgBtn && customBgInput) {
    customBgBtn.onclick = () => customBgInput.click();
    customBgInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        state.chatThemes.selectedBg = re.target.result;
        localStorage.setItem('alapon_chat_bg', re.target.result);
        showToast('Custom chat background set! 🖼️');
      };
      reader.readAsDataURL(file);
    };
  }

  const openThemeFromChat = document.getElementById('openChatThemeSettingBtn');
  if (openThemeFromChat) openThemeFromChat.onclick = () => { state.currentView = 'messaging-settings'; renderApp(); };

  // Chat Image Upload
  const triggerImg = document.getElementById('triggerChatPhotoUpload');
  const imgInput = document.getElementById('chatMediaFileInput');
  if (triggerImg && imgInput) {
    triggerImg.onclick = () => imgInput.click();
    imgInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file || !state.activeChatUser) return;
      showToast('Sending image... 📤');
      const reader = new FileReader();
      reader.onload = async (re) => {
        const localImgUrl = re.target.result;
        await sendChatMessage({ mediaUrl: localImgUrl, mediaType: 'image' });
      };
      reader.readAsDataURL(file);
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
}

async function sendChatMessage({ text = '', mediaUrl = '', mediaType = null }) {
  if (!state.activeChatUser || (!text && !mediaUrl)) return;

  const listEl = document.getElementById('chatMessageList');
  const tempMsg = {
    id: `temp_${Date.now()}`,
    sender_id: state.user.id,
    receiver_id: state.activeChatUser.id,
    content: text,
    media_url: mediaUrl,
    media_type: mediaType,
    created_at: new Date().toISOString(),
    is_read: false
  };

  if (listEl) {
    if (listEl.innerHTML.includes('No messages yet')) listEl.innerHTML = '';
    listEl.insertAdjacentHTML('beforeend', renderSingleMessageHtml(tempMsg, true));
    listEl.scrollTop = listEl.scrollHeight;
  }

  try {
    await supabase.from('messages').insert({
      sender_id: state.user.id,
      receiver_id: state.activeChatUser.id,
      content: text || (mediaType === 'image' ? '📷 Image' : '💬 Message')
    });
  } catch (err) {}

  await triggerNotification(state.activeChatUser.id, 'message', `sent you a message`);
}

function renderSingleMessageHtml(m, isMine) {
  const isImage = m.media_type === 'image' || (m.media_url && m.media_url.includes('data:image'));

  return `
    <div class="msg-swipe-wrapper">
      <div class="msg-container ${isMine ? 'mine' : 'theirs'} ${isImage ? 'image-bubble' : ''}">
        ${isImage ? `
          <img src="${m.media_url}" class="msg-media-img" loading="lazy" onclick="window.open('${m.media_url}')">
        ` : ''}

        ${m.content && !isImage ? `
          <div class="msg-text-content">${formatRichText(m.content)}</div>
        ` : ''}

        <div class="msg-meta-row">
          <span class="msg-time-label">${formatClockTime(m.created_at)}</span>
          ${isMine ? `<span class="msg-seen-status">${m.is_read ? 'Seen' : '✓ Sent'}</span>` : ''}
        </div>
      </div>
    </div>
  `;
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
    const unreadIds = messages.filter((m) => m.receiver_id === state.user.id && !m.is_read).map((m) => m.id);
    if (unreadIds.length > 0) {
      await supabase.from('messages').update({ is_read: true, read_at: new Date().toISOString() }).in('id', unreadIds);
    }

    listEl.innerHTML = messages.map((m) => renderSingleMessageHtml(m, m.sender_id === state.user.id)).join('');
    listEl.scrollTop = listEl.scrollHeight;
  } else {
    listEl.innerHTML = `<p class="muted center" style="margin-top:20px;color:#cbd5e1;">No messages yet. Say hello! 👋</p>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
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
