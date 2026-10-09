// الحالة العتامة للتطبيق (Application State)
const state = {
  currentUser: null,
  events: [
    {
      id: 'e1',
      title: 'جَرية شروق على النيل',
      organizer: 'Cairo Runners Club',
      date: 'الجمعة · ٦:٣٠ ص',
      location: 'الزمالك',
      distance: 5,
      price: 'مجانية',
      seatsLeft: 7,
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80',
      booked: false
    },
    {
      id: 'e2',
      title: 'لفّة خضرا في المعادي',
      organizer: 'Stride Society',
      date: 'السبت · ٧:٠٠ ص',
      location: 'المعادي',
      distance: 7,
      price: '120 ج.م',
      seatsLeft: 3,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
      booked: false
    }
  ]
};

// التبديل بين نماذج تسجيل الدخول والحساب الجديد
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

tabLogin?.addEventListener('click', () => {
  tabLogin.classList.add('active'); tabRegister.classList.remove('active');
  formLogin.style.display = 'flex'; formRegister.style.display = 'none';
});

tabRegister?.addEventListener('click', () => {
  tabRegister.classList.add('active'); tabLogin.classList.remove('active');
  formRegister.style.display = 'flex'; formLogin.style.display = 'none';
});

// معالجة إنشاء الحساب وتسجيل الدخول
formRegister?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  loginUser({ name, email });
});

formLogin?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  loginUser({ name: email.split('@')[0], email });
});

function loginUser(user) {
  state.currentUser = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-shell').classList.add('authenticated');
  
  // تحديث بيانات المستخدم في واجهة الصفحة
  const initial = user.name.charAt(0).toUpperCase();
  document.getElementById('user-avatar-initials').textContent = initial;
  document.getElementById('profile-avatar-large').textContent = initial;
  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-email-display').textContent = user.email;
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('welcome-title').textContent = `أهلاً بك يا ${user.name} 👋`;

  renderEvents();
}

// تسجيل الخروج
document.getElementById('logout-btn')?.addEventListener('click', () => {
  location.reload();
});

// التنقل بين الصفحات
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('[data-page]');

function navigateTo(pageId) {
  pages.forEach(p => p.classList.toggle('active', p.id === `page-${pageId}`));
  navItems.forEach(item => item.classList.toggle('active', item.getAttribute('data-page') === pageId));
}

document.addEventListener('click', e => {
  const pageBtn = e.target.closest('[data-page]');
  if (pageBtn) navigateTo(pageBtn.getAttribute('data-page'));

  const openBtn = e.target.closest('[data-event]');
  if (openBtn) openModal(openBtn.getAttribute('data-event'));
});

// عرض بطاقات الجريات
function createRunCard(event) {
  return `
    <article class="run-card">
      <div class="run-image">
        <img src="${event.image}" alt="">
        <span class="run-badge">${event.seatsLeft} مقاعد متبقية</span>
      </div>
      <div class="run-info">
        <div class="run-org">✦ ${event.organizer}</div>
        <h3>${event.title}</h3>
        <div class="run-detail">
          <span>◷ ${event.date}</span>
          <span>⌖ ${event.location} · ${event.distance} كم</span>
        </div>
        <div class="run-foot">
          <div class="run-price">${event.price}</div>
          <button class="run-open" data-event="${event.id}">التفاصيل ↙</button>
        </div>
      </div>
    </article>
  `;
}

function renderEvents() {
  const homeRuns = document.getElementById('home-runs');
  const exploreRuns = document.getElementById('explore-runs');
  
  if (homeRuns) homeRuns.innerHTML = state.events.map(createRunCard).join('');
  if (exploreRuns) exploreRuns.innerHTML = state.events.map(createRunCard).join('');
  
  const booked = state.events.filter(e => e.booked);
  const ticketCount = document.getElementById('ticket-count');
  if (ticketCount) ticketCount.textContent = booked.length;
  
  const ticketList = document.getElementById('ticket-list');
  if (ticketList) {
    ticketList.innerHTML = booked.length === 0 ? 
      '<p style="color:var(--text-muted); text-align:center; padding:2rem;">لم تحجز أي تذكرة بعد.</p>' :
      booked.map(e => `
        <div class="ticket-card">
          <img src="${e.image}">
          <div class="ticket-body">
            <h3>${e.title}</h3>
            <p style="color:var(--text-muted); font-size:0.85rem;">${e.date} · ${e.location}</p>
          </div>
        </div>
      `).join('');
  }
}

// تفاصيل الجرية (Modal)
const modal = document.getElementById('modal');
function openModal(id) {
  const event = state.events.find(e => e.id === id);
  if (!event) return;
  document.getElementById('modal-content').innerHTML = `
    <div style="padding: 1.5rem;">
      <h2>${event.title}</h2>
      <p style="color:var(--text-muted); margin: 0.5rem 0 1.5rem 0;">منظم الجرية: ${event.organizer}</p>
      <button class="primary-btn" id="book-now-btn" style="width:100%; justify-content:center;">
        ${event.booked ? 'إلغاء الحجز' : 'حجز مكان الآن'}
      </button>
    </div>
  `;
  document.getElementById('book-now-btn').onclick = () => {
    event.booked = !event.booked;
    modal.classList.remove('active');
    renderEvents();
  };
  modal.classList.add('active');
}

document.getElementById('modal-close')?.addEventListener('click', () => modal.classList.remove('active'));

// إنشاء جرية جديدة بواسطة المنظم
document.getElementById('organizer-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const newEvent = {
    id: 'e' + (state.events.length + 1),
    title: document.getElementById('org-title').value,
    organizer: state.currentUser.name,
    date: document.getElementById('org-date').value,
    location: document.getElementById('org-location').value,
    distance: document.getElementById('org-distance').value,
    price: 'مجانية',
    seatsLeft: document.getElementById('org-seats').value,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop&q=80',
    booked: false
  };
  state.events.unshift(newEvent);
  renderEvents();
  navigateTo('explore');
});