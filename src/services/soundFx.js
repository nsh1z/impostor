// Motor de efectos de sonido sintetizados en tiempo real usando Web Audio API
// Sin archivos externos, 100% libre de latencia de red y con interruptor de silencio

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('impostor_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('impostor_muted', this.muted ? 'true' : 'false');
    return this.muted;
  }

  // Clic táctil de interfaz
  click() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Silbato de árbitro realista (doble frecuencia batiente con modulación)
  whistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const mainGain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    // Frecuencias clásicas de silbato Fox 40
    osc1.frequency.setValueAtTime(2600, t);
    osc2.frequency.setValueAtTime(2850, t);

    // Modulación de trino
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(30, t);
    lfoGain.gain.setValueAtTime(150, t);

    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    // Envolvente de sonido con dos pitidos rápidos
    mainGain.gain.setValueAtTime(0.001, t);
    // Primer pitido
    mainGain.gain.linearRampToValueAtTime(0.18, t + 0.03);
    mainGain.gain.setValueAtTime(0.18, t + 0.12);
    mainGain.gain.linearRampToValueAtTime(0.001, t + 0.15);
    // Segundo pitido
    mainGain.gain.linearRampToValueAtTime(0.22, t + 0.18);
    mainGain.gain.setValueAtTime(0.22, t + 0.38);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc1.connect(mainGain);
    osc2.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    lfo.start(t);
    osc1.start(t);
    osc2.start(t);

    lfo.stop(t + 0.45);
    osc1.stop(t + 0.45);
    osc2.stop(t + 0.45);
  }

  // Tic-tac de tensión para temporizador
  tick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // Swoosh de revelación de tarjeta
  reveal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.25);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // Alarma de impostor / VAR
  alarm() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.15);
    osc.frequency.linearRampToValueAtTime(440, t + 0.3);
    osc.frequency.linearRampToValueAtTime(880, t + 0.45);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Ovación / trompeta de gol victorioso
  victory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // Acorde mayor épico A-C#-E-A
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + (i * 0.1));

      gain.gain.setValueAtTime(0.001, t + (i * 0.1));
      gain.gain.linearRampToValueAtTime(0.15, t + (i * 0.1) + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + (i * 0.1));
      osc.stop(t + 1.2);
    });
  }
}

export const soundFx = new SoundEngine();
