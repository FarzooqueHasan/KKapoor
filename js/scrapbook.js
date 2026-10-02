/**
 * Kiara Kapoor Scrapbook Portfolio Controller
 * - Tactile Pastel Paper Confetti Physics
 * - Interactive Birthday Sticky Notes Wall (Guestbook with localStorage)
 * - Birthday Toast Modal Dialog
 * - Polaroid Click Interactions
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Scrapbook Confetti Engine (Paper scraps, tape strips, stars)
  // ---------------------------------------------------------------------------
  var confettiCanvas = null;
  var confettiCtx = null;
  var confettiParticles = [];
  var confettiAnimId = null;

  var CONFETTI_COLORS = [
    '#6E93B2', /* Vintage Blue Washi */
    '#D7BC98', /* Brown Kraft Paper */
    '#FFF18F', /* Classic Yellow Post-it */
    '#D28E7D', /* Terracotta Peach */
    '#A2B596', /* Matcha Sage */
    '#F3CCD3', /* Birthday Pink */
    '#E69A28'  /* Pencil Gold */
  ];

  function setupConfettiCanvas() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confetti-canvas';
      document.body.appendChild(confettiCanvas);
    }
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
  }

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function triggerScrapbookConfetti(count) {
    if (!confettiCanvas) setupConfettiCanvas();
    resizeConfetti();

    var num = count || 85;
    var w = confettiCanvas.width;

    for (var i = 0; i < num; i++) {
      confettiParticles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 80,
        w: 9 + Math.random() * 12,
        h: 7 + Math.random() * 16,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2.2 + Math.random() * 4,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
        opacity: 1
      });
    }

    if (!confettiAnimId) {
      runConfettiLoop();
    }
  }

  function runConfettiLoop() {
    if (!confettiCtx || !confettiCanvas) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (var i = confettiParticles.length - 1; i >= 0; i--) {
      var p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.vy += 0.04;

      if (p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;

      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else if (p.shape === 'circle') {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2);
        confettiCtx.fill();
      } else {
        // Star or triangle scrap
        confettiCtx.beginPath();
        confettiCtx.moveTo(0, -p.h / 2);
        confettiCtx.lineTo(p.w / 2, p.h / 2);
        confettiCtx.lineTo(-p.w / 2, p.h / 2);
        confettiCtx.closePath();
        confettiCtx.fill();
      }

      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(runConfettiLoop);
    } else {
      confettiAnimId = null;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Birthday Modal Controller
  // ---------------------------------------------------------------------------
  function initBirthdayModal() {
    var modal = document.getElementById('bday-modal');
    var openBtns = document.querySelectorAll('.trigger-bday');
    var closeBtn = document.getElementById('bday-modal-close');

    if (!modal) return;

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('active');
        triggerScrapbookConfetti(110);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Interactive Birthday Guestbook Wall (Sticky Notes)
  // ---------------------------------------------------------------------------
  var DEFAULT_NOTES = [
    {
      author: 'Team Frigidus Ignis • AEROSS',
      text: 'Happy 17th birthday Kia! From grinding RWDC airfoil CAD files to winning All-India 1st and qualifying for Washington D.C. — you are our design MVP! 🚀🏆',
      color: '#e2cfb3',
      date: 'Today',
      rot: -2
    },
    {
      author: 'CyberX CS Gang • DPS RKP',
      text: 'Happy birthday kfckapoor!! 🍗 Stop centering divs with margin-left: 47% (jk cyberxctf is actually god-tier architecture). Best front-end dev in 11th grade!',
      color: '#b5946e',
      date: 'Today',
      rot: 2.2
    },
    {
      author: 'Exun Clan \'26 • Frontend Lab',
      text: 'HBD Kia!! The Aether web platform and symposium mockups look insane. May all your flexboxes stay centered and your Vercel deploys stay green! ✨',
      color: '#e2cfb3',
      date: 'Today',
      rot: -1.5
    },
    {
      author: 'Class 11-J Desk Partner',
      text: 'Happy sweet 17th Kia! Please don\'t drink 3 hazelnut lattes before physics class tomorrow 😂 Enjoy your day, you deserve all the celebration! ☕🎂',
      color: '#C5CEBC',
      date: 'Today',
      rot: 2.5
    }
  ];

  function initGuestbook() {
    var grid = document.getElementById('sticky-wall-grid');
    var form = document.getElementById('guestbook-form');
    var colorBtns = document.querySelectorAll('.color-circle-btn');
    var selectedColorInput = document.getElementById('selected-note-color');

    if (!grid || !form) return;

    // Handle color selector
    colorBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        colorBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (selectedColorInput) {
          selectedColorInput.value = btn.getAttribute('data-color');
        }
      });
    });

    // Load from localStorage or defaults
    var storedNotes = null;
    try {
      var raw = localStorage.getItem('kiara_scrapbook_guestbook_v4');
      if (raw) storedNotes = JSON.parse(raw);
    } catch (e) {
      storedNotes = null;
    }

    if (!storedNotes || !Array.isArray(storedNotes) || storedNotes.length === 0) {
      storedNotes = DEFAULT_NOTES;
    }

    renderGuestbookNotes(storedNotes, grid);

    // Form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var authorInput = document.getElementById('note-author');
      var messageInput = document.getElementById('note-message');

      var author = authorInput ? authorInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';
      var color = (selectedColorInput && selectedColorInput.value) ? selectedColorInput.value : '#e2cfb3';

      if (!author || !message) return;

      var randomRot = (Math.random() * 5 - 2.5).toFixed(1);

      var newNote = {
        author: author,
        text: message,
        color: color,
        date: 'Just now',
        rot: parseFloat(randomRot)
      };

      storedNotes.unshift(newNote);

      try {
        localStorage.setItem('kiara_scrapbook_guestbook_v4', JSON.stringify(storedNotes));
      } catch (err) {
        // storage fallback
      }

      renderGuestbookNotes(storedNotes, grid);
      triggerScrapbookConfetti(45);

      if (messageInput) messageInput.value = '';
    });
  }

  function renderGuestbookNotes(notes, container) {
    container.innerHTML = '';

    notes.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'pinned-note';
      card.style.backgroundColor = item.color;
      card.style.setProperty('--rot', item.rot + 'deg');

      var pin = document.createElement('div');
      pin.className = 'wooden-pushpin';
      card.appendChild(pin);

      var title = document.createElement('h4');
      title.className = 'pinned-note-author';
      title.textContent = item.author;
      card.appendChild(title);

      var body = document.createElement('p');
      body.className = 'pinned-note-text';
      body.textContent = item.text;
      card.appendChild(body);

      var footer = document.createElement('div');
      footer.className = 'pinned-note-date';
      footer.textContent = item.date || 'Today';
      card.appendChild(footer);

      container.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Interactive Polaroid Click Pop
  // ---------------------------------------------------------------------------
  function initPolaroids() {
    var polaroids = document.querySelectorAll('.polaroid-card');
    polaroids.forEach(function (card) {
      card.addEventListener('click', function () {
        triggerScrapbookConfetti(25);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------
  function init() {
    initBirthdayModal();
    initGuestbook();
    initPolaroids();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
