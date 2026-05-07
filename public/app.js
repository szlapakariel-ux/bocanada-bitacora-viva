// ── STATE ──────────────────────────────────────────────────────────────────
const state = {
  user: { name: '', role: 'participante' },
  currentNeed: null,
  currentCardIndex: 0,
  cardActions: {},
  facilitatorPass: ''
};

// ── JOURNEYS ───────────────────────────────────────────────────────────────
const JOURNEYS = {
  calma: {
    label: 'Calma',
    emoji: '🌊',
    color: 'linear-gradient(135deg, #7BAFC4, #4E8FA3)',
    subtitle: '5 estaciones · respirás y bajás el volumen',
    cards: [
      {
        title: 'Frená',
        body: 'Solo por este momento, no hay nada urgente que resolver.',
        quote: '"Una pausa en medio del caos." — Pía y Clara',
        actions: ['Lo hice', 'Lo salteo']
      },
      {
        title: 'Respirá',
        body: 'Tres respiraciones largas. Adentro por la nariz, afuera por la boca. Despacio.',
        quote: '"El cuerpo sabe antes que la mente."',
        actions: ['Lo hice', 'Me costó un poco', 'Lo salteo']
      },
      {
        title: 'Aflojá los hombros',
        body: 'Subilos hasta las orejas. Aguantá. Soltá. Hacelo dos veces más.',
        quote: '"Bajá de la mente al cuerpo. No hace falta entenderlo todo." — Pía',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Elegí una frase',
        body: 'Cuál de estas te resuena hoy:',
        options: [
          '"Voy a hacer lo que puedo."',
          '"No todo tiene que ser perfecto."',
          '"Hoy me doy permiso."',
          '"Un paso a la vez."'
        ],
        actions: ['Guardar frase', 'Me sirvió']
      },
      {
        title: 'Registrá una sensación',
        body: '¿Cómo estás ahora, después de la pausa? No tiene que ser una respuesta perfecta.',
        isLast: true,
        actions: ['Más liviana', 'Igual que antes', 'Necesito más', 'Me sirvió mucho']
      }
    ]
  },
  foco: {
    label: 'Foco',
    emoji: '🎯',
    color: 'linear-gradient(135deg, #8B6BAE, #5A3E6B)',
    subtitle: '5 estaciones · una cosa a la vez',
    cards: [
      {
        title: 'Elegí una prioridad',
        body: 'Solo una. La más importante de hoy. No la lista entera, solo esa.',
        quote: '"Elegí una sola cosa. Eso es suficiente."',
        actions: ['Lo hice', 'Lo salteo']
      },
      {
        title: 'Cerrá una distracción',
        body: 'Una app, una pestaña, una conversación mental que no suma. Cerrala por ahora.',
        quote: '"Cerrar algo también es un acto de cuidado."',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Hacé una acción mínima',
        body: 'La cosa más pequeña que podés hacer ahora mismo hacia esa prioridad. Cinco minutos. Solo eso.',
        quote: '"No hace falta hacer todo. Hace falta empezar." — Clara',
        actions: ['Lo hice', 'Hoy no pude', 'Me sirvió']
      },
      {
        title: 'Volvé al cuerpo',
        body: 'Apoyá los pies en el suelo. Sentí el peso. Respirá una vez.',
        quote: '"El foco no es solo mental. El cuerpo ayuda."',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Registrá tu avance',
        body: 'Aunque sea pequeño. ¿Qué hiciste? ¿Cómo te sentís?',
        isLast: true,
        actions: ['Avancé', 'Me costó pero seguí', 'Necesito volver mañana']
      }
    ]
  },
  orden: {
    label: 'Orden',
    emoji: '🌿',
    color: 'linear-gradient(135deg, #8B9E7A, #5E7A55)',
    subtitle: '5 estaciones · de a una cosa',
    cards: [
      {
        title: 'Mirá el caos sin pelearlo',
        body: 'No hay que resolverlo todo ahora. Solo mirarlo. Respirar. Que esté.',
        quote: '"El orden empieza por aceptar el desorden."',
        actions: ['Lo hice', 'Me costó', 'Lo salteo']
      },
      {
        title: 'Elegí una sola cosa',
        body: 'Una tarea, un espacio, un mensaje. Solo uno. El resto espera.',
        quote: '"Elegir una sola cosa es un acto de poder." — Pía',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Ordená un espacio pequeño',
        body: 'El escritorio, una mesa, una silla con ropa. Algo pequeño. No la casa entera.',
        quote: '"Un espacio ordenado cambia cómo se siente la mente."',
        actions: ['Lo hice', 'Me sirvió', 'Hoy no pude']
      },
      {
        title: 'Respirá',
        body: 'Después de ordenar algo, hacé una pausa. El cuerpo procesa el orden también.',
        quote: '"El orden físico y el interno se retroalimentan."',
        actions: ['Lo hice', 'Lo salteo']
      },
      {
        title: 'Registrá cómo quedó',
        body: '¿Cómo te sentís después de ordenar algo? ¿Qué cambió?',
        isLast: true,
        actions: ['Mucho mejor', 'Un poco mejor', 'Igual', 'Me sirvió intentarlo']
      }
    ]
  },
  refugio: {
    label: 'Refugio',
    emoji: '🏠',
    color: 'linear-gradient(135deg, #C08080, #8B5A5A)',
    subtitle: '5 estaciones · encontrar tu lugar',
    cards: [
      {
        title: 'Buscá un lugar amable',
        body: 'No tiene que ser perfecto. Un rincón, un sillón, el baño con la puerta cerrada. Donde puedas estar un rato.',
        quote: '"Todo cuerpo necesita un lugar que lo contenga."',
        actions: ['Lo encontré', 'Lo salteo']
      },
      {
        title: 'Apoyá los pies',
        body: 'Los dos pies en el suelo. Sentí el contacto. Dejá que el piso te sostenga por un momento.',
        quote: '"A veces el refugio no está en un lugar. Está en el cuerpo." — Clara',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Decíte una frase de permiso',
        body: 'Elegí una:',
        options: [
          '"Tengo permiso de descansar."',
          '"No tengo que estar bien todo el tiempo."',
          '"Puedo necesitar."',
          '"Esto también pasa."'
        ],
        actions: ['Guardar frase', 'Me resuena']
      },
      {
        title: 'Guardá silencio breve',
        body: 'Un minuto sin pantalla, sin ruido, sin hacer nada. Solo estar. Podés cerrar los ojos.',
        quote: '"El silencio también es contenido."',
        actions: ['Lo hice', 'Intenté', 'No pude hoy']
      },
      {
        title: 'Registrá qué necesitabas',
        body: '¿Qué necesitabas hoy que esta pausa te dio un poco?',
        isLast: true,
        actions: ['Estar sola', 'Ser vista', 'Aflojar', 'Simplemente parar']
      }
    ]
  },
  energia: {
    label: 'Energía',
    emoji: '⚡',
    color: 'linear-gradient(135deg, #E8873A, #C85F1A)',
    subtitle: '5 estaciones · moverte y prender el fuego',
    cards: [
      {
        title: 'Sacudí el cuerpo',
        body: 'De pie o sentada: sacudí las manos, los hombros, los pies. Como si sacudieras el cansancio.',
        quote: '"El cuerpo tiene energía. A veces solo hay que moverla."',
        actions: ['Lo hice', 'Lo salteo']
      },
      {
        title: 'Poné una canción',
        body: 'La que te mueve. La que te cambia el estado. Un tema. Solo uno.',
        quote: '"La música hace lo que las palabras no pueden."',
        actions: ['Lo hice', 'Me sirvió', 'Lo salteo']
      },
      {
        title: 'Mové hombros y cadera',
        body: 'Sin coreografía, sin perfección. Dos minutos moviéndote como quieras. Es suficiente.',
        quote: '"Bailar es una forma de volver a vos." — Pía',
        actions: ['Lo hice', 'Me sirvió mucho', 'Me costó pero lo intenté']
      },
      {
        title: 'Sonreí aunque sea raro',
        body: 'Aunque no tengas ganas. Aunque te parezca tonto. Sonreír le dice algo al cuerpo.',
        quote: '"El cuerpo no distingue entre la sonrisa real y la actuada. Igual funciona."',
        actions: ['Lo hice', 'Me costó', 'Lo salteo']
      },
      {
        title: 'Registrá qué cambió',
        body: '¿Cómo estás ahora comparado con antes? ¿Qué se movió?',
        isLast: true,
        actions: ['Mucho más liviana', 'Un poco mejor', 'Igual', 'Necesito más']
      }
    ]
  }
};

const NEED_COLORS = {
  calma:   '#4E8FA3',
  foco:    '#5A3E6B',
  orden:   '#5E7A55',
  refugio: '#8B5A5A',
  energia: '#C85F1A'
};

// ── NAVIGATION ────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function showLoading(v) {
  document.getElementById('loading').classList.toggle('visible', v);
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
let selectedRole = 'participante';

function selectRole(role) {
  selectedRole = role;
  document.getElementById('role-participante').classList.toggle('selected', role === 'participante');
  document.getElementById('role-facilitadora').classList.toggle('selected', role === 'facilitadora');
  document.getElementById('pass-field').classList.toggle('visible', role === 'facilitadora');
  document.getElementById('login-error').classList.remove('visible');
}

async function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const pass = selectedRole === 'facilitadora' ? document.getElementById('login-pass').value : '';
  const errorEl = document.getElementById('login-error');

  if (!name) {
    document.getElementById('login-name').focus();
    return;
  }

  showLoading(true);
  errorEl.classList.remove('visible');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role: selectedRole, pass })
    });

    const data = await res.json();
    showLoading(false);

    if (!res.ok) {
      errorEl.textContent = data.error || 'Error al entrar.';
      errorEl.classList.add('visible');
      return;
    }

    state.user = { name, role: selectedRole };
    state.facilitatorPass = pass;

    if (selectedRole === 'facilitadora') {
      await loadPanel();
      showScreen('panel');
    } else {
      setupJournalHeader();
      showScreen('journal');
    }
  } catch (e) {
    showLoading(false);
    errorEl.textContent = 'No se pudo conectar. Probá de nuevo.';
    errorEl.classList.add('visible');
  }
}

document.getElementById('login-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// ── JOURNAL ────────────────────────────────────────────────────────────────
function setupJournalHeader() {
  const day = Math.floor(Math.random() * 21) + 1;
  document.getElementById('journal-greeting').textContent = `DÍA ${day} · ${state.user.name}`;
  const titles = [
    'Bajá un cambio.\nRespirás. Seguimos.',
    'Una cosa a la vez.\nSin apuro.',
    'Volvé a vos.',
    'Una pausa real.',
    'Hoy también cuenta.'
  ];
  document.getElementById('journal-title').textContent = titles[Math.floor(Math.random() * titles.length)];
}

function doMeValido() {
  logAction({ need: 'pausa', card: 'elección', action: 'eligió pausa' });
  document.getElementById('celebration-emoji').textContent = '🌬';
  document.getElementById('celebration-title').textContent = 'Hoy, solo estar.';
  document.getElementById('celebration-text').textContent =
    'No hace falta hacer nada para que el día valga. Estuviste acá. Eso alcanza.';
  document.getElementById('celebration').classList.add('visible');
}

async function startJourney(need) {
  state.currentNeed = need;
  state.currentCardIndex = 0;
  state.cardActions = {};

  const journey = JOURNEYS[need];
  const badge = document.getElementById('need-badge');
  badge.textContent = journey.emoji + ' ' + journey.label;
  badge.style.background = NEED_COLORS[need];

  document.getElementById('journey-title').textContent = journey.cards[0].title;
  document.getElementById('journey-subtitle').textContent = journey.subtitle;

  renderCards(need);
  updateProgress();
  showScreen('journey');

  logAction({ need, card: journey.cards[0].title, action: 'inicio recorrido' });
}

function renderCards(need) {
  const journey = JOURNEYS[need];
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  journey.cards.forEach((card, i) => {
    const el = document.createElement('div');
    el.className = 'card' + (i === 0 ? ' active' : '');
    el.id = `card-${i}`;

    let inner = `<div class="card-number">Estación ${i + 1} de ${journey.cards.length}</div>`;

    inner += `
      <div class="card-plate" style="background:${journey.color}">
        <div class="card-plate-title">${card.title}</div>
        <div class="card-plate-body">${card.body}</div>
      </div>
    `;

    if (card.quote) {
      inner += `<div class="card-quote">${card.quote}</div>`;
    }

    if (card.options) {
      inner += `<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">`;
      card.options.forEach(opt => {
        inner += `<button class="action-chip" style="text-align:left;border-radius:12px;padding:12px 14px"
          onclick="selectOption(this, '${opt.replace(/'/g, "\\'")}', ${i})">${opt}</button>`;
      });
      inner += `</div>`;
    }

    inner += `<div class="card-actions" id="actions-${i}">`;
    card.actions.forEach(action => {
      inner += `<button class="action-chip" onclick="selectAction(this, '${action}', ${i})">${action}</button>`;
    });
    inner += `</div>`;

    el.innerHTML = inner;
    container.appendChild(el);
  });
}

function selectOption(btn, text, cardIdx) {
  const siblings = btn.closest('div').querySelectorAll('.action-chip');
  siblings.forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  state.cardActions[cardIdx] = state.cardActions[cardIdx] || {};
  state.cardActions[cardIdx].option = text;
}

function selectAction(btn, action, cardIdx) {
  const siblings = document.getElementById(`actions-${cardIdx}`).querySelectorAll('.action-chip');
  siblings.forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  state.cardActions[cardIdx] = state.cardActions[cardIdx] || {};
  state.cardActions[cardIdx].action = action;

  logAction({
    need: state.currentNeed,
    card: JOURNEYS[state.currentNeed].cards[cardIdx].title,
    action
  });
}

function updateProgress() {
  const journey = JOURNEYS[state.currentNeed];
  const pct = ((state.currentCardIndex + 1) / journey.cards.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('nav-prev').style.visibility = state.currentCardIndex === 0 ? 'hidden' : 'visible';

  const isLast = state.currentCardIndex === journey.cards.length - 1;
  document.getElementById('nav-next').textContent = isLast ? 'Terminar recorrido →' : 'Siguiente →';
}

function prevCard() {
  if (state.currentCardIndex <= 0) return;
  document.getElementById(`card-${state.currentCardIndex}`).classList.remove('active');
  state.currentCardIndex--;
  document.getElementById(`card-${state.currentCardIndex}`).classList.add('active');
  updateProgress();
}

function nextCard() {
  const journey = JOURNEYS[state.currentNeed];
  const isLast = state.currentCardIndex === journey.cards.length - 1;

  if (isLast) {
    showRegistroScreen();
    return;
  }

  document.getElementById(`card-${state.currentCardIndex}`).classList.remove('active');
  state.currentCardIndex++;
  document.getElementById(`card-${state.currentCardIndex}`).classList.add('active');
  updateProgress();
}

// ── REGISTRO ───────────────────────────────────────────────────────────────
function showRegistroScreen() {
  const journey = JOURNEYS[state.currentNeed];
  const actionsCount = Object.values(state.cardActions).filter(a => a.action).length;
  document.getElementById('registro-summary').innerHTML = `
    <strong>Tu recorrido de hoy</strong>
    Elegiste: <b>${journey.emoji} ${journey.label}</b> ·
    Completaste ${actionsCount} de ${journey.cards.length} estaciones.
    ${actionsCount >= 3 ? '¡Muy bien!' : 'Cada paso cuenta.'}
  `;
  document.getElementById('registro-text').value = '';
  showScreen('registro');
}

function shareWhatsApp() {
  const need = state.currentNeed ? JOURNEYS[state.currentNeed].label : 'una pausa';
  const reg = document.getElementById('registro-text').value.trim();
  const text = `Hoy mi bocanada fue: ${need}. ${reg ? 'Me llevo: ' + reg : 'Una pausa real.'} 🌬`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

  logAction({
    need: state.currentNeed,
    card: 'registro',
    action: 'compartió en WhatsApp',
    registro: document.getElementById('registro-text').value.trim(),
    shared: true
  });

  window.open(url, '_blank');
}

async function saveRegistro() {
  const registro = document.getElementById('registro-text').value.trim();

  await logAction({
    need: state.currentNeed,
    card: 'registro final',
    action: 'guardó registro',
    registro,
    shared: false
  });

  showCelebration(registro);
}

// ── CELEBRATION ─────────────────────────────────────────────────────────────
function showCelebration(registro) {
  const need = state.currentNeed ? JOURNEYS[state.currentNeed].label : '';
  const emojis = { calma: '🌊', foco: '🎯', orden: '🌿', refugio: '🏠', energia: '⚡' };

  document.getElementById('celebration-emoji').textContent = emojis[state.currentNeed] || '✨';
  document.getElementById('celebration-title').textContent = registro ? '¡Gracias por dejar una huella!' : '¡Recorrido completo!';
  document.getElementById('celebration-text').textContent = registro
    ? `"${registro.slice(0, 80)}${registro.length > 80 ? '…' : ''}"`
    : `Tu bocanada de hoy fue: ${need}. Eso alcanza.`;

  document.getElementById('celebration').classList.add('visible');
}

function closeCelebration() {
  document.getElementById('celebration').classList.remove('visible');
  setupJournalHeader();
  showScreen('journal');
}

// ── PANEL ──────────────────────────────────────────────────────────────────
async function loadPanel() {
  try {
    const res = await fetch('/api/panel', {
      headers: { 'x-facilitator-pass': state.facilitatorPass }
    });
    if (!res.ok) return;
    const data = await res.json();
    renderPanel(data);
  } catch (e) {
    console.error('Error loading panel', e);
  }
}

function renderPanel(d) {
  document.getElementById('panel-subtitle').textContent =
    `Señales suaves para acompañar mejor · ${state.user.name}`;

  const needLabels = { calma: '🌊 Calma', foco: '🎯 Foco', orden: '🌿 Orden', refugio: '🏠 Refugio', energia: '⚡ Energía' };
  const needBarColors = { calma: '#4E8FA3', foco: '#7D5A9B', orden: '#6B8B5E', refugio: '#A06060', energia: '#E8873A' };

  const maxNeed = Math.max(...Object.values(d.needCounts), 1);

  const alertNames = d.neverEntered.join(', ') || 'Ninguna 🎉';
  const inactiveNames = d.participantSummary
    .filter(p => p.daysActive > 0 && p.lastActive < new Date().toISOString().slice(0, 10))
    .map(p => p.name)
    .join(', ') || '';

  let html = `
    <div class="panel-section">
      <div class="panel-section-title">Señales del grupo</div>
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">${d.totalParticipants}</div>
          <div class="stat-label">participantes en el proceso</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${d.activeToday}</div>
          <div class="stat-label">entraron hoy</div>
        </div>
        <div class="stat-card ${d.neverEntered.length > 0 ? 'alert' : ''}">
          <div class="stat-number">${d.neverEntered.length}</div>
          <div class="stat-label">todavía no abrieron la bitácora</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${d.participantSummary.filter(p => p.hasRegistro).length}</div>
          <div class="stat-label">dejaron un registro escrito</div>
        </div>
      </div>
    </div>
  `;

  html += `
    <div class="panel-section">
      <div class="panel-section-title">Necesidades más elegidas</div>
      <div class="need-bars">
  `;
  const sortedNeeds = Object.entries(d.needCounts).sort((a, b) => b[1] - a[1]);
  if (sortedNeeds.length === 0) {
    html += `<div style="font-family:Arial,sans-serif;font-size:13px;opacity:0.4">Sin datos aún</div>`;
  }
  sortedNeeds.forEach(([need, count]) => {
    const pct = Math.round((count / maxNeed) * 100);
    html += `
      <div class="need-bar-row">
        <div class="need-bar-label">${needLabels[need] || need}</div>
        <div class="need-bar-track">
          <div class="need-bar-fill" style="width:${pct}%;background:${needBarColors[need] || '#888'}"></div>
        </div>
        <div class="need-bar-count">${count}</div>
      </div>
    `;
  });
  html += `</div></div>`;

  html += `
    <div class="panel-section">
      <div class="panel-section-title">Mapa de participación</div>
      <div class="participant-list">
  `;
  d.participantSummary.forEach(p => {
    const initial = p.name[0];
    const isInactive = p.inactive;
    const isActive = p.lastActive === new Date().toISOString().slice(0, 10);
    const needText = p.lastNeed ? (needLabels[p.lastNeed] || p.lastNeed) : 'sin elección';
    const daysText = p.daysActive === 0 ? 'Sin actividad' : `${p.daysActive} días`;
    html += `
      <div class="participant-row ${isInactive ? 'alert-row' : ''}">
        <div class="p-avatar ${isInactive ? 'inactive' : ''}">${initial}</div>
        <div class="p-info">
          <div class="p-name">${p.name}</div>
          <div class="p-meta">${daysText} · última elección: ${needText}</div>
        </div>
        <div class="p-status ${isActive ? 'active' : 'absent'}">${isActive ? 'hoy' : 'ausente'}</div>
      </div>
    `;
  });
  html += `</div></div>`;

  if (d.recentRegistros.length > 0) {
    html += `
      <div class="panel-section">
        <div class="panel-section-title">Huellas recientes</div>
        <div class="log-list">
    `;
    d.recentRegistros.forEach(r => {
      const time = new Date(r.ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
      html += `
        <div class="log-item">
          <div class="log-item-name">${r.name}</div>
          <div class="log-item-text">"${r.registro}"</div>
          <div class="log-item-meta">${time} · ${needLabels[r.need] || r.need || ''}</div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  if (d.neverEntered.length > 0 || inactiveNames) {
    html += `
      <div class="panel-section">
        <div class="panel-section-title">Posibles temas para reforzar</div>
    `;
    if (d.neverEntered.length > 0) {
      html += `
        <div class="alert-box" style="margin-bottom:10px">
          <strong>Para invitar suavemente a volver</strong>
          ${alertNames} no abrieron la bitácora todavía.
        </div>
      `;
    }
    if (inactiveNames) {
      html += `
        <div class="alert-box">
          <strong>Sin actividad reciente</strong>
          ${inactiveNames} — pueden necesitar un contacto suave.
        </div>
      `;
    }
    html += `</div>`;
  }

  html += `
    <button class="panel-exit-btn" onclick="exitPanel()">← Salir del panel</button>
  `;

  document.getElementById('panel-body').innerHTML = html;
}

function exitPanel() {
  state.user = { name: '', role: 'participante' };
  state.facilitatorPass = '';
  document.getElementById('login-name').value = '';
  document.getElementById('login-pass').value = '';
  selectRole('participante');
  showScreen('welcome');
}

// ── LOGGING ────────────────────────────────────────────────────────────────
async function logAction(data) {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: state.user.name,
        role: state.user.role,
        ...data
      })
    });
  } catch (e) {
    // silently fail — never block the user experience
  }
}
