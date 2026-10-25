// Web Audio procedural cosmic synthesizer
class CosmicAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm resonant low-pass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Slow LFO to modulate filter cutoff like a pulsing cosmic pulsar
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    // Fundamental deep drone (55Hz / A1)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Harmonic fifth + detune (82.5Hz / E2)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(82.4, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.osc1.connect(this.filter);
    this.osc2.connect(subGain);
    subGain.connect(this.filter);

    this.osc1.start();
    this.osc2.start();
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      // Fade out
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      this.isPlaying = false;
    } else {
      // Fade in
      this.masterGain.gain.setTargetAtTime(0.08, this.ctx.currentTime, 0.5);
      this.isPlaying = true;
    }

    return this.isPlaying;
  }

  public playWarp() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const cosmicAudio = new CosmicAudioSynthesizer();
