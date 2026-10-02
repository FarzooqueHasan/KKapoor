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
      author: 'anAnt',
      text: 'YOU ARE A VERY SHORT BUT COOL PERSON SO YOUR COOLNESS DENSITY IS HIGH CAUSE YOU ARE SMALL',
      color: '#efe3d3',
      date: 'Today',
      rot: 2.5
    },
    {
      author: 'manya',
      text: "HAPPPIESTTTTTT SWEET 16 KIARAAAAAAA !!! 🤩🤩this is one of the most accidental and unxpected friendships i have(creds to aeross and nss ka unfinished kaam), but you’ve turned into one of my closest friends and favourite people:))).Have an amaaazzzzzzinggg birthdayyyy and an even amazingerrr year(coz you deserve it) 💗💗💗",
      color: '#e2cfb3',
      date: 'Today',
      rot: -1.5
    },
    {
      author: 'TheBlessedOne',
      text: 'Puppies are very adorable and cute, but they are nothing compared to the harmony of ur flute',
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
  // 5. Interactive Vintage Pencil & Scrapbook Doodle Engine
  // ---------------------------------------------------------------------------
  function initPencilDoodleSystem() {
    var pencil = document.getElementById('scrapbook-pencil');
    var pencilTag = document.getElementById('pencil-tag');
    var canvas = document.getElementById('doodle-canvas');
    var toolbar = document.getElementById('doodle-toolbar');
    var mobileBtn = document.getElementById('mobile-doodle-fab');
    var doneBtn = document.getElementById('doodle-done-btn');
    var clearBtn = document.getElementById('doodle-clear-btn');
    var eraserBtn = document.getElementById('doodle-eraser-btn');
    var colorBtns = document.querySelectorAll('.doodle-color-btn');
    var mainSheet = document.querySelector('.main-scrapbook-sheet');

    if (!pencil || !canvas || !toolbar || !mainSheet) return;

    var ctx = canvas.getContext('2d');
    var isDoodleActive = false;
    var isDrawing = false;
    var isEraser = false;
    var currentColor = '#2D2824';
    var currentSize = 2.5;
    var points = [];

    // High DPI Canvas Resizing
    function resizeDoodleCanvas() {
      if (!canvas || !mainSheet) return;
      var rect = mainSheet.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;

      var tempCanvas = document.createElement('canvas');
      var hasContent = canvas.width > 0 && canvas.height > 0;
      if (hasContent) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        var tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
      }

      var displayWidth = Math.round(rect.width);
      var displayHeight = Math.round(mainSheet.scrollHeight || rect.height);

      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';

      ctx.scale(dpr, dpr);

      if (hasContent) {
        ctx.drawImage(tempCanvas, 0, 0, displayWidth, displayHeight);
      } else {
        restoreSavedDoodles();
      }
    }

    function restoreSavedDoodles() {
      try {
        var savedImg = localStorage.getItem('kiara_scrapbook_doodle_img');
        if (savedImg) {
          var img = new Image();
          img.onload = function () {
            var rect = mainSheet.getBoundingClientRect();
            ctx.drawImage(img, 0, 0, rect.width, mainSheet.scrollHeight || rect.height);
          };
          img.src = savedImg;
        }
      } catch (err) {
        // localStorage fallback
      }
    }

    function saveDoodles() {
      try {
        var data = canvas.toDataURL('image/png');
        localStorage.setItem('kiara_scrapbook_doodle_img', data);
      } catch (err) {
        // localStorage fallback
      }
    }

    // Toggle Doodle Mode
    function setDoodleMode(active) {
      isDoodleActive = active;
      if (isDoodleActive) {
        resizeDoodleCanvas();
        pencil.classList.add('is-drawing');
        if (pencilTag) {
          pencilTag.innerHTML = '<span>✍️</span> sketching now! (click Done)';
        }
        canvas.classList.add('is-active');
        toolbar.classList.add('is-visible');
        spawnPencilSparks(pencil);
      } else {
        pencil.classList.remove('is-drawing');
        if (pencilTag) {
          pencilTag.innerHTML = '<span>✏️</span> doodle with me!';
        }
        canvas.classList.remove('is-active');
        toolbar.classList.remove('is-visible');
        isDrawing = false;
        points = [];
        saveDoodles();
      }
    }

    // Pencil Click Events
    pencil.addEventListener('click', function (e) {
      e.stopPropagation();
      setDoodleMode(!isDoodleActive);
    });

    pencil.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setDoodleMode(!isDoodleActive);
      }
    });

    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        setDoodleMode(!isDoodleActive);
      });
    }

    if (doneBtn) {
      doneBtn.addEventListener('click', function () {
        setDoodleMode(false);
      });
    }

    // Keyboard shortcut Escape to put pencil down
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isDoodleActive) {
        setDoodleMode(false);
      }
    });

    // Tool: Color selector
    colorBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        colorBtns.forEach(function (b) { b.classList.remove('active'); });
        if (eraserBtn) eraserBtn.classList.remove('active');
        btn.classList.add('active');
        currentColor = btn.getAttribute('data-color') || '#2D2824';
        currentSize = parseFloat(btn.getAttribute('data-size')) || 2.5;
        isEraser = false;
      });
    });

    // Tool: Eraser
    if (eraserBtn) {
      eraserBtn.addEventListener('click', function () {
        isEraser = !isEraser;
        if (isEraser) {
          eraserBtn.classList.add('active');
          colorBtns.forEach(function (b) { b.classList.remove('active'); });
        } else {
          eraserBtn.classList.remove('active');
          if (colorBtns[0]) colorBtns[0].classList.add('active');
          currentColor = '#2D2824';
          currentSize = 2.5;
        }
      });
    }

    // Tool: Clear all doodles
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var rect = mainSheet.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, mainSheet.scrollHeight || rect.height);
        try {
          localStorage.removeItem('kiara_scrapbook_doodle_img');
        } catch (err) { }
        triggerScrapbookConfetti(15);
      });
    }

    // Coordinates helper
    function getCanvasCoordinates(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX = e.clientX;
      var clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    // Mouse / Touch drawing events on canvas
    canvas.addEventListener('mousedown', function (e) {
      if (!isDoodleActive) return;
      isDrawing = true;
      var pos = getCanvasCoordinates(e);
      points = [pos];
      drawDot(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', function (e) {
      if (!isDoodleActive || !isDrawing) return;
      var pos = getCanvasCoordinates(e);
      points.push(pos);
      drawSmoothLine();
    });

    window.addEventListener('mouseup', function () {
      if (isDrawing) {
        isDrawing = false;
        points = [];
        saveDoodles();
      }
    });

    // Touch events for mobile/tablet
    canvas.addEventListener('touchstart', function (e) {
      if (!isDoodleActive) return;
      e.preventDefault();
      isDrawing = true;
      var pos = getCanvasCoordinates(e);
      points = [pos];
      drawDot(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', function (e) {
      if (!isDoodleActive || !isDrawing) return;
      e.preventDefault();
      var pos = getCanvasCoordinates(e);
      points.push(pos);
      drawSmoothLine();
    }, { passive: false });

    canvas.addEventListener('touchend', function () {
      if (isDrawing) {
        isDrawing = false;
        points = [];
        saveDoodles();
      }
    });

    function drawDot(x, y) {
      ctx.save();
      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawSmoothLine() {
      if (points.length < 2) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 26;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = currentSize;
        if (currentColor === '#D4A034') {
          ctx.strokeStyle = 'rgba(212, 160, 52, 0.45)';
          ctx.lineWidth = 8;
        } else {
          ctx.strokeStyle = currentColor;
        }
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length - 1; i++) {
        var xc = (points[i].x + points[i + 1].x) / 2;
        var yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      var lastPoint = points[points.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.stroke();
      ctx.restore();
    }

    // Sparkle Particle Animation from Pencil Tip
    function spawnPencilSparks(targetElement) {
      var rect = targetElement.getBoundingClientRect();
      var tipX = rect.left + rect.width / 2;
      var tipY = rect.bottom - 10;

      for (var i = 0; i < 14; i++) {
        var spark = document.createElement('div');
        spark.style.position = 'fixed';
        spark.style.left = tipX + 'px';
        spark.style.top = tipY + 'px';
        spark.style.width = '6px';
        spark.style.height = '6px';
        spark.style.borderRadius = '50%';
        spark.style.backgroundColor = ['#E69A28', '#2B2B2B', '#E5C399', '#D4A034'][Math.floor(Math.random() * 4)];
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '9999';
        spark.style.boxShadow = '0 0 6px rgba(230, 154, 40, 0.6)';
        document.body.appendChild(spark);

        var angle = Math.random() * Math.PI * 2;
        var distance = 25 + Math.random() * 45;
        var targetX = Math.cos(angle) * distance;
        var targetY = Math.sin(angle) * distance;

        spark.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: 'translate(' + targetX + 'px, ' + targetY + 'px) scale(0)', opacity: 0 }
        ], {
          duration: 600 + Math.random() * 300,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        }).onfinish = function () {
          if (spark.parentNode) spark.parentNode.removeChild(spark);
        };
      }
    }

    // Window Resize Handler
    window.addEventListener('resize', function () {
      if (isDoodleActive) {
        resizeDoodleCanvas();
      }
    });

    // Initial setup
    resizeDoodleCanvas();
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------
  function init() {
    initBirthdayModal();
    initGuestbook();
    initPolaroids();
    initPencilDoodleSystem();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
