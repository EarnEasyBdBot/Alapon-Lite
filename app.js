// app.js — Main Application Controller
import { supabase, isConfigured, uploadFile } from './supabase.js';

// State Management
const state = {
  user: null,
  profile: null,
  currentView: 'feed', // 'feed' | 'profile' | 'friends' | 'messages' | 'settings'
  activeChatUser: null,
  posts: [],
  stories: [],
  friends: [],
  friendRequests: [],
  unreadMessagesCount: 0,
  unreadNotificationsCount: 0,
  modal: null, // null | 'create-post-1' | 'create-post-2' | 'drawer' | 'comments'
  createPostDraft: {
    content: '',
    mediaUrl: '',
    mediaType: 'photo',
    privacy: 'public',
    feeling: '',
    location: '',
    allowComments: true,
    allowShares: true,
    allowTagging: true
  }
};

// DOM Root
const app = document.getElementById('app');

// Initialization
async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  if (!isConfigured()) {
    renderConfigWarning();
    return;
  }

  // Check current session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    state.user = session.user;
    await loadUserProfile();
    await loadInitialData();
    setupRealtime();
    renderApp();
  } else {
    renderAuth('login');
  }

  // Listen to auth state changes
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

// Configuration Guard
function renderConfigWarning() {
  app.innerHTML = `
    <div class="boot">
      <div class="logo">A</div>
      <h2>Alapon Configuration Needed</h2>
      <p class="muted center" style="max-width:380px;">Please open <code>supabase.js</code> and enter your <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code>.</p>
    </div>
  `;
}

// User Profile Loader
async function loadUserProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', state.user.id)
    .single();

  if (data) {
    state.profile = data;
  }
}

// Load Initial App Data
async function loadInitialData() {
  await Promise.all([
    loadFeed(),
    loadStories(),
    loadFriendsData(),
    loadUnreadCounts()
  ]);
}

// Feed Loader
async function loadFeed() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (id, full_name, username, avatar_url, is_verified),
      post_likes (id, user_id, reaction_type),
      comments (id),
      post_shares (id)
    `)
    .order('created_at', { ascending: false });

  if (data) state.posts = data;
}

// Stories Loader
async function loadStories() {
  const { data } = await supabase
    .from('stories')
    .select(`*, profiles:user_id (id, full_name, username, avatar_url)`)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (data) state.stories = data;
}

// Friends Data Loader
async function loadFriendsData() {
  if (!state.user) return;
  // Requests received
  const { data: requests } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id (id, full_name, username, avatar_url)`)
    .eq('receiver_id', state.user.id)
    .eq('status', 'pending');

  state.friendRequests = requests || [];

  // Accepted friendships
  const { data: friendsList } = await supabase
    .from('friendships')
    .select(`*, requester:requester_id(id, full_name, username, avatar_url), receiver:receiver_id(id, full_name, username, avatar_url)`)
    .or(`requester_id.eq.${state.user.id},receiver_id.eq.${state.user.id}`)
    .eq('status', 'accepted');

  state.friends = (friendsList || []).map(f => f.requester_id === state.user.id ? f.receiver : f.requester);
}

// Unread Counts
async function loadUnreadCounts() {
  if (!state.user) return;
  const { count: msgCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', state.user.id)
    .eq('is_read', false);

  const { count: notifCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', state.user.id)
    .eq('is_read', false);

  state.unreadMessagesCount = msgCount || 0;
  state.unreadNotificationsCount = notifCount || 0;
}

// Realtime Subscriptions
function setupRealtime() {
  supabase
    .channel('public:alapon')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
      loadFeed().then(renderApp);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
      loadUnreadCounts().then(renderApp);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
      loadUnreadCounts().then(renderApp);
    })
    .subscribe();
}

// ----------------------------------------------------
// UI RENDERING: AUTH SCREENS (Login & Signup)
// ----------------------------------------------------
function renderAuth(mode = 'login') {
  if (mode === 'login') {
    app.innerHTML = `
      <div class="auth">
        <div class="auth-hero">
          <div class="hero-inner">
            <div class="brand-logo" style="width:70px;height:70px;font-size:36px;margin-bottom:20px;">💬</div>
            <h1>Alapon</h1>
            <p>Connect • Share • Grow</p>
          </div>
        </div>
        <div class="auth-card">
          <div class="card">
            <h2>Login</h2>
            <p class="muted">Welcome back! Please login to your account.</p>
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
                <a href="#" id="forgotBtn" style="font-size:13px;color:#3544cc;text-decoration:none;font-weight:700;">Forgot Password?</a>
              </div>
              <button class="btn primary full" type="submit">Login →</button>
              <div class="divider">or</div>
              <button class="btn secondary full" type="button" id="googleLoginBtn">
                <span style="font-size:16px;margin-right:6px;">🌐</span> Continue with Google
              </button>
              <p class="center muted" style="margin-top:24px;font-size:14px;">
                Don't have an account? <a href="#" id="toSignup" style="color:#3544cc;font-weight:800;text-decoration:none;">Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('toSignup').onclick = (e) => { e.preventDefault(); renderAuth('signup'); };
    document.getElementById('loginForm').onsubmit = handleLoginSubmit;
    document.getElementById('googleLoginBtn').onclick = handleGoogleLogin;
  } else {
    app.innerHTML = `
      <div class="auth">
        <div class="auth-hero">
          <div class="hero-inner">
            <div class="brand-logo" style="width:70px;height:70px;font-size:36px;margin-bottom:20px;">💬</div>
            <h1>Alapon</h1>
            <p>Connect • Share • Grow</p>
          </div>
        </div>
        <div class="auth-card">
          <div class="card" style="max-height:90vh;overflow-y:auto;padding-right:8px;">
            <a href="#" id="toLoginFromBack" style="text-decoration:none;color:#3544cc;font-size:20px;font-weight:900;">❮</a>
            <h2 style="margin-top:10px;">Sign Up</h2>
            <p class="muted">Create your Alapon account</p>
            <form id="signupForm">
              <div class="field">
                <label>Full Name</label>
                <input class="input" type="text" id="regFullName" placeholder="Tanvir Hasan" required>
              </div>
              <div class="field">
                <label>Email Address</label>
                <input class="input" type="email" id="regEmail" placeholder="tanvir@example.com" required>
              </div>
              <div class="field">
                <label>Username</label>
                <input class="input" type="text" id="regUsername" placeholder="tanvirhasan" required>
              </div>
              <div class="field">
                <label>Password</label>
                <input class="input" type="password" id="regPassword" placeholder="••••••••" minlength="6" required>
              </div>
              <div class="field">
                <label>Date of Birth</label>
                <input class="input" type="date" id="regBirthDate">
              </div>
              <div class="field">
                <label>Profile Picture (Optional)</label>
                <div class="row" style="gap:15px;margin-top:8px;">
                  <div class="avatar" id="avatarPreview" style="width:65px;height:65px;font-size:24px;">👤</div>
                  <input type="file" id="regAvatarFile" accept="image/*" style="display:none;">
                  <button type="button" class="btn secondary" id="uploadAvatarBtn">⬆ Upload Photo</button>
                </div>
              </div>
              <button class="btn primary full" type="submit" style="margin-top:16px;">Sign Up →</button>
              <p class="muted center" style="font-size:12px;margin:15px 0;">By signing up, you agree to our Terms & Privacy Policy</p>
              <p class="center muted" style="font-size:14px;">
                Already have an account? <a href="#" id="toLogin" style="color:#3544cc;font-weight:800;text-decoration:none;">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('toLogin').onclick = (e) => { e.preventDefault(); renderAuth('login'); };
    document.getElementById('toLoginFromBack').onclick = (e) => { e.preventDefault(); renderAuth('login'); };
    document.getElementById('uploadAvatarBtn').onclick = () => document.getElementById('regAvatarFile').click();
    document.getElementById('regAvatarFile').onchange = handleAvatarPreview;
    document.getElementById('signupForm').onsubmit = handleSignupSubmit;
  }
}

// Handlers for Auth
async function handleLoginSubmit(e) {
  e.preventDefault();
  const ident = document.getElementById('loginIdentifier').value.trim();
  const password = document.getElementById('loginPassword').value;

  let email = ident;
  if (!ident.includes('@')) {
    // Resolve username to email
    const { data, error } = await supabase.rpc('get_email_by_username', { p_username: ident });
    if (!data) {
      alert('Username not found. Please verify or use email.');
      return;
    }
    email = data;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) alert(error.message);
}

let uploadedAvatarFile = null;
function handleAvatarPreview(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedAvatarFile = file;
  const url = URL.createObjectURL(file);
  document.getElementById('avatarPreview').innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;">`;
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const full_name = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const username = document.getElementById('regUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
  const password = document.getElementById('regPassword').value;
  const birth_date = document.getElementById('regBirthDate').value;

  let avatar_url = '';
  if (uploadedAvatarFile) {
    try {
      const ext = uploadedAvatarFile.name.split('.').pop();
      const path = `${Date.now()}_avatar.${ext}`;
      avatar_url = await uploadFile('avatars', path, uploadedAvatarFile);
    } catch (err) {
      console.warn("Avatar upload fallback", err);
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, username, birth_date, avatar_url }
    }
  });

  if (error) {
    alert(error.message);
  } else {
    alert('Account created successfully! Logging you in...');
  }
}

// ----------------------------------------------------
// MAIN APPLICATION SHELL & ROUTER
// ----------------------------------------------------
function renderApp() {
  const p = state.profile || { full_name: 'Tanvir Hasan', username: 'tanvirhasan' };

  app.innerHTML = `
    <div class="app-shell">
      <!-- TOP BAR -->
      <header class="topbar">
        <button class="icon-btn" id="menuToggleBtn">☰</button>
        <div class="brand" style="cursor:pointer;" id="brandHomeBtn">
          <div class="brand-logo">💬</div>
          <span>Alapon</span>
        </div>
        <div class="search">
          <input class="input" type="text" id="globalSearch" placeholder="🔍 Search Alapon...">
        </div>
        <div class="top-actions">
          <button class="icon-btn" id="navNotifBtn">
            🔔 ${state.unreadNotificationsCount > 0 ? `<span class="badge">${state.unreadNotificationsCount}</span>` : ''}
          </button>
          <div class="avatar" id="topbarAvatar" style="cursor:pointer;width:40px;height:40px;">
            ${p.avatar_url ? `<img src="${p.avatar_url}">` : p.full_name.charAt(0)}
          </div>
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="layout">
        <!-- LEFT SIDEBAR (Desktop) -->
        <aside class="side">
          <div class="card-ui" style="padding:12px;">
            <button class="navitem ${state.currentView === 'feed' ? 'active' : ''}" id="sideHomeBtn">🏠 Home</button>
            <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="sideProfileBtn">👤 Profile</button>
            <button class="navitem ${state.currentView === 'friends' ? 'active' : ''}" id="sideFriendsBtn">👥 Friends</button>
            <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="sideMessagesBtn">
              💬 Messages ${state.unreadMessagesCount > 0 ? `<span class="badge" style="position:static;display:inline-block;margin-left:8px;">${state.unreadMessagesCount}</span>` : ''}
            </button>
            <button class="navitem ${state.currentView === 'settings' ? 'active' : ''}" id="sideSettingsBtn">⚙️ Settings</button>
            <div class="divider" style="margin:10px 0;"></div>
            <button class="navitem" id="sideLogoutBtn" style="color:#d92d20;">🚪 Log Out</button>
          </div>
        </aside>

        <!-- MAIN VIEW CONTAINER -->
        <main class="feed">
          ${renderCurrentViewContent()}
        </main>

        <!-- RIGHT SIDEBAR (Desktop Suggested Friends / Online) -->
        <aside class="rightbar">
          <div class="card-ui">
            <div class="row between">
              <b>Friend Requests</b>
              <small class="muted">${state.friendRequests.length}</small>
            </div>
            ${renderFriendRequestsSnippet()}
          </div>
        </aside>
      </div>

      <!-- BOTTOM NAVIGATION (Mobile) -->
      <nav class="bottom-nav">
        <button class="navitem ${state.currentView === 'feed' ? 'active' : ''}" id="botHome">🏠<br>Home</button>
        <button class="navitem ${state.currentView === 'friends' ? 'active' : ''}" id="botFriends">👥<br>Friends</button>
        <button class="navitem" id="botCreate" style="color:#315cff;font-size:22px;font-weight:900;">➕</button>
        <button class="navitem ${state.currentView === 'messages' ? 'active' : ''}" id="botMessages">💬<br>Messages</button>
        <button class="navitem ${state.currentView === 'profile' ? 'active' : ''}" id="botProfile">👤<br>Profile</button>
      </nav>

      <!-- MODAL CONTAINER (Create post 2-step / Drawer / Comments) -->
      <div id="modalContainer"></div>
    </div>
  `;

  attachGlobalEvents();
  renderActiveModal();
}

function renderFriendRequestsSnippet() {
  if (!state.friendRequests.length) {
    return `<p class="muted center" style="font-size:13px;padding:12px 0;">No new requests</p>`;
  }
  return state.friendRequests.slice(0, 3).map(r => `
    <div class="list-row">
      <div class="avatar" style="width:38px;height:38px;">
        ${r.requester?.avatar_url ? `<img src="${r.requester.avatar_url}">` : '👤'}
      </div>
      <div class="grow" style="font-size:13px;">
        <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
        <div class="row" style="margin-top:5px;gap:5px;">
          <button class="btn primary acceptReqBtn" data-id="${r.id}" style="padding:4px 8px;font-size:11px;">Confirm</button>
          <button class="btn secondary rejectReqBtn" data-id="${r.id}" style="padding:4px 8px;font-size:11px;">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ----------------------------------------------------
// VIEW ROUTER SWITCH
// ----------------------------------------------------
function renderCurrentViewContent() {
  switch (state.currentView) {
    case 'feed':
      return renderFeedView();
    case 'profile':
      return renderProfileView();
    case 'friends':
      return renderFriendsView();
    case 'messages':
      return renderMessagesView();
    case 'settings':
      return renderSettingsView();
    default:
      return renderFeedView();
  }
}

// ----------------------------------------------------
// 1. FEED VIEW
// ----------------------------------------------------
function renderFeedView() {
  const p = state.profile || {};
  return `
    <!-- STORIES ROW -->
    <div class="card-ui stories" style="margin-bottom:14px;padding:12px 14px;">
      <div class="story" id="addStoryBtn" style="cursor:pointer;">
        <div class="avatar" style="border: 2px dashed #5264f0;background:#f0f3ff;">➕</div>
        <span>Add Story</span>
      </div>
      <div class="story">
        <div class="avatar" style="border:3px solid #7142ff;">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
        <span>Your Story</span>
      </div>
      ${state.stories.map(s => `
        <div class="story">
          <div class="avatar" style="border:3px solid #315cff;">
            ${s.profiles?.avatar_url ? `<img src="${s.profiles.avatar_url}">` : '👤'}
          </div>
          <span>${escapeHtml(s.profiles?.full_name?.split(' ')[0] || 'Friend')}</span>
        </div>
      `).join('')}
    </div>

    <!-- COMPOSER TRIGGER -->
    <div class="card-ui composer" style="cursor:pointer;" id="openComposerBar">
      <div class="avatar">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
      <input class="input" type="text" placeholder="What's on your mind?" readonly style="cursor:pointer;">
      <span style="font-size:20px;">🖼️</span>
      <span style="font-size:20px;">🎥</span>
      <span style="font-size:20px;">😊</span>
    </div>

    <!-- POSTS LIST -->
    <div class="posts-list">
      ${state.posts.length === 0 ? `<div class="card-ui empty">No posts yet. Share something with the community!</div>` : ''}
      ${state.posts.map(post => renderPostCard(post)).join('')}
    </div>
  `;
}

function renderPostCard(post) {
  const isLiked = post.post_likes?.some(l => l.user_id === state.user?.id);
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const sharesCount = post.post_shares?.length || 0;

  return `
    <div class="card-ui" data-post-id="${post.id}">
      <div class="post-head">
        <div class="avatar">
          ${post.profiles?.avatar_url ? `<img src="${post.profiles.avatar_url}">` : '👤'}
        </div>
        <div>
          <div style="font-weight:800;display:flex;align-items:center;gap:4px;">
            ${escapeHtml(post.profiles?.full_name || 'User')}
            ${post.profiles?.is_verified ? `<span style="color:#245bff;font-size:13px;">✔</span>` : ''}
          </div>
          <small class="muted">${formatTimeAgo(post.created_at)} • 🌐 ${post.privacy}</small>
        </div>
        <button class="icon-btn more" style="margin-left:auto;background:transparent;">•••</button>
      </div>

      <div style="margin:12px 0 6px;line-height:1.55;font-size:15px;white-space:pre-wrap;">
        ${escapeHtml(post.content)}
      </div>

      ${post.media_url ? `<img class="post-media" src="${post.media_url}" loading="lazy">` : ''}

      <!-- COUNTERS ROW -->
      <div class="row between muted" style="font-size:13px;margin:12px 0 4px;padding:0 4px;">
        <div>👍 ❤️ <b>${likesCount}</b></div>
        <div><span>${commentsCount} Comments</span> • <span>${sharesCount} Shares</span></div>
      </div>

      <!-- ACTIONS -->
      <div class="post-actions">
        <button class="likePostBtn ${isLiked ? 'active' : ''}" data-id="${post.id}" style="${isLiked ? 'color:#315cff;font-weight:800;' : ''}">
          ${isLiked ? '❤️ Liked' : '👍 Like'}
        </button>
        <button class="commentPostBtn" data-id="${post.id}">💬 Comment</button>
        <button class="sharePostBtn" data-id="${post.id}">↗️ Share</button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. PROFILE VIEW
// ----------------------------------------------------
function renderProfileView() {
  const p = state.profile || {};
  const userPosts = state.posts.filter(item => item.user_id === state.user?.id);

  return `
    <div class="card-ui" style="padding:0;overflow:hidden;">
      <div class="profile-cover" style="${p.cover_url ? `background:url(${p.cover_url}) center/cover;` : ''}"></div>
      <div class="profile-main">
        <div class="row between" style="align-items:flex-end;">
          <div class="avatar profile-avatar">
            ${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}
          </div>
          <button class="btn secondary" id="editProfileModalBtn">✏️ Edit Profile</button>
        </div>
        <div style="margin-top:12px;">
          <h2 style="margin:0;display:flex;align-items:center;gap:6px;">
            ${escapeHtml(p.full_name || '')}
            ${p.is_verified ? `<span style="color:#245bff;">✔</span>` : ''}
          </h2>
          <span class="muted">@${escapeHtml(p.username || '')}</span>
          <p style="margin:8px 0;">${escapeHtml(p.bio || 'Tech Lover | Content Creator | Dream Big')}</p>
          <small class="muted">📍 ${escapeHtml(p.location || 'Dhaka, Bangladesh')}</small>
        </div>

        <div class="stats">
          <div class="stat"><b>${userPosts.length}</b><span class="muted">Posts</span></div>
          <div class="stat"><b>${state.friends.length}</b><span class="muted">Friends</span></div>
          <div class="stat"><b>1.2K</b><span class="muted">Followers</span></div>
        </div>

        <div class="tabs">
          <button class="active">Posts</button>
          <button>Photos</button>
          <button>Videos</button>
          <button>Tagged</button>
        </div>
      </div>
    </div>

    <!-- USER POSTS -->
    <div style="margin-top:14px;">
      ${userPosts.map(post => renderPostCard(post)).join('')}
    </div>
  `;
}

// ----------------------------------------------------
// 3. FRIENDS VIEW
// ----------------------------------------------------
function renderFriendsView() {
  return `
    <div class="card-ui">
      <h2>Friends</h2>
      <input class="input" type="text" placeholder="🔍 Search friends..." style="margin-bottom:14px;">

      <b>Friend Requests</b>
      <div style="margin-bottom:20px;">
        ${state.friendRequests.length === 0 ? `<p class="muted">No pending friend requests</p>` : ''}
        ${state.friendRequests.map(r => `
          <div class="list-row">
            <div class="avatar">${r.requester?.avatar_url ? `<img src="${r.requester.avatar_url}">` : '👤'}</div>
            <div class="grow">
              <b>${escapeHtml(r.requester?.full_name || 'User')}</b>
              <div class="muted" style="font-size:12px;">@${escapeHtml(r.requester?.username || '')}</div>
            </div>
            <div class="row">
              <button class="btn primary acceptReqBtn" data-id="${r.id}">Confirm</button>
              <button class="btn secondary rejectReqBtn" data-id="${r.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>

      <b>Your Friends (${state.friends.length})</b>
      <div>
        ${state.friends.length === 0 ? `<p class="muted">No friends yet. Search and connect!</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row">
            <div class="avatar">${fr.avatar_url ? `<img src="${fr.avatar_url}">` : '👤'}</div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name || 'Friend')}</b>
              <div style="font-size:12px;color:#12b76a;">🟢 Online</div>
            </div>
            <button class="icon-btn startChatBtn" data-user-id="${fr.id}">💬</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 4. MESSAGES / CHAT VIEW
// ----------------------------------------------------
function renderMessagesView() {
  if (state.activeChatUser) {
    return `
      <div class="card-ui chat">
        <div class="row" style="border-bottom:1px solid #eee;padding-bottom:10px;">
          <button class="btn ghost" id="backToChatListBtn">❮ Back</button>
          <div class="avatar" style="width:36px;height:36px;">
            ${state.activeChatUser.avatar_url ? `<img src="${state.activeChatUser.avatar_url}">` : '👤'}
          </div>
          <b>${escapeHtml(state.activeChatUser.full_name)}</b>
        </div>
        <div class="chat-list" id="chatMessageList">
          <p class="muted center" style="margin-top:20px;">Loading conversation...</p>
        </div>
        <form class="chat-input" id="chatSendForm">
          <textarea class="input" id="chatInputText" placeholder="Write a message..." rows="1" required></textarea>
          <button class="btn primary" type="submit">Send</button>
        </form>
      </div>
    `;
  }

  return `
    <div class="card-ui">
      <h2>Messages</h2>
      <input class="input" type="text" placeholder="🔍 Search messages..." style="margin-bottom:14px;">
      <div>
        ${state.friends.length === 0 ? `<p class="muted center">Add friends to start messaging</p>` : ''}
        ${state.friends.map(fr => `
          <div class="list-row startChatBtn" data-user-id="${fr.id}" style="cursor:pointer;">
            <div class="avatar">${fr.avatar_url ? `<img src="${fr.avatar_url}">` : '👤'}</div>
            <div class="grow">
              <b>${escapeHtml(fr.full_name)}</b>
              <div class="muted" style="font-size:13px;">Click to chat</div>
            </div>
            <small class="muted">Now</small>
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
  return `
    <div class="card-ui">
      <h2>Settings</h2>
      <div class="list-row" style="margin-bottom:15px;">
        <div class="avatar">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
        <div class="grow">
          <b>${escapeHtml(p.full_name || '')}</b>
          <div class="muted">@${escapeHtml(p.username || '')}</div>
        </div>
        <span>❯</span>
      </div>

      <div class="list-row"><b>🛡️ Account & Security</b><span class="muted">❯</span></div>
      <div class="list-row"><b>🔒 Privacy</b><span class="muted">❯</span></div>
      <div class="list-row"><b>🔔 Notifications</b><span class="muted">❯</span></div>
      <div class="list-row">
        <b>🌐 Language</b>
        <span class="muted">English ❯</span>
      </div>
      <div class="list-row">
        <b>🎨 Theme</b>
        <span class="muted">Light ❯</span>
      </div>

      <button class="btn secondary full" id="settingsLogoutBtn" style="margin-top:25px;color:#d92d20;background:#fee4e2;">
        Log Out
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// 2-STEP CREATE POST FLOW & MODALS
// ----------------------------------------------------
function renderActiveModal() {
  const container = document.getElementById('modalContainer');
  if (!container) return;

  if (state.modal === 'create-post-1') {
    const p = state.profile || {};
    container.innerHTML = `
      <div class="modal-back">
        <div class="modal">
          <div class="row between">
            <button class="btn ghost" id="closeModalBtn">❮ Back</button>
            <b>Create Post</b>
            <span class="tag">Step 1/2</span>
          </div>
          <div class="progress"><i style="width:50%;"></i></div>

          <div class="row" style="margin-bottom:12px;">
            <div class="avatar">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
            <div>
              <b>${escapeHtml(p.full_name || '')}</b>
              <div>
                <select id="postPrivacySelect" style="border:1px solid #ddd;border-radius:6px;padding:2px 6px;font-size:12px;">
                  <option value="public" ${state.createPostDraft.privacy === 'public' ? 'selected' : ''}>🌐 Public</option>
                  <option value="friends" ${state.createPostDraft.privacy === 'friends' ? 'selected' : ''}>👥 Friends</option>
                  <option value="only_me" ${state.createPostDraft.privacy === 'only_me' ? 'selected' : ''}>🔒 Only Me</option>
                </select>
              </div>
            </div>
          </div>

          <textarea class="input" id="postContentInput" placeholder="What's on your mind?" style="min-height:110px;margin-bottom:12px;">${escapeHtml(state.createPostDraft.content)}</textarea>

          <input type="file" id="postMediaFileInput" accept="image/*,video/*" style="display:none;">
          <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:15px;">
            <button class="btn secondary" id="choosePhotoBtn" style="padding:6px 12px;font-size:13px;">📷 Photo</button>
            <button class="btn secondary" id="chooseVideoBtn" style="padding:6px 12px;font-size:13px;">🎥 Video</button>
            <button class="btn secondary" id="chooseFeelingBtn" style="padding:6px 12px;font-size:13px;">😊 Feeling</button>
            <button class="btn secondary" id="chooseLocBtn" style="padding:6px 12px;font-size:13px;">📍 Location</button>
          </div>

          <div id="mediaPreviewArea" style="margin-bottom:15px;">
            ${state.createPostDraft.mediaUrl ? `<img src="${state.createPostDraft.mediaUrl}" style="max-height:160px;border-radius:12px;">` : ''}
          </div>

          <button class="btn primary full" id="toStep2Btn">Next →</button>
        </div>
      </div>
    `;

    document.getElementById('closeModalBtn').onclick = () => { state.modal = null; renderActiveModal(); };
    document.getElementById('choosePhotoBtn').onclick = () => document.getElementById('postMediaFileInput').click();
    document.getElementById('chooseVideoBtn').onclick = () => document.getElementById('postMediaFileInput').click();
    document.getElementById('postMediaFileInput').onchange = handlePostMediaUpload;

    document.getElementById('toStep2Btn').onclick = () => {
      state.createPostDraft.content = document.getElementById('postContentInput').value;
      state.createPostDraft.privacy = document.getElementById('postPrivacySelect').value;
      state.modal = 'create-post-2';
      renderActiveModal();
    };
  } else if (state.modal === 'create-post-2') {
    const p = state.profile || {};
    container.innerHTML = `
      <div class="modal-back">
        <div class="modal">
          <div class="row between">
            <button class="btn ghost" id="backToStep1Btn">❮ Back</button>
            <b>Preview Post</b>
            <span class="tag">Step 2/2</span>
          </div>
          <div class="progress"><i style="width:100%;"></i></div>

          <!-- POST PREVIEW CARD -->
          <div class="card-ui" style="border:1px dashed #315cff;padding:12px;margin-bottom:15px;">
            <div class="post-head">
              <div class="avatar">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
              <div>
                <b>${escapeHtml(p.full_name || '')}</b>
                <small class="muted">Just now • 🌐 ${state.createPostDraft.privacy}</small>
              </div>
            </div>
            <p style="margin:10px 0;white-space:pre-wrap;">${escapeHtml(state.createPostDraft.content)}</p>
            ${state.createPostDraft.mediaUrl ? `<img src="${state.createPostDraft.mediaUrl}" style="max-height:180px;width:100%;object-fit:cover;border-radius:10px;">` : ''}
          </div>

          <!-- PERMISSIONS -->
          <div class="list-row">
            <div class="grow">💬 Allow Comments</div>
            <input type="checkbox" id="allowCommentsCheck" ${state.createPostDraft.allowComments ? 'checked' : ''}>
          </div>
          <div class="list-row">
            <div class="grow">↗️ Share Post</div>
            <input type="checkbox" id="allowSharesCheck" ${state.createPostDraft.allowShares ? 'checked' : ''}>
          </div>
          <div class="list-row">
            <div class="grow">🏷️ Tagging</div>
            <input type="checkbox" id="allowTaggingCheck" ${state.createPostDraft.allowTagging ? 'checked' : ''}>
          </div>

          <div class="row" style="margin-top:20px;gap:10px;">
            <button class="btn secondary" id="cancelPublishBtn" style="flex:1;">Back</button>
            <button class="btn primary" id="publishPostFinalBtn" style="flex:2;">🚀 Publish</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('backToStep1Btn').onclick = () => { state.modal = 'create-post-1'; renderActiveModal(); };
    document.getElementById('cancelPublishBtn').onclick = () => { state.modal = 'create-post-1'; renderActiveModal(); };
    document.getElementById('publishPostFinalBtn').onclick = handleFinalPostPublish;
  } else if (state.modal === 'drawer') {
    const p = state.profile || {};
    container.innerHTML = `
      <div class="modal-back" style="justify-content:flex-start;padding:0;">
        <div class="modal" style="height:100vh;max-height:100vh;width:280px;border-radius:0;margin:0;">
          <div class="row between" style="margin-bottom:15px;">
            <div class="avatar">${p.avatar_url ? `<img src="${p.avatar_url}">` : '👤'}</div>
            <button class="btn ghost" id="closeDrawerBtn">✕</button>
          </div>
          <b>${escapeHtml(p.full_name || '')}</b>
          <div class="muted" style="font-size:13px;margin-bottom:15px;">@${escapeHtml(p.username || '')}</div>
          <button class="navitem drawerNav" data-view="feed">🏠 Home</button>
          <button class="navitem drawerNav" data-view="profile">👤 Profile</button>
          <button class="navitem drawerNav" data-view="friends">👥 Friends</button>
          <button class="navitem drawerNav" data-view="messages">💬 Messages</button>
          <button class="navitem drawerNav" data-view="settings">⚙️ Settings</button>
          <div class="divider"></div>
          <button class="btn secondary full" id="drawerLogoutBtn" style="color:#d92d20;">Log Out</button>
        </div>
      </div>
    `;

    document.getElementById('closeDrawerBtn').onclick = () => { state.modal = null; renderActiveModal(); };
    document.querySelectorAll('.drawerNav').forEach(btn => {
      btn.onclick = () => {
        state.currentView = btn.dataset.view;
        state.modal = null;
        renderApp();
      };
    });
    document.getElementById('drawerLogoutBtn').onclick = () => supabase.auth.signOut();
  } else {
    container.innerHTML = '';
  }
}

// Media upload handler for posts
async function handlePostMediaUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const ext = file.name.split('.').pop();
    const path = `posts/${Date.now()}_media.${ext}`;
    const url = await uploadFile('post-media', path, file);
    state.createPostDraft.mediaUrl = url;
    state.createPostDraft.mediaType = file.type.startsWith('video') ? 'video' : 'photo';
    renderActiveModal();
  } catch (err) {
    alert('Media upload failed: ' + err.message);
  }
}

// Publish post action
async function handleFinalPostPublish() {
  const allowComments = document.getElementById('allowCommentsCheck').checked;
  const allowShares = document.getElementById('allowSharesCheck').checked;
  const allowTagging = document.getElementById('allowTaggingCheck').checked;

  const { error } = await supabase.from('posts').insert({
    user_id: state.user.id,
    content: state.createPostDraft.content,
    media_url: state.createPostDraft.mediaUrl,
    media_type: state.createPostDraft.mediaType,
    privacy: state.createPostDraft.privacy,
    allow_comments: allowComments,
    allow_shares: allowShares,
    allow_tagging: allowTagging
  });

  if (error) {
    alert('Error publishing post: ' + error.message);
  } else {
    state.modal = null;
    state.createPostDraft = {
      content: '',
      mediaUrl: '',
      mediaType: 'photo',
      privacy: 'public',
      feeling: '',
      location: '',
      allowComments: true,
      allowShares: true,
      allowTagging: true
    };
    await loadFeed();
    renderApp();
  }
}

// ----------------------------------------------------
// EVENT LISTENERS & DELEGATION
// ----------------------------------------------------
function attachGlobalEvents() {
  // Navigation Buttons
  const bindNav = (id, view) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => { state.currentView = view; renderApp(); };
  };

  bindNav('brandHomeBtn', 'feed');
  bindNav('sideHomeBtn', 'feed');
  bindNav('botHome', 'feed');
  bindNav('sideProfileBtn', 'profile');
  bindNav('botProfile', 'profile');
  bindNav('topbarAvatar', 'profile');
  bindNav('sideFriendsBtn', 'friends');
  bindNav('botFriends', 'friends');
  bindNav('sideMessagesBtn', 'messages');
  bindNav('botMessages', 'messages');
  bindNav('sideSettingsBtn', 'settings');

  // Mobile Drawer Toggle
  const menuToggle = document.getElementById('menuToggleBtn');
  if (menuToggle) menuToggle.onclick = () => { state.modal = 'drawer'; renderActiveModal(); };

  // Create Post Triggers
  const openComposer = document.getElementById('openComposerBar');
  if (openComposer) openComposer.onclick = () => { state.modal = 'create-post-1'; renderActiveModal(); };

  const botCreate = document.getElementById('botCreate');
  if (botCreate) botCreate.onclick = () => { state.modal = 'create-post-1'; renderActiveModal(); };

  // Logout Buttons
  const sideLogout = document.getElementById('sideLogoutBtn');
  if (sideLogout) sideLogout.onclick = () => supabase.auth.signOut();

  const settingsLogout = document.getElementById('settingsLogoutBtn');
  if (settingsLogout) settingsLogout.onclick = () => supabase.auth.signOut();

  // Post Actions (Like, Comment, Share)
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

  // Friend Request Accept / Reject
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

  // Chat Trigger
  document.querySelectorAll('.startChatBtn').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.dataset.userId;
      const friend = state.friends.find(f => f.id === targetId);
      if (friend) {
        state.activeChatUser = friend;
        state.currentView = 'messages';
        renderApp();
        loadChatMessages(targetId);
      }
    };
  });

  const backToChatList = document.getElementById('backToChatListBtn');
  if (backToChatList) {
    backToChatList.onclick = () => {
      state.activeChatUser = null;
      renderApp();
    };
  }

  const chatForm = document.getElementById('chatSendForm');
  if (chatForm) {
    chatForm.onsubmit = async (e) => {
      e.preventDefault();
      const input = document.getElementById('chatInputText');
      const text = input.value.trim();
      if (!text || !state.activeChatUser) return;
      input.value = '';

      await supabase.from('messages').insert({
        sender_id: state.user.id,
        receiver_id: state.activeChatUser.id,
        content: text
      });
      loadChatMessages(state.activeChatUser.id);
    };
  }
}

// Chat Loader
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
        ${escapeHtml(m.content)}
      </div>
    `).join('');
    listEl.scrollTop = listEl.scrollHeight;
  } else {
    listEl.innerHTML = `<p class="muted center" style="margin-top:20px;">No messages yet. Say hello!</p>`;
  }
}

// Utility Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Initialize application on load
init();