/**
 * DON'T MEASURE YOUR WORTH IN LIKES
 * Interactive Mobile Web Application Logic
 * Neo-Brutalism meets Cozy Sketchbook Aesthetic
 * Includes Simple User Authentication (Name, DOB, Password) & Full Per-User Data Preservation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. AUDIO SYSTEM (Synthesized via Web Audio API - Zero External Asset Deps)
     ========================================================================== */
  class SoundController {
    constructor() {
      this.enabled = localStorage.getItem('worth_sound_enabled') !== 'false';
      this.ctx = null;
      this.initContext();
    }

    initContext() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    }

    ensureContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('worth_sound_enabled', this.enabled);
      return this.enabled;
    }

    playPop() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (err) {}
    }

    playCheck() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.26);
      } catch (err) {}
    }

    playFanfare() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + (idx * 0.09);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.36);
        });
      } catch (err) {}
    }
  }

  const sound = new SoundController();

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = soundToggleBtn.querySelector('.btn-text');

  function updateSoundUI() {
    if (sound.enabled) {
      soundIcon.textContent = '🔊';
      soundText.textContent = 'Audio On';
      soundToggleBtn.classList.remove('active');
    } else {
      soundIcon.textContent = '🔇';
      soundText.textContent = 'Muted';
      soundToggleBtn.classList.add('active');
    }
  }
  updateSoundUI();

  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = sound.toggle();
    updateSoundUI();
    if (isEnabled) sound.playPop();
  });


  /* ==========================================================================
     2. GRAYSCALE MODE SIMULATOR (Dopamine Blocker Demo)
     ========================================================================== */
  const grayscaleToggleBtn = document.getElementById('grayscale-toggle');
  const tipGrayscaleTrigger = document.getElementById('tip-grayscale-trigger');

  function toggleGrayscale() {
    document.body.classList.toggle('grayscale-mode');
    const isGray = document.body.classList.contains('grayscale-mode');
    sound.playPop();
    if (isGray) {
      grayscaleToggleBtn.classList.add('active');
      grayscaleToggleBtn.querySelector('.btn-text').textContent = 'Color Mode';
    } else {
      grayscaleToggleBtn.classList.remove('active');
      grayscaleToggleBtn.querySelector('.btn-text').textContent = 'Try Grayscale';
    }
  }

  if (grayscaleToggleBtn) grayscaleToggleBtn.addEventListener('click', toggleGrayscale);
  if (tipGrayscaleTrigger) tipGrayscaleTrigger.addEventListener('click', toggleGrayscale);


  /* ==========================================================================
     3. USER AUTHENTICATION & MULTI-USER DATA PRESERVATION SYSTEM
     ========================================================================== */
  class AccountManager {
    constructor() {
      this.activeUserKey = localStorage.getItem('worth_active_user_key') || null;
      this.users = this.getAllUsers();
    }

    getAllUsers() {
      try {
        return JSON.parse(localStorage.getItem('worth_users_db') || '{}');
      } catch (e) {
        return {};
      }
    }

    saveAllUsers() {
      localStorage.setItem('worth_users_db', JSON.stringify(this.users));
    }

    getUserKey(name, dob) {
      const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return `${cleanName}_${dob.trim()}`;
    }

    getActiveUser() {
      if (!this.activeUserKey) return null;
      return this.users[this.activeUserKey] || null;
    }

    login(name, dob, password, guestSnapshot = null) {
      const key = this.getUserKey(name, dob);
      const existing = this.users[key];

      if (existing) {
        if (existing.password !== password) {
          return { success: false, message: 'Password does not match the saved profile for this Name & DOB.' };
        }
        this.activeUserKey = key;
        localStorage.setItem('worth_active_user_key', key);
        return { success: true, user: existing, isNew: false };
      } else {
        // Create new account profile
        const newUser = {
          name: name.trim(),
          dob: dob.trim(),
          password: password,
          createdAt: new Date().toISOString(),
          data: {
            quizCompleted: guestSnapshot ? (guestSnapshot.quizCompleted || false) : false,
            quizScore: guestSnapshot ? (guestSnapshot.quizScore || 0) : 0,
            challengeState: guestSnapshot && guestSnapshot.challengeState ? guestSnapshot.challengeState : [false, false, false, false, false, false, false],
            dailyMood: guestSnapshot ? (guestSnapshot.dailyMood || null) : null,
            hasPledged: guestSnapshot ? (guestSnapshot.hasPledged || false) : false,
            pledgeHobby: guestSnapshot ? (guestSnapshot.pledgeHobby || '') : ''
          }
        };
        this.users[key] = newUser;
        this.saveAllUsers();
        this.activeUserKey = key;
        localStorage.setItem('worth_active_user_key', key);
        return { success: true, user: newUser, isNew: true };
      }
    }

    logout() {
      this.activeUserKey = null;
      localStorage.removeItem('worth_active_user_key');
      // Clear guest session so screen is clean for next person
      localStorage.removeItem('worth_guest_challenge_state');
      localStorage.removeItem('worth_guest_daily_mood');
      localStorage.removeItem('worth_guest_quiz_completed');
      localStorage.removeItem('worth_guest_quiz_score');
      localStorage.removeItem('worth_guest_has_pledged');
      localStorage.removeItem('worth_guest_pledge_hobby');
    }

    saveCurrentData(patch) {
      const active = this.getActiveUser();
      if (active) {
        active.data = { ...active.data, ...patch };
        this.saveAllUsers();
      } else {
        // Save to guest session
        if (patch.challengeState !== undefined) {
          localStorage.setItem('worth_guest_challenge_state', JSON.stringify(patch.challengeState));
        }
        if (patch.dailyMood !== undefined) {
          localStorage.setItem('worth_guest_daily_mood', patch.dailyMood);
        }
        if (patch.quizCompleted !== undefined) {
          localStorage.setItem('worth_guest_quiz_completed', String(patch.quizCompleted));
          localStorage.setItem('worth_guest_quiz_score', String(patch.quizScore || 0));
        }
        if (patch.hasPledged !== undefined) {
          localStorage.setItem('worth_guest_has_pledged', String(patch.hasPledged));
          localStorage.setItem('worth_guest_pledge_hobby', patch.pledgeHobby || '');
        }
      }
    }
  }

  const accountManager = new AccountManager();

  // Auth UI Elements
  const authLoggedIn = document.getElementById('auth-logged-in');
  const authLoggedOut = document.getElementById('auth-logged-out');
  const loggedUserName = document.getElementById('logged-user-name');
  const loggedUserDob = document.getElementById('logged-user-dob');
  const btnOpenLogin = document.getElementById('btn-open-login');
  const btnLogout = document.getElementById('btn-logout');
  const modalLogin = document.getElementById('modal-login');
  const authForm = document.getElementById('auth-form');
  const authInputName = document.getElementById('auth-input-name');
  const authInputDob = document.getElementById('auth-input-dob');
  const authInputPassword = document.getElementById('auth-input-password');
  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  const authFeedback = document.getElementById('auth-feedback');

  // Restrict DOB to max today
  if (authInputDob) {
    authInputDob.max = new Date().toISOString().split('T')[0];
  }

  // Banner Elements
  const passBannerIcon = document.getElementById('pass-banner-icon');
  const passBannerTag = document.getElementById('pass-banner-tag');
  const passBannerTitle = document.getElementById('pass-banner-title');
  const passBannerDesc = document.getElementById('pass-banner-desc');
  const passActionRow = document.getElementById('pass-action-row');
  const btnResetProfilePwd = document.getElementById('btn-reset-profile-pwd');

  function updateAuthHeaderUI() {
    const active = accountManager.getActiveUser();
    if (active) {
      authLoggedIn.style.display = 'flex';
      authLoggedOut.style.display = 'none';
      loggedUserName.textContent = active.name;
      if (active.dob) {
        const parts = active.dob.split('-');
        if (parts.length === 3) {
          loggedUserDob.textContent = `(${parts[1]}/${parts[2]}/${parts[0]})`;
        }
      }
      const pledgeNameInput = document.getElementById('pledger-name');
      if (pledgeNameInput && !pledgeNameInput.value) {
        pledgeNameInput.value = active.name;
      }

      // Update Student Pass Card in Home Section
      if (passBannerTitle && passBannerDesc && passActionRow) {
        if (passBannerIcon) passBannerIcon.textContent = '🌟';
        if (passBannerTag) passBannerTag.textContent = 'AUTHENTICATED STUDENT PASS';
        passBannerTitle.textContent = `Welcome, ${active.name}! ✨`;
        passBannerDesc.textContent = 'Your private journal is active. All habits, mood logs, and pledge are auto-saved on this device.';
        passActionRow.innerHTML = `
          <span class="pass-status-pill">💾 Auto-saving active</span>
          <button type="button" id="btn-banner-logout" class="btn btn-sm btn-pink">
            <span>🚪 Log Out</span>
          </button>
        `;
        document.getElementById('btn-banner-logout')?.addEventListener('click', triggerLogout);
      }
    } else {
      authLoggedIn.style.display = 'none';
      authLoggedOut.style.display = 'block';

      // Update Student Pass Card to Guest Prompt
      if (passBannerTitle && passBannerDesc && passActionRow) {
        if (passBannerIcon) passBannerIcon.textContent = '🪪';
        if (passBannerTag) passBannerTag.textContent = 'STUDENT DIGITAL PASS';
        passBannerTitle.textContent = 'Start Your Journal Saved';
        passBannerDesc.textContent = 'Enter Name, DOB & Password to save your 7-day challenge, mood reflection & pledge across visits.';
        passActionRow.innerHTML = `
          <button type="button" id="btn-banner-login" class="btn btn-sm btn-yellow">
            <span>🔑 Log In / Create Pass</span>
          </button>
          <button type="button" id="btn-banner-guest" class="btn btn-sm btn-white">
            <span>Explore as Guest ➔</span>
          </button>
        `;
        document.getElementById('btn-banner-login')?.addEventListener('click', () => {
          authFeedback.style.display = 'none';
          if (btnResetProfilePwd) btnResetProfilePwd.style.display = 'none';
          openModal('modal-login');
          setTimeout(() => authInputName?.focus(), 300);
        });
        document.getElementById('btn-banner-guest')?.addEventListener('click', () => {
          sound.playPop();
          document.getElementById('section-quiz')?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  }

  if (btnOpenLogin) {
    btnOpenLogin.addEventListener('click', () => {
      authFeedback.style.display = 'none';
      if (btnResetProfilePwd) btnResetProfilePwd.style.display = 'none';
      openModal('modal-login');
      setTimeout(() => authInputName.focus(), 300);
    });
  }

  if (btnTogglePwd) {
    btnTogglePwd.addEventListener('click', () => {
      if (authInputPassword.type === 'password') {
        authInputPassword.type = 'text';
        btnTogglePwd.textContent = '🙈';
      } else {
        authInputPassword.type = 'password';
        btnTogglePwd.textContent = '👁️';
      }
    });
  }

  let lastFailedLoginAttempt = null;

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = authInputName.value.trim();
      const dob = authInputDob.value.trim();
      const pwd = authInputPassword.value.trim();

      if (!name || !dob || !pwd) {
        showAuthFeedback('Please enter your Name, Date of Birth, and Password.', 'error');
        return;
      }

      // Snapshot any guest progress on screen to carry into new account
      const guestSnapshot = {
        quizCompleted: document.getElementById('quiz-result-container').style.display !== 'none',
        quizScore: totalScore,
        challengeState: Array.from(document.querySelectorAll('.task-checkbox')).map(cb => cb.checked),
        dailyMood: document.querySelector('.mood-btn.selected')?.getAttribute('data-mood') || null,
        hasPledged: document.getElementById('pledge-signed-success').style.display !== 'none',
        pledgeHobby: document.getElementById('pledger-hobby')?.value.trim() || ''
      };

      const res = accountManager.login(name, dob, pwd, guestSnapshot);
      if (!res.success) {
        sound.playPop();
        lastFailedLoginAttempt = { name, dob };
        showAuthFeedback(res.message, 'error');
        if (btnResetProfilePwd) btnResetProfilePwd.style.display = 'block';
      } else {
        sound.playFanfare();
        if (btnResetProfilePwd) btnResetProfilePwd.style.display = 'none';
        const msg = res.isNew 
          ? `🎉 Welcome, ${res.user.name}! Your private journal has been created.` 
          : `✨ Welcome back, ${res.user.name}! All your saved progress is restored.`;
        showAuthFeedback(msg, 'success');

        setTimeout(() => {
          closeModal('modal-login');
          updateAuthHeaderUI();
          syncUIWithActiveUser();
        }, 900);
      }
    });
  }

  if (btnResetProfilePwd) {
    btnResetProfilePwd.addEventListener('click', () => {
      if (!lastFailedLoginAttempt) return;
      const newPwd = prompt(`Set a new password for ${lastFailedLoginAttempt.name}:`);
      if (newPwd && newPwd.trim().length >= 3) {
        const key = accountManager.getUserKey(lastFailedLoginAttempt.name, lastFailedLoginAttempt.dob);
        if (accountManager.users[key]) {
          accountManager.users[key].password = newPwd.trim();
          accountManager.saveAllUsers();
          authInputPassword.value = newPwd.trim();
          accountManager.login(lastFailedLoginAttempt.name, lastFailedLoginAttempt.dob, newPwd.trim());
          sound.playFanfare();
          showAuthFeedback(`Password updated! Welcome back, ${lastFailedLoginAttempt.name}!`, 'success');
          btnResetProfilePwd.style.display = 'none';
          setTimeout(() => {
            closeModal('modal-login');
            updateAuthHeaderUI();
            syncUIWithActiveUser();
          }, 900);
        }
      }
    });
  }

  function showAuthFeedback(msg, type) {
    authFeedback.textContent = msg;
    authFeedback.className = `auth-feedback-box ${type}`;
    authFeedback.style.display = 'block';
  }

  function triggerLogout() {
    sound.playPop();
    if (confirm('Log out of this journal session? Your progress remains safely preserved on this device.')) {
      accountManager.logout();
      updateAuthHeaderUI();
      syncUIWithActiveUser();
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', triggerLogout);
  }


  /* ==========================================================================
     4. 60-SECOND DIGITAL WELL-BEING QUIZ
     ========================================================================== */
  const quizWrapper = document.getElementById('quiz-questions-wrapper');
  const questionSlides = document.querySelectorAll('.quiz-question-slide');
  const stepDots = document.querySelectorAll('.step-dot');
  const stepIndicator = document.getElementById('quiz-step-indicator');
  const resultContainer = document.getElementById('quiz-result-container');
  const resultBadge = document.getElementById('result-badge');
  const resultEmoji = document.getElementById('result-emoji');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-description');
  const scoreNumber = document.getElementById('score-number');
  const retakeBtn = document.getElementById('btn-retake-quiz');
  const jumpChallengeBtn = document.getElementById('btn-jump-challenge');

  let currentQuestion = 1;
  let totalScore = 0;
  const userAnswers = [];

  const optionButtons = document.querySelectorAll('.quiz-option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      const val = parseInt(btn.getAttribute('data-value'), 10) || 1;
      userAnswers.push(val);
      totalScore += val;

      if (currentQuestion < questionSlides.length) {
        goToQuestion(currentQuestion + 1);
      } else {
        showQuizResults();
      }
    });
  });

  function goToQuestion(nextStep) {
    questionSlides.forEach(slide => slide.classList.remove('active'));
    stepDots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active');
      if (step < nextStep) {
        dot.classList.add('completed');
      } else if (step === nextStep) {
        dot.classList.add('active');
      }
    });

    const nextSlide = document.querySelector(`.quiz-question-slide[data-index="${nextStep}"]`);
    if (nextSlide) {
      nextSlide.classList.add('active');
    }

    currentQuestion = nextStep;
    stepIndicator.textContent = `Question ${currentQuestion} of 4`;
  }

  function showQuizResults() {
    quizWrapper.style.display = 'none';
    resultContainer.style.display = 'block';
    stepIndicator.textContent = 'Checkup Complete ✨';
    scoreNumber.textContent = `${totalScore} / 12`;

    if (totalScore <= 6) {
      resultBadge.textContent = '🌿 REAL-LIFE CHAMPION';
      resultBadge.style.backgroundColor = 'var(--mint-green)';
      resultEmoji.textContent = '🏆';
      resultTitle.textContent = 'You have Healthy Digital Boundaries!';
      resultDesc.textContent = "Incredible work! You treat your smartphone as an occasional tool rather than a validation metric. You live in the moment with friends, savor real life unfiltered, and don't let algorithms tell you what you're worth.";
    } else if (totalScore <= 9) {
      resultBadge.textContent = '⚖️ MINDFUL SCROLLER';
      resultBadge.style.backgroundColor = 'var(--highlighter-yellow)';
      resultEmoji.textContent = '📱';
      resultTitle.textContent = 'You are Balancing the Noise, but Watch Out!';
      resultDesc.textContent = "You have solid awareness, but social media comparisons and habitual checking still sneak into your day. Taking a deliberate phone-free meal and unfollowing high-stress accounts will give you an instant mental recharge.";
    } else {
      resultBadge.textContent = '❤️‍🩹 THE COMPARISON TRAP';
      resultBadge.style.backgroundColor = 'var(--bubblegum-pink)';
      resultBadge.style.color = '#FFFFFF';
      resultEmoji.textContent = '🫂';
      resultTitle.textContent = "You're Feeling Burned Out by the Algorithm";
      resultDesc.textContent = "You are not alone—nearly 70% of Gen Z students report feeling anxious or exhausted after scrolling feeds of curated highlight reels. Your worth is NOT your like count. It's time for a gentle 7-day reset.";
    }

    sound.playFanfare();
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    accountManager.saveCurrentData({
      quizCompleted: true,
      quizScore: totalScore
    });
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      sound.playPop();
      currentQuestion = 1;
      totalScore = 0;
      userAnswers.length = 0;
      stepDots.forEach(dot => {
        dot.classList.remove('completed', 'active');
        if (dot.getAttribute('data-step') === '1') dot.classList.add('active');
      });
      resultContainer.style.display = 'none';
      quizWrapper.style.display = 'block';
      goToQuestion(1);
    });
  }

  if (jumpChallengeBtn) {
    jumpChallengeBtn.addEventListener('click', () => {
      sound.playPop();
      const target = document.getElementById('section-challenge');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  /* ==========================================================================
     5. 7-DAY SOCIAL MEDIA RESET CHALLENGE (with persistence per user)
     ========================================================================== */
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');
  const completedCountEl = document.getElementById('completed-count');
  const completedPctEl = document.getElementById('completed-pct');
  const progressFillEl = document.getElementById('challenge-progress-fill');
  const progressCheerEl = document.getElementById('progress-cheer');
  const resetChecklistBtn = document.getElementById('btn-reset-checklist');

  const cheers = [
    "Pick your first habit below to kick off your reset!",
    "Great first step! Small shifts build massive peace.",
    "2 down! You're making real space for yourself.",
    "Almost halfway! Real life is already feeling brighter.",
    "More than half done! Look at that focus.",
    "5 habits checked! You are reclaiming your daily presence.",
    "Just 1 habit left! You're an inspiration.",
    "🎉 All 7 Habits Done! You are 100% in charge of your life!"
  ];

  function loadChecklistState() {
    try {
      const active = accountManager.getActiveUser();
      const saved = active && active.data && active.data.challengeState
        ? active.data.challengeState
        : JSON.parse(localStorage.getItem('worth_guest_challenge_state') || '[false,false,false,false,false,false,false]');

      taskCheckboxes.forEach((cb, idx) => {
        const isChecked = !!saved[idx];
        cb.checked = isChecked;
        const parentCard = cb.closest('.check-item-card');
        if (parentCard) {
          if (isChecked) parentCard.classList.add('completed');
          else parentCard.classList.remove('completed');
        }
      });
      updateChecklistProgress(false);
    } catch (e) {
      updateChecklistProgress(false);
    }
  }

  function saveChecklistState() {
    const states = Array.from(taskCheckboxes).map(cb => cb.checked);
    accountManager.saveCurrentData({ challengeState: states });
  }

  function updateChecklistProgress(triggerCelebrate = true) {
    const total = taskCheckboxes.length;
    let completed = 0;
    taskCheckboxes.forEach(cb => {
      if (cb.checked) completed++;
    });

    const pct = Math.round((completed / total) * 100);
    completedCountEl.textContent = completed;
    completedPctEl.textContent = `${pct}%`;
    progressFillEl.style.width = `${pct}%`;
    progressCheerEl.textContent = cheers[completed] || cheers[0];

    if (completed === total && triggerCelebrate) {
      sound.playFanfare();
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF6B9D', '#FFE66D', '#A8E6CF', '#A2D2FF', '#DCD3FF']
        });
      }
    }
  }

  taskCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const parentCard = cb.closest('.check-item-card');
      if (cb.checked) {
        parentCard.classList.add('completed');
        sound.playCheck();
      } else {
        parentCard.classList.remove('completed');
        sound.playPop();
      }
      saveChecklistState();
      updateChecklistProgress(true);
    });
  });

  if (resetChecklistBtn) {
    resetChecklistBtn.addEventListener('click', () => {
      if (confirm('Start fresh for a new week? Reset your 7 habits?')) {
        taskCheckboxes.forEach(cb => {
          cb.checked = false;
          const parentCard = cb.closest('.check-item-card');
          if (parentCard) parentCard.classList.remove('completed');
        });
        saveChecklistState();
        updateChecklistProgress(false);
        sound.playPop();
      }
    });
  }


  /* ==========================================================================
     6. DAILY MOOD LOG / REFLECTION (with persistence per user)
     ========================================================================== */
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodFeedback = document.getElementById('mood-feedback');

  const moodResponses = {
    '1': "Sending kindness your way. Unplugging when stressed takes courage—rest your eyes and take 3 deep breaths.",
    '2': "It's normal to feel fidgety when you put the phone down. Try a warm drink or short walk outside.",
    '3': "Neutral is healthy! You're creating calm, quiet headspace without endless notification buzzes.",
    '4': "Wonderful! Feeling grounded is the real superpower in a hyper-connected world.",
    '5': "✨ High vibration! You're fully present in your real life—cherish this feeling!"
  };

  function loadSavedMood() {
    const active = accountManager.getActiveUser();
    const savedMood = active && active.data && active.data.dailyMood
      ? active.data.dailyMood
      : localStorage.getItem('worth_guest_daily_mood');

    moodButtons.forEach(btn => btn.classList.remove('selected'));
    if (savedMood) {
      moodButtons.forEach(btn => {
        if (btn.getAttribute('data-mood') === String(savedMood)) {
          btn.classList.add('selected');
        }
      });
      if (moodResponses[savedMood]) {
        moodFeedback.textContent = moodResponses[savedMood];
        moodFeedback.style.display = 'block';
      }
    } else {
      moodFeedback.style.display = 'none';
    }
  }

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      moodButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const moodVal = btn.getAttribute('data-mood');
      accountManager.saveCurrentData({ dailyMood: moodVal });
      if (moodResponses[moodVal]) {
        moodFeedback.textContent = moodResponses[moodVal];
        moodFeedback.style.display = 'block';
      }
    });
  });


  /* ==========================================================================
     7. THE LIVE "DIGITAL PLEDGE" WALL (with persistence per user)
     ========================================================================== */
  const pledgeForm = document.getElementById('pledge-form');
  const pledgerNameInput = document.getElementById('pledger-name');
  const pledgerHobbyInput = document.getElementById('pledger-hobby');
  const pledgeCounterNumber = document.getElementById('pledge-counter-number');
  const pledgeSuccessBox = document.getElementById('pledge-signed-success');
  const signedUserTitle = document.getElementById('signed-user-title');
  const signedUserQuote = document.getElementById('signed-user-quote');
  const signedDate = document.getElementById('signed-date');
  const userPinnedPledge = document.getElementById('user-pinned-pledge');
  const userPinnedText = document.getElementById('user-pinned-text');
  const btnSharePledge = document.getElementById('btn-share-pledge');
  const btnSaveBadge = document.getElementById('btn-save-badge');

  const BASE_PLEDGE_COUNT = 4832;

  function loadPledgeState() {
    const active = accountManager.getActiveUser();
    const hasPledged = active 
      ? (active.data && active.data.hasPledged) 
      : (localStorage.getItem('worth_guest_has_pledged') === 'true');
    const savedName = active ? active.name : (localStorage.getItem('worth_guest_pledge_name') || '');
    const savedHobby = active 
      ? (active.data && active.data.pledgeHobby) 
      : (localStorage.getItem('worth_guest_pledge_hobby') || '');
    const pledgeCount = parseInt(localStorage.getItem('worth_pledge_count') || BASE_PLEDGE_COUNT, 10);

    pledgeCounterNumber.textContent = pledgeCount.toLocaleString();

    if (hasPledged && savedName) {
      pledgeForm.style.display = 'none';
      pledgeSuccessBox.style.display = 'block';
      signedUserTitle.textContent = `${savedName}'s Digital Freedom Badge`;
      signedUserQuote.textContent = savedHobby ? `Favorite offline moment: "${savedHobby}"` : `"I choose real conversations over likes!"`;
      signedDate.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      userPinnedPledge.style.display = 'flex';
      userPinnedText.innerHTML = `<strong>${savedName}</strong>: ${savedHobby || 'Pledged to live more and compare less!'}`;
    } else {
      pledgeForm.style.display = 'flex';
      pledgeSuccessBox.style.display = 'none';
      userPinnedPledge.style.display = 'none';
      if (active && pledgerNameInput) {
        pledgerNameInput.value = active.name;
      } else if (pledgerNameInput) {
        pledgerNameInput.value = '';
      }
      if (pledgerHobbyInput) pledgerHobbyInput.value = '';
    }
  }

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = pledgerNameInput.value.trim();
      const hobby = pledgerHobbyInput.value.trim();
      if (!name) return;

      sound.playFanfare();

      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B9D', '#FFE66D', '#A8E6CF']
        });
      }

      const currentCount = parseInt(localStorage.getItem('worth_pledge_count') || BASE_PLEDGE_COUNT, 10) + 1;
      localStorage.setItem('worth_pledge_count', currentCount);
      pledgeCounterNumber.textContent = currentCount.toLocaleString();

      accountManager.saveCurrentData({
        hasPledged: true,
        pledgeHobby: hobby
      });

      if (!accountManager.getActiveUser()) {
        localStorage.setItem('worth_guest_has_pledged', 'true');
        localStorage.setItem('worth_guest_pledge_name', name);
        localStorage.setItem('worth_guest_pledge_hobby', hobby);
      }

      pledgeForm.style.display = 'none';
      pledgeSuccessBox.style.display = 'block';
      signedUserTitle.textContent = `${name}'s Digital Freedom Badge`;
      signedUserQuote.textContent = hobby ? `Favorite offline moment: "${hobby}"` : `"I choose real conversations over likes!"`;
      signedDate.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      userPinnedPledge.style.display = 'flex';
      userPinnedText.innerHTML = `<strong>${name}</strong>: ${hobby || 'Pledged to live more and compare less!'}`;
    });
  }

  if (btnSharePledge) {
    btnSharePledge.addEventListener('click', () => {
      sound.playPop();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        btnSharePledge.textContent = '✅ Link Copied!';
        setTimeout(() => {
          btnSharePledge.textContent = '📋 Copy Pledge Link';
        }, 2200);
      }
    });
  }

  if (btnSaveBadge) {
    btnSaveBadge.addEventListener('click', () => {
      sound.playPop();
      alert("✨ You've signed the pledge! Screenshot this badge or share the link with campus friends to inspire them.");
    });
  }


  /* ==========================================================================
     8. SYNC ALL UI MODULES WITH ACTIVE USER DATA
     ========================================================================== */
  function syncUIWithActiveUser() {
    loadChecklistState();
    loadSavedMood();
    loadPledgeState();

    const active = accountManager.getActiveUser();
    const quizDone = active 
      ? (active.data && active.data.quizCompleted) 
      : (localStorage.getItem('worth_guest_quiz_completed') === 'true');

    if (quizDone) {
      totalScore = active 
        ? (active.data.quizScore || 8) 
        : parseInt(localStorage.getItem('worth_guest_quiz_score') || '8', 10);

      quizWrapper.style.display = 'none';
      resultContainer.style.display = 'block';
      stepIndicator.textContent = 'Checkup Complete ✨';
      scoreNumber.textContent = `${totalScore} / 12`;
      if (totalScore <= 6) {
        resultBadge.textContent = '🌿 REAL-LIFE CHAMPION';
        resultBadge.style.backgroundColor = 'var(--mint-green)';
        resultEmoji.textContent = '🏆';
        resultTitle.textContent = 'You have Healthy Digital Boundaries!';
      } else if (totalScore <= 9) {
        resultBadge.textContent = '⚖️ MINDFUL SCROLLER';
        resultBadge.style.backgroundColor = 'var(--highlighter-yellow)';
        resultEmoji.textContent = '📱';
        resultTitle.textContent = 'You are Balancing the Noise, but Watch Out!';
      } else {
        resultBadge.textContent = '❤️‍🩹 THE COMPARISON TRAP';
        resultBadge.style.backgroundColor = 'var(--bubblegum-pink)';
        resultBadge.style.color = '#FFFFFF';
        resultEmoji.textContent = '🫂';
        resultTitle.textContent = "You're Feeling Burned Out by the Algorithm";
      }
    } else {
      resultContainer.style.display = 'none';
      quizWrapper.style.display = 'block';
      goToQuestion(1);
    }
  }

  // Initial Sync
  updateAuthHeaderUI();
  syncUIWithActiveUser();


  /* ==========================================================================
     9. BENTO BOX MODALS & INTERACTIVE TOOLS
     ========================================================================== */
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const closeButtons = document.querySelectorAll('[data-close]');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      sound.playPop();
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      sound.playPop();
      document.body.style.overflow = '';
      if (modalId === 'modal-mindfulness') {
        stopBreathingPacer();
      }
    }
  }

  document.getElementById('bento-tips')?.addEventListener('click', () => openModal('modal-tips'));
  document.getElementById('bento-tracker')?.addEventListener('click', () => openModal('modal-tracker'));
  document.getElementById('bento-mindfulness')?.addEventListener('click', () => {
    openModal('modal-mindfulness');
    startBreathingPacer();
  });
  document.getElementById('bento-resources')?.addEventListener('click', () => openModal('modal-resources'));

  const openPrintableModal = () => openModal('modal-printable');
  document.getElementById('btn-download-tracker')?.addEventListener('click', openPrintableModal);
  document.getElementById('btn-print-from-modal')?.addEventListener('click', () => {
    closeModal('modal-tracker');
    openModal('modal-printable');
  });

  document.getElementById('btn-trigger-print')?.addEventListener('click', () => {
    window.print();
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  // Delegated Global Modal Open Handler (Ensures all buttons with data-open open 100% reliably)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open]');
    if (trigger) {
      const modalId = trigger.getAttribute('data-open');
      if (modalId) {
        e.preventDefault();
        sound.playPop();
        if (modalId === 'modal-login') {
          if (authFeedback) authFeedback.style.display = 'none';
          if (btnResetProfilePwd) btnResetProfilePwd.style.display = 'none';
        }
        openModal(modalId);
        if (modalId === 'modal-login') {
          setTimeout(() => authInputName?.focus(), 300);
        }
      }
    }
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal.id);
        }
      });
    }
  });


  /* ==========================================================================
     10. TOOL: SCREEN TIME REALITY CALCULATOR
     ========================================================================== */
  const screenSlider = document.getElementById('screentime-slider');
  const sliderHoursVal = document.getElementById('slider-hours-val');
  const calcDaysYear = document.getElementById('calc-days-year');
  const calcDecadeYears = document.getElementById('calc-decade-years');
  const booksCount = document.getElementById('books-count');
  const hoursSkills = document.getElementById('hours-skills');
  const conversationsCount = document.getElementById('conversations-count');

  function calculateScreenImpact(hours) {
    sliderHoursVal.textContent = hours.toFixed(1);

    const daysPerYear = (hours * 365) / 24;
    calcDaysYear.textContent = `${daysPerYear.toFixed(1)} Days`;

    const yearsInDecade = (daysPerYear * 10) / 365;
    calcDecadeYears.textContent = `${yearsInDecade.toFixed(1)} Full Years`;

    const annualTotalHours = hours * 365;
    const books = Math.floor(annualTotalHours / 18);
    const chats = Math.floor(annualTotalHours / 3);

    booksCount.textContent = books;
    hoursSkills.textContent = Math.round(annualTotalHours).toLocaleString();
    conversationsCount.textContent = chats;
  }

  if (screenSlider) {
    screenSlider.addEventListener('input', (e) => {
      calculateScreenImpact(parseFloat(e.target.value));
    });
    calculateScreenImpact(parseFloat(screenSlider.value));
  }


  /* ==========================================================================
     11. TOOL: BOX BREATHING PACER & MINDFULNESS TABS
     ========================================================================== */
  const tabBreathing = document.getElementById('tab-btn-breathing');
  const tabGrounding = document.getElementById('tab-btn-grounding');
  const toolBreathingPanel = document.getElementById('tool-box-breathing');
  const toolGroundingPanel = document.getElementById('tool-grounding');

  const breathingCircle = document.getElementById('breathing-circle');
  const breathActionText = document.getElementById('breath-action-text');
  const breathTimerCount = document.getElementById('breath-timer-count');
  const btnToggleBreathing = document.getElementById('btn-toggle-breathing');
  const breathBtnLabel = document.getElementById('breath-btn-label');

  if (tabBreathing && tabGrounding) {
    tabBreathing.addEventListener('click', () => {
      sound.playPop();
      tabBreathing.classList.add('active');
      tabGrounding.classList.remove('active');
      toolBreathingPanel.style.display = 'block';
      toolGroundingPanel.style.display = 'none';
      startBreathingPacer();
    });

    tabGrounding.addEventListener('click', () => {
      sound.playPop();
      tabGrounding.classList.add('active');
      tabBreathing.classList.remove('active');
      toolBreathingPanel.style.display = 'none';
      toolGroundingPanel.style.display = 'block';
      stopBreathingPacer();
    });
  }

  let breathingInterval = null;
  let breathPhaseIndex = 0;
  let phaseSecondsRemaining = 4;
  let isBreathingActive = false;

  const phases = [
    { text: 'Inhale (4s)', class: 'expand' },
    { text: 'Hold Breath (4s)', class: 'expand' },
    { text: 'Slowly Exhale (4s)', class: 'contract' },
    { text: 'Hold Empty (4s)', class: 'contract' }
  ];

  function startBreathingPacer() {
    if (isBreathingActive) return;
    isBreathingActive = true;
    breathBtnLabel.textContent = '⏸️ Pause Exercise';

    updateBreathingPhase();
    breathingInterval = setInterval(() => {
      phaseSecondsRemaining--;
      if (phaseSecondsRemaining <= 0) {
        breathPhaseIndex = (breathPhaseIndex + 1) % phases.length;
        phaseSecondsRemaining = 4;
        updateBreathingPhase();
      } else {
        breathTimerCount.textContent = phaseSecondsRemaining;
      }
    }, 1000);
  }

  function updateBreathingPhase() {
    const phase = phases[breathPhaseIndex];
    breathActionText.textContent = phase.text;
    breathTimerCount.textContent = phaseSecondsRemaining;

    breathingCircle.classList.remove('expand', 'contract');
    breathingCircle.classList.add(phase.class);
  }

  function stopBreathingPacer() {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    isBreathingActive = false;
    breathBtnLabel.textContent = '▶️ Resume Exercise';
  }

  if (btnToggleBreathing) {
    btnToggleBreathing.addEventListener('click', () => {
      sound.playPop();
      if (isBreathingActive) {
        stopBreathingPacer();
      } else {
        startBreathingPacer();
      }
    });
  }


  /* ==========================================================================
     12. STICKY BOTTOM NAVIGATION & SCROLL TRACKING
     ========================================================================== */
  const navItems = document.querySelectorAll('.bottom-nav-bar .nav-item');
  const sections = [
    document.getElementById('section-home'),
    document.getElementById('section-challenge'),
    document.getElementById('section-pledge'),
    document.getElementById('section-kit')
  ];

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      sound.playPop();
      const targetId = item.getAttribute('data-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          if (item.getAttribute('data-target') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    if (sec) observer.observe(sec);
  });


  /* ==========================================================================
     13. SMOOTH ANCHOR SCROLLING WITH AUDIO FEEDBACK
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        sound.playPop();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     14. FOOTER: RESET ALL LOCAL DATA (For Testing / Fresh Starts)
     ========================================================================== */
  const restartAllBtn = document.getElementById('footer-restart-all');
  if (restartAllBtn) {
    restartAllBtn.addEventListener('click', () => {
      if (confirm('Clear all locally saved progress and accounts on this device?')) {
        localStorage.clear();
        sound.playPop();
        window.location.reload();
      }
    });
  }

});
