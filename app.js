// State Management
const state = {
  currentPage: 'home',
  events: [
    {
      id: 'e1',
      title: 'جَرية شروق على النيل',
      organizer: 'Cairo Runners Club',
      date: 'الجمعة، ١٧ أكتوبر · ٦:٣٠ ص',
      location: 'الزمالك',
      meetingPoint: 'نقطة تجمع كوبري قصر النيل',
      distance: 5,
      level: 'مبتدئة',
      price: 'مجانية',
      seatsLeft: 7,
      totalSeats: 20,
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80',
      description: 'تعالوا نجروا مع بعض مع شروق الشمس على كورنيش النيل، الهوا نضيف والسرعة هادية ومناسبة للجميع.',
      saved: false,
      booked: true,
      ticketRef: 'RM-7XYUTM'
    },
    {
      id: 'e2',
      title: 'لفّة خضرا في المعادي',
      organizer: 'Stride Society',
      date: 'السبت، ١٨ أكتوبر · ٧:٠٠ ص',
      location: 'المعادي',
      meetingPoint: 'ميدان الفورايد',
      distance: 7,
      level: 'متوسطة',
      price: '120 ج.م',
      seatsLeft: 3,
      totalSeats: 15,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
      description: 'جَرية بين الشوارع الخضرا في المعادي. المسافة ٧ كم بأسلوب ركض مستمر ومتوسط.',
      saved: false,
      booked: false
    },
    {
      id: 'e3',
      title: 'خطوات على الكورنيش',
      organizer: 'Run Club Cairo',
      date: 'الأحد، ١٩ أكتوبر · ٦:٠٠ ص',
      location: 'وسط البلد',
      meetingPoint: 'أمام ماسبيرو',
      distance: 5,
      level: 'مبتدئة',
      price: 'مجانية',
      seatsLeft: 0,
      totalSeats: 25,
      image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&auto=format&fit=crop&q=80',
      description: 'جَرية خفيفة لمبتدئين في قلب القاهرة.',
      saved: false,
      booked: false
    },
    {
      id: 'e4',
      title: 'تحدي ١٠ كم · مدينة نصر',
      organizer: 'The Pace Project',
      date: 'الجمعة، ٢٤ أكتوبر · ٦:١٥ ص',
      location: 'مدينة نصر',
      meetingPoint: 'الحديقة الدولية - البوابة الرئيسية',
      distance: 10,
      level: 'متقدمة',
      price: '180 ج.م',
      seatsLeft: 7,
      totalSeats: 12,
      image: 'https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d?w=600&auto=format&fit=crop&q=80',
      description: 'تحدي مسافة ١٠ كم ببيس منتظم وسريع للعدائين المتقدمين.',
      saved: false,
      booked: false
    }
  ],
  chats: {
    e1: [
      { sender: 'مريم حسن', text: 'أهلاً يا جماعة! متحمسة للجَرية 👟', time: '١٠:١٢', mine: false },
      { sender: 'مريم حسن', text: 'هنقابل بعض عند نقطة التجمع الساعة ٦:٢٠؟', time: '١٠:١٨', mine: false },
      { sender: 'أنتِ', text: 'تمام، هشوفكم هناك 🙌', time: '١٠:٢٤', mine: true }
    ]
  },
  activeChatId: 'e1'
};

// DOM Elements
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('[data-page]');
const crumbActive = document.getElementById('crumb-active');
const homeRuns = document.getElementById('home-runs');
const exploreRuns = document.getElementById('explore-runs');
const ticketList = document.getElementById('ticket-list');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const toast = document.getElementById('toast');

// Navigation Function
function navigateTo(pageId) {
  state.currentPage = pageId;
  pages.forEach(p => p.classList.toggle('active', p.id === `page-${pageId}`));
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-page') === pageId);
  });
  
  const labels = {
    home: 'الرئيسية',
    explore: 'اكتشف',
    tickets: 'تذاكري',
    chats: 'المحادثات',
    profile: 'حسابي',
    organizer: 'نظّمي جَرية'
  };
  if (crumbActive) crumbActive.textContent = labels[pageId] || 'الرئيسية';
  window.scrollTo(0, 0);
}

// Show Toast
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3000);
}

// Render Event Card
function createRunCard(event) {
  const isFull = event.seatsLeft === 0;
  return `
    <article class="run-card">
      <div class="run-image">
        <img loading="lazy" src="${event.image}" alt="${event.title}">
        <span class="run-badge ${isFull ? 'full' : ''}">${isFull ? 'اكتملت المقاعد' : `${event.seatsLeft} مقاعد متبقية`}</span>
        <button class="save-run ${event.saved ? 'saved' : ''}" aria-label="Save run" data-save="${event.id}">
          ${event.saved ? '♥' : '♡'}
        </button>
      </div>
      <div class="run-info">
        <div class="run-org">✦ ${event.organizer}</div>
        <h3>${event.title}</h3>
        <div class="run-detail">
          <span>◷ ${event.date}</span>
          <span>⌖ ${event.location}</span>
          <span>↗ ${event.distance} كم</span>
          <span>◎ ${event.level}</span>
        </div>
        <div class="run-foot">
          <div class="run-price">${event.price} <small>· ${event.seatsLeft} متاح</small></div>
          <button class="run-open" data-event="${event.id}">التفاصيل ↙</button>
        </div>
      </div>
    </article>
  `;
}

// Render Home & Explore
function renderEvents() {
  if (homeRuns) homeRuns.innerHTML = state.events.slice(0, 3).map(createRunCard).join('');
  
  // Filtering logic for Explore page
  const searchVal = document.getElementById('search')?.value.toLowerCase() || '';
  const levelVal = document.getElementById('filter-level')?.value || 'all';
  const priceVal = document.getElementById('filter-price')?.value || 'all';

  const filtered = state.events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchVal) || e.location.toLowerCase().includes(searchVal);
    const matchesLevel = levelVal === 'all' || e.level === levelVal;
    const matchesPrice = priceVal === 'all' || (priceVal === 'free' ? e.price === 'مجانية' : e.price !== 'مجانية');
    return matchesSearch && matchesLevel && matchesPrice;
  });

  if (exploreRuns) exploreRuns.innerHTML = filtered.map(createRunCard).join('');
  const resultCount = document.getElementById('result-count');
  if (resultCount) resultCount.textContent = `${filtered.length} جريات قريبة`;
}

// Render Tickets
function renderTickets() {
  const bookedEvents = state.events.filter(e => e.booked);
  const ticketCount = document.getElementById('ticket-count');
  const upcomingNum = document.getElementById('upcoming-num');
  const runTotal = document.getElementById('run-total');
  
  if (ticketCount) ticketCount.textContent = bookedEvents.length;
  if (upcomingNum) upcomingNum.textContent = bookedEvents.length;
  if (runTotal) runTotal.textContent = bookedEvents.length;

  if (!ticketList) return;
  
  if (bookedEvents.length === 0) {
    ticketList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">لا توجد تذاكر محجوزة حالياً.</p>`;
    return;
  }

  ticketList.innerHTML = bookedEvents.map(e => `
    <article class="ticket-card">
      <img src="${e.image}" alt="${e.title}">
      <div class="ticket-body">
        <p class="eyebrow">✓ تأكيد الحجز · 1 تذكرة</p>
        <h3>${e.title}</h3>
        <div class="ticket-data">
          <span>◷ ${e.date}</span>
          <span>⌖ ${e.meetingPoint}</span>
        </div>
        <div class="ticket-ref">
          <span>رقم الحجز</span><b>${e.ticketRef || 'RM-999999'}</b>
        </div>
        <div class="ticket-actions">
          <button data-event="${e.id}">عرض التذكرة</button>
          <button class="cancel-booking" data-cancel="${e.id}">إلغاء الحجز</button>
        </div>
      </div>
    </article>
  `).join('');
}

// Modal Detail View
function openModal(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  modalContent.innerHTML = `
    <div style="position: relative; height: 200px;">
      <img src="${event.image}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="padding: 1.5rem;">
      <div class="run-org">✦ ${event.organizer}</div>
      <h2 style="margin-bottom: 0.5rem;">${event.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">${event.description}</p>
      <div class="run-detail" style="margin-bottom: 1.5rem;">
        <span>◷ ${event.date}</span>
        <span>⌖ نقطة التجمع: ${event.meetingPoint}</span>
        <span>↗ المسافة: ${event.distance} كم</span>
        <span>◎ المستوى: ${event.level}</span>
      </div>
      <button class="primary-btn" id="book-btn" style="width: 100%; justify-content: center;">
        ${event.booked ? 'إلغاء الحجز' : (event.seatsLeft > 0 ? 'حجز مكان الآن' : 'المقاعد مكتملة')}
      </button>
    </div>
  `;

  const bookBtn = document.getElementById('book-btn');
  if (bookBtn && event.seatsLeft > 0) {
    bookBtn.addEventListener('click', () => {
      event.booked = !event.booked;
      if (event.booked) {
        event.seatsLeft--;
        event.ticketRef = 'RM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        showToast('تم حجز التذكرة بنجاح! 🎉');
      } else {
        event.seatsLeft++;
        showToast('تم إلغاء الحجز.');
      }
      modal.classList.remove('active');
      renderEvents();
      renderTickets();
    });
  }

  modal.classList.add('active');
}

// Render Chat
function renderChats() {
  const chatList = document.getElementById('chat-list');
  const chatHead = document.getElementById('chat-head');
  const chatMessages = document.getElementById('chat-messages');

  const activeEvent = state.events.find(e => e.id === state.activeChatId);
  if (!activeEvent) return;

  if (chatList) {
    chatList.innerHTML = state.events.filter(e => e.booked).map(e => `
      <div class="chat-entry ${e.id === state.activeChatId ? 'active' : ''}" data-chat="${e.id}">
        <img src="${e.image}" alt="">
        <div>
          <b>${e.title}</b>
          <small>جروب الجَرية الرسمي</small>
        </div>
      </div>
    `).join('');
  }

  if (chatHead) {
    chatHead.innerHTML = `
      <img src="${activeEvent.image}" alt="">
      <div>
        <b>${activeEvent.title}</b>
        <small>${activeEvent.date} · ${activeEvent.meetingPoint}</small>
      </div>
    `;
  }

  if (chatMessages) {
    const msgs = state.chats[state.activeChatId] || [];
    chatMessages.innerHTML = msgs.map(m => `
      <div class="message ${m.mine ? 'mine' : ''}">
        <span>${m.text}</span>
        <small>${m.sender} · ${m.time}</small>
      </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.addEventListener('click', e => {
    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      navigateTo(pageBtn.getAttribute('data-page'));
      return;
    }

    const openBtn = e.target.closest('[data-event]');
    if (openBtn) {
      openModal(openBtn.getAttribute('data-event'));
      return;
    }

    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      const id = saveBtn.getAttribute('data-save');
      const ev = state.events.find(e => e.id === id);
      if (ev) {
        ev.saved = !ev.saved;
        showToast(ev.saved ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة');
        renderEvents();
      }
      return;
    }

    const cancelBtn = e.target.closest('[data-cancel]');
    if (cancelBtn) {
      const id = cancelBtn.getAttribute('data-cancel');
      const ev = state.events.find(e => e.id === id);
      if (ev) {
        ev.booked = false;
        ev.seatsLeft++;
        showToast('تم إلغاء الحجز.');
        renderEvents();
        renderTickets();
      }
      return;
    }

    const chatEntry = e.target.closest('[data-chat]');
    if (chatEntry) {
      state.activeChatId = chatEntry.getAttribute('data-chat');
      renderChats();
    }
  });

  // Modal Close
  modalClose?.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  // Filter Listeners
  ['search', 'filter-level', 'filter-price'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderEvents);
  });

  document.getElementById('reset-filters')?.addEventListener('click', () => {
    if (document.getElementById('search')) document.getElementById('search').value = '';
    if (document.getElementById('filter-level')) document.getElementById('filter-level').value = 'all';
    if (document.getElementById('filter-price')) document.getElementById('filter-price').value = 'all';
    renderEvents();
  });

  // Send Chat Message
  const chatForm = document.getElementById('chat-compose');
  chatForm?.addEventListener('submit', e => {
    e.preventDefault();
    const input = chatForm.querySelector('input');
    const val = input.value.trim();
    if (!val) return;

    if (!state.chats[state.activeChatId]) state.chats[state.activeChatId] = [];
    state.chats[state.activeChatId].push({
      sender: 'أنتِ',
      text: val,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      mine: true
    });

    input.value = '';
    renderChats();
  });

  // Organizer Form Demo Submission
  const orgForm = document.getElementById('organizer-form');
  orgForm?.addEventListener('submit', e => {
    e.preventDefault();
    const newEvent = {
      id: 'e' + (state.events.length + 1),
      title: document.getElementById('org-title').value,
      organizer: 'سارة أحمد',
      date: document.getElementById('org-date').value + ' · ' + document.getElementById('org-time').value,
      location: document.getElementById('org-location').value,
      meetingPoint: document.getElementById('org-location').value,
      distance: Number(document.getElementById('org-distance').value),
      level: document.getElementById('org-level').value,
      price: 'مجانية',
      seatsLeft: Number(document.getElementById('org-seats').value),
      totalSeats: Number(document.getElementById('org-seats').value),
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop&q=80',
      description: 'جَرية جديدة تم إنشاؤها عبر المعاينة.',
      saved: false,
      booked: false
    };

    state.events.unshift(newEvent);
    showToast('تمت إضافة الجَرية بنجاح! 🎉');
    orgForm.reset();
    renderEvents();
    navigateTo('explore');
  });

  // Initial Render
  renderEvents();
  renderTickets();
  renderChats();
});