// app.js — Alapon Lite (Premium Animations, Clickable Mentions/Tags, Real Comments & Shares)
import { supabase, isConfigured, uploadFile } from './supabase.js';

// Clean SVG Icons
const ICONS = {
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  friends: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  messages: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  profile: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e63946"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  heartOutline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  comment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  image: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  location: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>`,
  smile: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  more: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`
};

const DEFAULT_AVATARS = {
  male: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23315cff"/><circle cx="50" cy="38" r="22" fill="%23ffffff"/><path d="M15 88 C15 65, 30 58, 50 58 C70 58, 85 65, 85 88 Z" fill="%23ffffff"/></svg>`,
  female: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ec4899"/><circle cx="50" cy="38" r="20" fill="%23ffffff"/><path d="M25 45 Q50 60 75 45 Q70 20 50 20 Q30 20 25 45 Z" fill="%234a044e"/><path d="M18 88 C18 66, 32 60, 50 60 C68 60, 82 66, 82 88 Z" fill="%23ffffff"/></svg>`
};

// Global App State
const state = {
  user: null,
  profile: null,
  currentView: 'feed',
  profileTab: 'posts',
  activeChatUser: null,
  posts: [],
  stories: [],
  friends: [],
  friendRequests: [],
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

const app = document.getElementById('app');

// ----------------------------------------------------
// 1. RICH TEXT PARSER (#Hashtag, @Username, URLs)
// ----------------------------------------------------
function formatRichText(rawText) {
  if (!rawText) return '';
  let text = escapeHtml(rawText);

  // 1. URLs
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="rich-link" onclick="event.stopPropagation();">$1</a>');

  // 2. Mentions (@username)
  text = text.replace(/@([a-zA-Z0-9_]+)/g, '<span class="rich-mention" onclick="window.handleMentionClick(event, \'$1\')">@$1</span>');

  // 3. Hashtags (#tag)
  text = text.replace(/#([a-zA-Z0-9_\u0980-\u09FF]+)/g, '<span class="rich-hashtag" onclick="window.handleHashtagClick(event, \'$1\')">#$1</span>');

  return text;
}

// Global Click Handlers for Rich Text
window.handleMentionClick = async (event, username) => {
  event.stopPropagation();
  const { data } = await supabase.from('profiles').select('*').ilike('username', username).single();
  if (data) {
    if (data.id === state.user.id) {
      state.currentView = 'profile';
    } else {
      state.activeChatUser = data;
      state.currentView = 'messages';
    }
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
  setTimeout(() => toast.remove(), 3000);
}

// ----------------------------------------------------
// 2. INITIALIZATION & 5.5s ANIMATED SPLASH SCREEN
// ----------------------------------------------------
async function init() {
  if (!isConfigured()) {
    app.innerHTML = `<div class="boot"><div class="logo">💬</div><h2>Alapon Lite Configuration</h2><p class="muted">Check credentials in supabase.js</p></div>`;
    return;
  }

  // Premium Animated Splash Screen (Runs for 5.5s)
  renderPremiumSplash();

  const sessionPromise = supabase.auth.getSession();
  const delayPromise = new Promise(resolve => setTimeout(resolve, 5200));

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

function renderPremiumSplash() {
  app.innerHTML = `
    <div class="splash-screen">
      <div class="splash-bg-glow"></div>
      <div class="splash-content">
        <div class="splash-logo-wrap">
          <div class="splash-logo-pulse"></div>
          <div class="splash-logo">💬</div>
        </div>
        <h1 class="splash-title">Alapon Lite</h1>
        <p class="splash-tagline">Connect • Share • Grow</p>
        
        <div class="splash-loader-bar">
          <div class="splash-loader-progress"></div>
        </div>
        <span class="splash-status">Starting secure connection...</span>
      </div>
    </div>
  `;
}

// Load Data
async function loadUserProfile() {
  const { data } = await supabase.from('profiles').select('*').eq('id', state.user.id).single();
  if (data) state.profile = data;
}

async function loadInitialData() {
  await Promise.all([
    loadFeed(),
    loadStories(),
    loadFriendsData(),
    loadNotifications(),
    loadUnreadCounts()
  ]);
}

async function loadFeed() {
  const { data } = await supabase
    .from('posts')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url, is_verified), post_likes (id, user_id), comments (id), post_shares (id)`)
    .order('created_at', { ascending: false });
  if (data) state.posts = data;
}

async function loadStories() {
  const { data } = await supabase
    .from('stories')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url)`)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (data) state.stories = data;
}

async function loadFriendsData() {
  if (!state.user) return;
  const { data: reqs } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id (id, full_name, username, avatar_url)`)
    .eq('receiver_id', state.user.id)
    .eq('status', 'pending');
  state.friendRequests = reqs || [];

  const { data: fList } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id(id, full_name, username, avatar_url), receiver:receiver_id(id, full_name, username, avatar_url)`)
    .or(`requester_id.eq.${state.user.id},receiver_id.eq.${state.user.id}`)
    .eq('status', 'accepted');
  state.friends = (fList || []).map(f => f.requester_id === state.user.id ? f.receiver : f.requester);
}

async function loadNotifications() {
  if (!state.user) return;
  const { data } = await supabase
    .from('notifications')
    .select(`*, actor:actor_id (id, full_name, avatar_url)`)
    .eq('user_id', state.user.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (data) state.notifications = data;
}

async function loadUnreadCounts() {
  if (!state.user) return;
  const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', state.user.id).eq('is_read', false);
  const { count: notifCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', state.user.id).eq('is_read', false);
  state.unreadMessagesCount = msgCount || 0;
  state.unreadNotificationsCount = notifCount || 0;
}

function setupRealtime() {
  supabase
    .channel('public:alapon_feed_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => { loadFeed().then(renderApp); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
      loadFeed().then(renderApp);
      if (state.activeCommentsPostId === payload.new?.post_id) {
        loadPostComments(state.activeCommentsPostId);
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => { loadStories().then(renderApp); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => { loadUnreadCounts().then(renderApp); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => { loadNotifications().then(renderApp); })
    .subscribe();
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
            <div class="brand-logo" style="width:68px;height:68px;font-size:32px;">💬</div>
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
    const defaultImg = state.signupDraft.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
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
          <div class="brand-logo" style="width:68px;height:68px;font-size:32px;">💬</div>
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
  const avatarToUse = d.avatarUrl || (d.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male);
  const { error } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      data: { full_name: d.fullName, username: d.username, birth_date: d.birthDate, gender: d.gender, avatar_url: avatarToUse }
    }
  });
  if (error) alert(error.message);
  else alert('Account created successfully! Logging you in...');
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
  const currentAvatar = p.avatar_url || (p.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male);

  app.innerHTML = `
    <div class="app-shell">
      <!-- TOP BAR -->
      <header class="topbar">
        <div class="brand" id="brandHomeBtn">
          <div class="brand-logo">💬</div>
          <span style="font-size:18px;font-weight:900;color:#171a2f;margin-left:4px;">Alapon Lite</span>
        </div>

        <div class="top-actions">
          <button class="icon-btn" id="openSearchBtn" title="Search">${ICONS.search}</button>
          <button class="icon-btn" id="openNotifBtn" title="Notifications">
            ${ICONS.bell}
            ${state.unreadNotificationsCount > 0 ? `<span class="badge">${state.unreadNotificationsCount}</span>` : ''}
          </button>
          <div class="avatar" id="topbarAvatar" style="cursor:pointer;width:38px;height:38px;border:2px solid #eef2ff;">
            <img src="${currentAvatar}">
          </div>
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="layout">
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
      <nav class="bottom-nav">
        <button class="navitem ${state.currentView === 'feed' ? 'active' : ''}" id="botHome">${ICONS.home}<span>Home</span></button>
        <button class="navitem ${state.currentView === 'friends' ? 'active' : ''}" id="botFriends">${ICONS.friends}<span>Friends</span></button>
        <button class="navitem bot-create-btn" id="botCreate">${ICONS.plus}</button>
        <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="botMessages">${ICONS.messages}<span>Messages</span></button>
        <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="botProfile">${ICONS.profile}<span>Profile</span></button>
      </nav>

      <!-- MODALS CONTAINER -->
      <div id="modalContainer"></div>
    </div>
  `;

  attachGlobalEvents();
  renderActiveModal();
}

function renderFriendRequestsSidebar() {
  if (!state.friendRequests.length) return `<p class="muted center" style="font-size:13px;padding:12px 0;">No pending requests</p>`;
  return state.friendRequests.slice(0, 3).map(r => `
    <div class="list-row">
      <div class="avatar" style="width:38px;height:38px;">
        <img src="${r.requester?.avatar_url || DEFAULT_AVATARS.male}">
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
// 1. HOME FEED VIEW (Clickable Hashtags & Mentions)
// ----------------------------------------------------
function renderFeedView() {
  const p = state.profile || {};
  const userAvatar = p.avatar_url || (p.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male);
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
            <img src="${s.profiles?.avatar_url || DEFAULT_AVATARS.male}">
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
  const postAuthorAvatar = post.profiles?.avatar_url || DEFAULT_AVATARS.male;

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

      <!-- RICH TEXT PARSED CAPTION -->
      ${post.content ? `<div class="post-caption">${formatRichText(post.content)}</div>` : ''}

      ${post.media_url ? `<img class="post-media" src="${post.media_url}" loading="lazy">` : ''}

      <!-- COUNTERS -->
      <div class="row between muted post-counters">
        <div class="row" style="gap:4px;"><span style="color:#e63946;">❤️</span> <b>${likesCount}</b></div>
        <div><span>${commentsCount} Comments</span> • <span>${sharesCount} Shares</span></div>
      </div>

      <!-- WORKING ACTIONS: Like, Comment, Share -->
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
// 2. PROFILE VIEW (Working Tabs: Posts, Photos, About)
// ----------------------------------------------------
function renderProfileView() {
  const p = state.profile || {};
  const userAvatar = p.avatar_url || (p.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male);
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
          ${myPhotos.map(p => `<img src="${p.media_url}" loading="lazy">`).join('')}
        </div>
      </div>
    `;
  } else if (state.profileTab === 'about') {
    tabContentHtml = `
      <div class="card-ui">
        <b>About Hasan</b>
        <div style="margin-top:12px;">
          <div class="list-row">
            <div class="muted" style="width:110px;">Full Name</div>
            <b>${escapeHtml(p.full_name || '')}</b>
          </div>
          <div class="list-row">
            <div class="muted" style="width:110px;">Username</div>
            <b>@${escapeHtml(p.username || '')}</b>
          </div>
          <div class="list-row">
            <div class="muted" style="width:110px;">Email</div>
            <b>${escapeHtml(p.email || state.user?.email || '')}</b>
          </div>
          <div class="list-row">
            <div class="muted" style="width:110px;">Location</div>
            <b>${escapeHtml(p.location || 'Dhaka, Bangladesh')}</b>
          </div>
          <div class="list-row">
            <div class="muted" style="width:110px;">Gender</div>
            <b style="text-transform:capitalize;">${escapeHtml(p.gender || 'Male')}</b>
          </div>
          <div class="list-row">
            <div class="muted" style="width:110px;">Birthday</div>
            <b>${escapeHtml(p.birth_date || 'Not specified')}</b>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="card-ui" style="padding:0;overflow:hidden;margin-bottom:12px;">
      <div class="profile-cover" style="${p.cover_url ? `background:url(${p.cover_url}) center/cover;` : ''}">
        <input type="file" id="changeCoverInput" accept="image/*" style="display:none;">
        <button class="btn secondary" id="changeCoverBtn" style="position:absolute;right:12px;top:12px;padding:6px 12px;font-size:12px;background:rgba(255,255,255,0.9);">
          ${ICONS.camera} Change Cover
        </button>
      </div>

      <div class="profile-main">
        <div class="row between" style="align-items:flex-end;">
          <div class="avatar profile-avatar" style="position:relative;cursor:pointer;" id="changeAvatarProfileBtn">
            <img src="${userAvatar}">
            <span style="position:absolute;bottom:0;right:0;background:#315cff;color:#fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center;border:2px solid #fff;">${ICONS.camera}</span>
          </div>
          <input type="file" id="changeAvatarInput" accept="image/*" style="display:none;">
          <div class="row" style="gap:8px;">
            <button class="btn secondary" id="openEditProfileModal" style="padding:8px 14px;font-size:13px;">${ICONS.edit} &nbsp; Edit Profile</button>
            <button class="icon-btn" id="profileSideMenuTrigger" style="width:38px;height:38px;">${ICONS.more}</button>
          </div>
        </div>

        <div style="margin-top:14px;">
          <h2 style="margin:0;font-size:22px;display:flex;align-items:center;gap:6px;">
            ${escapeHtml(p.full_name || '')}
            ${p.is_verified ? `<span style="color:#245bff;">✔</span>` : ''}
          </h2>
          <span class="muted">@${escapeHtml(p.username || '')}</span>
          <p style="margin:8px 0;font-size:14.5px;">${escapeHtml(p.bio || 'Welcome to my Alapon profile!')}</p>
          <small class="muted">📍 ${escapeHtml(p.location || 'Dhaka, Bangladesh')}</small>
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
// 3. FRIENDS VIEW
// ----------------------------------------------------
function renderFriendsView() {
  return `
    <div class="card-ui">
      <h2>Friends</h2>
      <div style="position:relative;margin:12px 0 18px;">
        <input class="input" type="text" id="friendSearchInput" placeholder="Search friends by name..." style="padding-left:14px;">
      </div>

      <b style="font-size:16px;">Friend Requests (${state.friendRequests.length})</b>
      <div style="margin:12px 0 24px;">
        ${state.friendRequests.length === 0 ? `<p class="muted" style="padding:10px 0;font-size:13.5px;">No pending friend requests</p>` : ''}
        ${state.friendRequests.map(r => `
          <div class="list-row">
            <div class="avatar"><img src="${r.requester?.avatar_url || DEFAULT_AVATARS.male}"></div>
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

      <b style="font-size:16px;">Your Friends (${state.friends.length})</b>
      <div style="margin-top:12px;">
        ${state.friends.length === 0 ? `<p class="muted" style="padding:10px 0;font-size:13.5px;">No friends added yet.</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row">
            <div class="avatar"><img src="${fr.avatar_url || DEFAULT_AVATARS.male}"></div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name || 'Friend')}</b>
              <div style="font-size:12px;color:#12b76a;">🟢 Active Now</div>
            </div>
            <button class="icon-btn startChatBtn" data-user-id="${fr.id}">${ICONS.messages}</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 4. MESSENGER VIEW (Parsed Links & Mentions in Chat)
// ----------------------------------------------------
function renderMessagesView() {
  if (state.activeChatUser) {
    const friendAvatar = state.activeChatUser.avatar_url || DEFAULT_AVATARS.male;
    return `
      <div class="card-ui chat-view">
        <div class="chat-header">
          <button class="btn ghost" id="backToChatListBtn" style="padding:4px 6px;">${ICONS.back}</button>
          <div class="avatar" style="width:40px;height:40px;"><img src="${friendAvatar}"></div>
          <div>
            <b style="font-size:15px;display:block;">${escapeHtml(state.activeChatUser.full_name)}</b>
            <small style="color:#12b76a;font-size:11px;">Active Now</small>
          </div>
        </div>
        <div class="chat-list" id="chatMessageList">
          <p class="muted center" style="margin-top:20px;">Loading chat...</p>
        </div>
        <form class="chat-input" id="chatSendForm">
          <textarea class="input" id="chatInputText" placeholder="Type a message..." rows="1" required></textarea>
          <button class="btn primary" type="submit" style="padding:10px 16px;">${ICONS.send}</button>
        </form>
      </div>
    `;
  }

  return `
    <div class="card-ui">
      <h2>Messages</h2>
      <input class="input" type="text" placeholder="Search conversations..." style="margin:14px 0;">
      <div>
        ${state.friends.length === 0 ? `<p class="muted center" style="padding:20px 0;">Add friends to start messaging!</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row startChatBtn" data-user-id="${fr.id}" style="cursor:pointer;">
            <div class="avatar"><img src="${fr.avatar_url || DEFAULT_AVATARS.male}"></div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name)}</b>
              <div class="muted" style="font-size:13px;">Say hello! 👋</div>
            </div>
            <small class="muted">Active</small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 5. SETTINGS VIEW
// ----------------------------------------------------
function renderSettingsView() {
  const p = state.profile || {};
  const userAvatar = p.avatar_url || (p.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male);

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
// 6. COMMENTS MODAL & REAL SHARE
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
    .select(`*, profiles:user_id (id, full_name, username, avatar_url)`)
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
            <img src="${c.profiles?.avatar_url || DEFAULT_AVATARS.male}">
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
    // Copy link fallback
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
// MODALS CONTROLLER
// ----------------------------------------------------
function renderActiveModal() {
  const container = document.getElementById('modalContainer');
  if (!container) return;

  if (state.modal === 'comments') {
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
    const userAvatar = p.avatar_url || DEFAULT_AVATARS.male;

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

          <!-- Feeling Picker -->
          <div id="feelingPickerBox" class="hide card-ui" style="background:#f8f9fe;padding:12px;margin:10px 0;">
            <b style="font-size:13px;">How are you feeling?</b>
            <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px;">
              ${['Happy 😊', 'Blessed 🙏', 'Excited 🤩', 'Loved ❤️', 'Crazy 🤪', 'Sad 😢', 'Cool 😎'].map(f => `
                <button class="btn secondary feelingSelectBtn" data-val="${f}" style="padding:5px 10px;font-size:12px;">${f}</button>
              `).join('')}
            </div>
          </div>

          <!-- Location Search -->
          <div id="locationSearchBox" class="hide card-ui" style="background:#f8f9fe;padding:12px;margin:10px 0;">
            <b style="font-size:13px;">Search World Location:</b>
            <input class="input" type="text" id="worldLocationSearchInput" placeholder="e.g. Dhaka, London, Tokyo..." style="margin-top:6px;">
            <div id="locationSearchResults" style="max-height:130px;overflow-y:auto;margin-top:6px;"></div>
          </div>

          <!-- Attachment bar -->
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
    const locInput = document.getElementById('worldLocationSearchInput');
    if (locInput) {
      locInput.oninput = async () => {
        const q = locInput.value.trim();
        if (q.length < 2) return;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=4`);
          const results = await res.json();
          document.getElementById('locationSearchResults').innerHTML = results.map(r => `
            <div class="list-row selectLocationRow" data-name="${escapeHtml(r.display_name.split(',').slice(0,2).join(','))}" style="cursor:pointer;padding:6px 0;font-size:12px;">
              📍 ${escapeHtml(r.display_name.split(',').slice(0,3).join(','))}
            </div>
          `).join('');
          document.querySelectorAll('.selectLocationRow').forEach(row => {
            row.onclick = () => { state.postDraft.location = row.dataset.name; renderActiveModal(); };
          });
        } catch (e) {}
      };
    }
    document.getElementById('publishPostBtn').onclick = handlePostPublish;
  } else if (state.modal === 'drawer') {
    const p = state.profile || {};
    const userAvatar = p.avatar_url || DEFAULT_AVATARS.male;

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
        <div class="full-modal" style="height:min(500px, 90vh);">
          <div class="row between" style="margin-bottom:14px;">
            <b>Search Alapon</b>
            <button class="btn ghost" id="closeSearchModal">✕</button>
          </div>
          <input class="input" type="text" id="liveSearchInput" placeholder="Search people by name or username..." autofocus>
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
      const { data } = await supabase.from('profiles').select('*').ilike('full_name', `%${q}%`).limit(8);
      const resEl = document.getElementById('liveSearchResults');
      if (data && data.length) {
        resEl.innerHTML = data.map(u => `
          <div class="list-row">
            <div class="avatar"><img src="${u.avatar_url || DEFAULT_AVATARS.male}"></div>
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
                <div class="avatar" style="width:36px;height:36px;"><img src="${n.actor?.avatar_url || DEFAULT_AVATARS.male}"></div>
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
  } else if (state.modal === 'edit-profile') {
    const p = state.profile || {};
    container.innerHTML = `
      <div class="full-modal-back">
        <div class="full-modal" style="height:auto;max-height:90vh;">
          <div class="row between" style="margin-bottom:14px;border-bottom:1px solid #edf0f5;padding-bottom:10px;">
            <b>Edit Profile</b>
            <button class="btn ghost" id="closeEditModal">✕</button>
          </div>
          <div class="field">
            <label>Full Name</label>
            <input class="input" type="text" id="editFullName" value="${escapeHtml(p.full_name || '')}">
          </div>
          <div class="field">
            <label>Bio</label>
            <textarea class="input" id="editBio" rows="2">${escapeHtml(p.bio || '')}</textarea>
          </div>
          <div class="field">
            <label>Location</label>
            <input class="input" type="text" id="editLocation" value="${escapeHtml(p.location || '')}">
          </div>
          <button class="btn primary full" id="saveProfileEditBtn" style="margin-top:14px;">Save Changes</button>
        </div>
      </div>
    `;
    document.getElementById('closeEditModal').onclick = () => { state.modal = null; renderActiveModal(); };
    document.getElementById('saveProfileEditBtn').onclick = async () => {
      const full_name = document.getElementById('editFullName').value.trim();
      const bio = document.getElementById('editBio').value.trim();
      const location = document.getElementById('editLocation').value.trim();
      await supabase.from('profiles').update({ full_name, bio, location }).eq('id', state.user.id);
      await loadUserProfile();
      state.modal = null;
      renderApp();
    };
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
              <div class="avatar" style="width:36px;height:36px;"><img src="${s.profiles?.avatar_url || DEFAULT_AVATARS.male}"></div>
              <b>${escapeHtml(s.profiles?.full_name || 'User')}</b>
            </div>
            <button class="btn ghost" id="closeStoryViewBtn" style="color:#fff;font-size:20px;">✕</button>
          </div>
          <img src="${s.media_url}" style="max-height:80vh;width:100%;object-fit:contain;border-radius:12px;">
        </div>
      </div>
    `;
    document.getElementById('closeStoryViewBtn').onclick = () => { state.modal = null; state.activeStory = null; renderActiveModal(); };
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
    if (el) el.onclick = () => { state.currentView = view; renderApp(); };
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

  const openSearch = document.getElementById('openSearchBtn');
  if (openSearch) openSearch.onclick = () => { state.modal = 'search'; renderActiveModal(); };

  const openNotif = document.getElementById('openNotifBtn');
  if (openNotif) openNotif.onclick = () => { state.modal = 'notifications'; renderActiveModal(); };

  const botCreate = document.getElementById('botCreate');
  if (botCreate) botCreate.onclick = () => { state.modal = 'create-post'; renderActiveModal(); };

  // Profile Edit & Drawer from Profile
  const editProf = document.getElementById('openEditProfileModal');
  if (editProf) editProf.onclick = () => { state.modal = 'edit-profile'; renderActiveModal(); };

  const profDrawer = document.getElementById('profileSideMenuTrigger');
  if (profDrawer) profDrawer.onclick = () => { state.modal = 'drawer'; renderActiveModal(); };

  // Story Upload Trigger
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

  // Story View Trigger
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

  // Profile Tabs
  const tPosts = document.getElementById('tabPostsBtn');
  if (tPosts) tPosts.onclick = () => { state.profileTab = 'posts'; renderApp(); };
  const tPhotos = document.getElementById('tabPhotosBtn');
  if (tPhotos) tPhotos.onclick = () => { state.profileTab = 'photos'; renderApp(); };
  const tAbout = document.getElementById('tabAboutBtn');
  if (tAbout) tAbout.onclick = () => { state.profileTab = 'about'; renderApp(); };

  // Settings Sub-options
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

  // Post Likes
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

  // Comments Trigger
  document.querySelectorAll('.commentPostBtn').forEach(btn => {
    btn.onclick = () => {
      openCommentsModal(btn.dataset.id);
    };
  });

  // Share Trigger
  document.querySelectorAll('.sharePostBtn').forEach(btn => {
    btn.onclick = () => {
      handleSharePost(btn.dataset.id, btn.dataset.text);
    };
  });

  // Friend Requests
  document.querySelectorAll('.acceptReqBtn').forEach(btn => {
    btn.onclick = async () => {
      await supabase.from('friendships').update({ status: 'accepted' }).eq('id', btn.dataset.id);
      await loadFriendsData();
      renderApp();
    };
  });

  document.querySelectorAll('.rejectReqBtn').forEach(btn => {
    btn.onclick = async () => {
      await supabase.from('friendships').delete().eq('id', btn.dataset.id);
      await loadFriendsData();
      renderApp();
    };
  });

  // Chat
  document.querySelectorAll('.startChatBtn').forEach(btn => {
    btn.onclick = () => {
      const friend = state.friends.find(f => f.id === btn.dataset.userId);
      if (friend) {
        state.activeChatUser = friend;
        state.currentView = 'messages';
        renderApp();
        loadChatMessages(friend.id);
      }
    };
  });

  const backChat = document.getElementById('backToChatListBtn');
  if (backChat) backChat.onclick = () => { state.activeChatUser = null; renderApp(); };

  const chatForm = document.getElementById('chatSendForm');
  if (chatForm) {
    chatForm.onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById('chatInputText');
      const text = input.value.trim();
      if (!text || !state.activeChatUser) return;
      input.value = '';
      await supabase.from('messages').insert({ sender_id: state.user.id, receiver_id: state.activeChatUser.id, content: text });
      loadChatMessages(state.activeChatUser.id);
    };
  }

  // Profile Avatar & Cover
  const avatarChangeBtn = document.getElementById('changeAvatarProfileBtn');
  const avatarChangeInput = document.getElementById('changeAvatarInput');
  if (avatarChangeBtn && avatarChangeInput) {
    avatarChangeBtn.onclick = () => avatarChangeInput.click();
    avatarChangeInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop();
      const url = await uploadFile('avatars', `user_${state.user.id}_${Date.now()}.${ext}`, file);
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', state.user.id);
      await loadUserProfile();
      renderApp();
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

async function loadChatMessages(otherUserId) {
  const listEl = document.getElementById('chatMessageList');
  if (!listEl) return;
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${state.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${state.user.id})`)
    .order('created_at', { ascending: true });

  if (messages && messages.length > 0) {
    listEl.innerHTML = messages.map(m => `
      <div class="bubble ${m.sender_id === state.user.id ? 'mine' : 'theirs'}">
        ${formatRichText(m.content)}
      </div>
    `).join('');
    listEl.scrollTop = listEl.scrollHeight;
  } else {
    listEl.innerHTML = `<p class="muted center" style="margin-top:20px;">No messages yet. Say hello!</p>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
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
