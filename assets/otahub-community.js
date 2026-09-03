/**
 * OtaHub Asia - Realtime Community & Analytics Engine
 * Features: Live Pageviews, Realtime Comments, Emoji Reactions, Community Ratings
 */
(function () {
  'use strict';

  function getSlug() {
    const path = window.location.pathname.replace(/^\/en\//, '/').replace(/^\//, '').replace(/\.html$/, '') || 'home';
    return path;
  }

  function getArticleTitle() {
    const h1 = document.querySelector('h1.art-h1, h1.art-hero-title, h1');
    return h1 ? h1.textContent.trim() : document.title;
  }

  function getFingerprint() {
    let fp = localStorage.getItem('otahub_fp');
    if (!fp) {
      fp = 'user_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('otahub_fp', fp);
    }
    return fp;
  }

  // ── 1. REALTIME PAGE VIEWS ──
  async function initPageViews(supabase) {
    const slug = getSlug();
    const title = getArticleTitle();
    const viewEls = document.querySelectorAll('.live-view-count, .art-meta .view-count');

    try {
      // Call atomic RPC
      const { data, error } = await supabase.rpc('increment_page_view', {
        p_slug: slug,
        p_title: title
      });

      if (!error && data) {
        viewEls.forEach(el => {
          el.innerHTML = '👁️ ' + Number(data).toLocaleString() + ' lượt xem';
        });
      } else {
        // Fallback query
        const { data: row } = await supabase
          .from('article_views')
          .select('view_count')
          .eq('article_slug', slug)
          .single();
        if (row && row.view_count) {
          viewEls.forEach(el => {
            el.innerHTML = '👁️ ' + Number(row.view_count).toLocaleString() + ' lượt xem';
          });
        }
      }
    } catch (e) {
      console.warn('[OtaHub Supabase] View count sync fallback active.');
    }
  }

  // ── 2. REALTIME REACTIONS ──
  async function initReactions(supabase) {
    const slug = getSlug();
    const reactContainer = document.getElementById('otahub-reactions');
    if (!reactContainer) return;

    const reactionTypes = [
      { id: 'fire', emoji: '🔥', label: 'Cực Nóng' },
      { id: 'love', emoji: '❤️', label: 'Yêu Thích' },
      { id: 'clap', emoji: '👏', label: 'Quá Đỉnh' },
      { id: 'insight', emoji: '💡', label: 'Bổ Ích' },
      { id: 'mindblown', emoji: '🤯', label: 'Sốc' }
    ];

    // Render Reaction UI
    reactContainer.innerHTML = `
      <div class="react-box-wrap">
        <div class="react-title">⚡ BẠN THẤY BÀI VIẾT NÀY THẾ NÀO?</div>
        <div class="react-list">
          ${reactionTypes.map(r => `
            <button class="react-btn" data-type="${r.id}" type="button">
              <span class="react-em">${r.emoji}</span>
              <span class="react-lbl">${r.label}</span>
              <span class="react-cnt" id="cnt-${r.id}">0</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Fetch existing reactions
    try {
      const { data } = await supabase
        .from('article_reactions')
        .select('reaction_type, count')
        .eq('article_slug', slug);

      if (data) {
        data.forEach(row => {
          const cntEl = document.getElementById('cnt-' + row.reaction_type);
          if (cntEl) cntEl.textContent = row.count;
        });
      }
    } catch (e) {}

    // Handle reaction click
    reactContainer.querySelectorAll('.react-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const type = this.getAttribute('data-type');
        const cntEl = document.getElementById('cnt-' + type);
        const cur = parseInt(cntEl.textContent || '0', 10);
        cntEl.textContent = cur + 1;
        this.classList.add('active');

        try {
          await supabase.rpc('increment_reaction', {
            p_slug: slug,
            p_reaction: type
          });
        } catch (e) {}
      });
    });

    // Realtime channel for reactions
    supabase
      .channel('reactions_' + slug)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'article_reactions', filter: 'article_slug=eq.' + slug }, payload => {
        if (payload.new) {
          const el = document.getElementById('cnt-' + payload.new.reaction_type);
          if (el) el.textContent = payload.new.count;
        }
      })
      .subscribe();
  }

  // ── 3. REALTIME COMMENTS ──
  async function initComments(supabase) {
    const slug = getSlug();
    const commentContainer = document.getElementById('otahub-comments');
    if (!commentContainer) return;

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'
    ];
    let selectedAvatar = avatars[0];

    commentContainer.innerHTML = `
      <div class="cmt-section">
        <div class="cmt-header">
          <div class="cmt-title">💬 THẢO LUẬN CỘNG ĐỒNG (<span id="cmt-count">0</span>)</div>
          <div class="cmt-live-badge">🟢 Realtime Live</div>
        </div>

        <form class="cmt-form" id="cmt-form">
          <div class="cmt-form-top">
            <div class="cmt-avatar-picker">
              <span class="cmt-picker-lbl">Chọn avatar:</span>
              <div class="cmt-avatars">
                ${avatars.map((av, idx) => `
                  <img src="${av}" class="cmt-av-opt ${idx === 0 ? 'selected' : ''}" data-src="${av}" alt="Avatar">
                `).join('')}
              </div>
            </div>
            <div class="cmt-inputs">
              <input type="text" id="cmt-name" placeholder="Tên của bạn (VD: Wukong Master)" required class="cmt-input" maxlength="30">
            </div>
          </div>
          <textarea id="cmt-content" placeholder="Chia sẻ cảm nghĩ của bạn về bài viết này..." required class="cmt-textarea" rows="3"></textarea>
          <div class="cmt-form-bottom">
            <span class="cmt-note">⚡ Bình luận hiển thị ngay lập tức</span>
            <button type="submit" class="cmt-submit-btn" id="cmt-submit">Gửi Bình Luận 🚀</button>
          </div>
        </form>

        <div class="cmt-list" id="cmt-list">
          <div class="cmt-loading">Đang tải bình luận...</div>
        </div>
      </div>
    `;

    // Avatar pick
    commentContainer.querySelectorAll('.cmt-av-opt').forEach(img => {
      img.addEventListener('click', function () {
        commentContainer.querySelectorAll('.cmt-av-opt').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        selectedAvatar = this.getAttribute('data-src');
      });
    });

    const cmtList = document.getElementById('cmt-list');
    const cmtCountEl = document.getElementById('cmt-count');

    // Fetch comments
    async function loadComments() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('article_slug', slug)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (!error && data) {
          cmtCountEl.textContent = data.length;
          if (data.length === 0) {
            cmtList.innerHTML = '<div class="cmt-empty">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ! 🌟</div>';
          } else {
            cmtList.innerHTML = data.map(c => renderCommentItem(c)).join('');
          }
        }
      } catch (e) {
        cmtList.innerHTML = '<div class="cmt-empty">Bình luận đang sẵn sàng...</div>';
      }
    }

    function renderCommentItem(c) {
      const timeStr = new Date(c.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
      return `
        <div class="cmt-item" id="cmt-${c.id}">
          <img src="${c.author_avatar || avatars[0]}" class="cmt-item-avatar" alt="${c.author_name}">
          <div class="cmt-item-body">
            <div class="cmt-item-head">
              <span class="cmt-item-name">${escapeHtml(c.author_name)}</span>
              ${c.is_admin ? '<span class="cmt-badge-admin">Admin</span>' : ''}
              <span class="cmt-item-time">${timeStr}</span>
            </div>
            <div class="cmt-item-text">${escapeHtml(c.content)}</div>
          </div>
        </div>
      `;
    }

    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    loadComments();

    // Submit handler
    const form = document.getElementById('cmt-form');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('cmt-name').value.trim();
      const content = document.getElementById('cmt-content').value.trim();
      if (!name || !content) return;

      const submitBtn = document.getElementById('cmt-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';

      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([
            {
              article_slug: slug,
              author_name: name,
              author_avatar: selectedAvatar,
              content: content,
              status: 'approved'
            }
          ])
          .select();

        if (!error && data && data[0]) {
          document.getElementById('cmt-content').value = '';
          const empty = cmtList.querySelector('.cmt-empty');
          if (empty) empty.remove();
          cmtList.insertAdjacentHTML('afterbegin', renderCommentItem(data[0]));
          cmtCountEl.textContent = parseInt(cmtCountEl.textContent || '0', 10) + 1;
        }
      } catch (err) {
        alert('Gửi bình luận thất bại. Vui lòng thử lại!');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi Bình Luận 🚀';
      }
    });

    // Realtime subscription
    supabase
      .channel('comments_' + slug)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: 'article_slug=eq.' + slug }, payload => {
        if (payload.new && payload.new.status === 'approved') {
          const existing = document.getElementById('cmt-' + payload.new.id);
          if (!existing) {
            const empty = cmtList.querySelector('.cmt-empty');
            if (empty) empty.remove();
            cmtList.insertAdjacentHTML('afterbegin', renderCommentItem(payload.new));
            cmtCountEl.textContent = parseInt(cmtCountEl.textContent || '0', 10) + 1;
          }
        }
      })
      .subscribe();
  }

  // ── 4. STYLES INJECTION ──
  function injectCommunityStyles() {
    if (document.getElementById('otahub-community-css')) return;
    const style = document.createElement('style');
    style.id = 'otahub-community-css';
    style.textContent = `
      /* Reactions */
      .react-box-wrap {
        background: rgba(18, 8, 44, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 229, 255, 0.25);
        border-radius: 14px;
        padding: 24px;
        margin: 36px 0;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
      .react-title {
        font-family: var(--fd, sans-serif);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: .12em;
        color: #00e5ff;
        margin-bottom: 16px;
        text-transform: uppercase;
      }
      .react-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
      }
      .react-btn {
        background: rgba(30, 16, 72, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 10px 18px;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--fd, sans-serif);
        font-weight: 700;
        font-size: 13px;
        transition: all .2s ease;
      }
      .react-btn:hover, .react-btn.active {
        background: rgba(0, 229, 255, 0.15);
        border-color: #00e5ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(0, 229, 255, 0.3);
      }
      .react-em { font-size: 18px; }
      .react-cnt {
        background: rgba(255, 255, 255, 0.15);
        padding: 2px 7px;
        border-radius: 20px;
        font-size: 11px;
      }

      /* Comments */
      .cmt-section {
        background: rgba(18, 8, 44, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 48, 128, 0.25);
        border-radius: 16px;
        padding: 28px 24px;
        margin: 40px 0;
        box-shadow: 0 10px 36px rgba(0,0,0,0.6);
      }
      .cmt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 14px;
      }
      .cmt-title {
        font-family: var(--fd, sans-serif);
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: .05em;
      }
      .cmt-live-badge {
        font-size: 11px;
        color: #22c55e;
        font-weight: 700;
        background: rgba(34, 197, 94, 0.15);
        padding: 4px 10px;
        border-radius: 20px;
        border: 1px solid rgba(34, 197, 94, 0.3);
      }
      .cmt-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 28px;
        background: rgba(255, 255, 255, 0.03);
        padding: 18px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .cmt-form-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
      }
      .cmt-avatar-picker {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cmt-picker-lbl { font-size: 12px; color: #cbd5e1; font-weight: 600; }
      .cmt-avatars { display: flex; gap: 6px; }
      .cmt-av-opt {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all .2s;
      }
      .cmt-av-opt.selected { border-color: #00e5ff; transform: scale(1.15); }
      .cmt-input {
        background: rgba(10, 4, 26, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px 14px;
        color: #ffffff;
        font-size: 13px;
        outline: none;
        width: 240px;
      }
      .cmt-input:focus, .cmt-textarea:focus { border-color: #00e5ff; }
      .cmt-textarea {
        background: rgba(10, 4, 26, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 12px 14px;
        color: #ffffff;
        font-size: 14px;
        outline: none;
        resize: vertical;
        font-family: inherit;
      }
      .cmt-form-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .cmt-note { font-size: 12px; color: #94a3b8; }
      .cmt-submit-btn {
        background: linear-gradient(90deg, #ff3080 0%, #00e5ff 100%);
        border: none;
        color: #ffffff;
        font-family: var(--fd, sans-serif);
        font-weight: 800;
        font-size: 13.5px;
        padding: 10px 22px;
        border-radius: 8px;
        cursor: pointer;
        transition: opacity .2s, transform .2s;
      }
      .cmt-submit-btn:hover { opacity: 0.92; transform: translateY(-1px); }
      .cmt-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .cmt-list { display: flex; flex-direction: column; gap: 14px; }
      .cmt-item {
        display: flex;
        gap: 14px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        padding: 14px 16px;
        border-radius: 10px;
        animation: fadeIn .3s ease;
      }
      .cmt-item-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
        border: 1px solid rgba(0, 229, 255, 0.3);
      }
      .cmt-item-body { flex: 1; min-width: 0; }
      .cmt-item-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }
      .cmt-item-name { font-weight: 700; color: #00e5ff; font-size: 13.5px; }
      .cmt-badge-admin {
        background: #ff3080;
        color: #fff;
        font-size: 9.5px;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 800;
      }
      .cmt-item-time { font-size: 11px; color: #94a3b8; margin-left: auto; }
      .cmt-item-text { font-size: 13.5px; line-height: 1.6; color: #f1f5f9; word-break: break-word; }
      .cmt-empty, .cmt-loading { text-align: center; color: #94a3b8; padding: 24px; font-size: 13.5px; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  // ── INIT ON READY ──
  function init() {
    injectCommunityStyles();
    if (window.otahubSupabase) {
      initPageViews(window.otahubSupabase);
      initReactions(window.otahubSupabase);
      initComments(window.otahubSupabase);
    } else {
      window.addEventListener('otahub:supabase:ready', e => {
        initPageViews(e.detail);
        initReactions(e.detail);
        initComments(e.detail);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();