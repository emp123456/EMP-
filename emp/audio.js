export class AudioManager {
    constructor() {
        this.ctx = null;
        this.activeNodes = [];
        this.masterGain = null;
        this.isPlaying = false;
        this.currentTheme = 'main';
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0;
        this.masterGain.connect(this.ctx.destination);
    }

    start(theme = 'main') {
        if (this.isPlaying) return;
        this.init();
        if (!this.ctx) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this.currentTheme = theme;

        if (theme === 'main') {
            this.playMainTheme();
        } else if (theme === 'choice') {
            this.playChoiceTheme();
        }

        // Master Fade In
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 3.0);
        this.isPlaying = true;
    }

    createOsc(freq, type, vol, pan = 0, lfoFreq = 0, lfoDepth = 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner();

        osc.frequency.value = freq;
        osc.type = type;

        gain.gain.value = vol;
        panner.pan.value = pan;

        // Routing
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);

        // LFO (optional)
        let lfoNodes = [];
        if (lfoFreq > 0) {
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = lfoFreq;
            lfoGain.gain.value = lfoDepth;
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain); // AM synthesis
            lfo.start();
            lfoNodes.push(lfo, lfoGain);
        }

        osc.start();

        // Track
        this.activeNodes.push({
            stop: () => {
                osc.stop();
                lfoNodes.forEach(n => n.disconnect && n.disconnect());
            }, nodes: [osc, gain, panner, ...lfoNodes]
        });
    }

    playMainTheme() {
        // "Mysterious & Tranquil" - Smoother, less abrasive
        // Deep Warm Bass (Triangle/Sine instead of Saw)
        this.createOsc(32.70, 'triangle', 0.15, 0, 0.1, 0.02); // C1
        this.createOsc(65.41, 'sine', 0.1, 0, 0.05, 0.02); // C2

        // Soft Ethereal Pads (Sine waves with slow movement)
        this.createOsc(130.81, 'sine', 0.05, 0.3, 0.2, 0.03); // C3
        this.createOsc(155.56, 'sine', 0.04, -0.3, 0.15, 0.03); // Eb3 (Minor 3rd)
        this.createOsc(196.00, 'sine', 0.04, 0.2, 0.1, 0.03); // G3 (5th)

        // Removed Noise for clarity
    }

    playChoiceTheme() {
        // "Decision / Tension" - Simpler, more focused, slightly higher pitch center
        // Root A Minor
        this.createOsc(55.00, 'sine', 0.2, 0); // A1
        this.createOsc(110.00, 'triangle', 0.05, -0.2); // A2

        // Tense Interval (Minor 2nd and Tritone hints)
        this.createOsc(116.54, 'sine', 0.02, 0.3, 8.0, 0.01); // Bb2 (Tension)
        this.createOsc(164.81, 'sine', 0.02, -0.3, 5.0, 0.01); // E3

        // An intermittent "ping" loop could be complex, sticking to drone for safety/conciseness
    }

    createNoise(vol) {
        // Simple White Noise generator
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const gain = this.ctx.createGain();
        gain.gain.value = vol;

        // Filter it to be "windy" (Lowpass)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start();

        return { stop: () => noise.stop(), nodes: [noise, gain, filter] };
    }

    stop() {
        if (!this.ctx || !this.isPlaying) return;

        // Fade Out
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);

        setTimeout(() => {
            this.activeNodes.forEach(item => {
                if (item.stop) item.stop();
                // Clean up nodes aggressively to prevent memory leaks if possible
                if (item.nodes) item.nodes.forEach(n => n.disconnect());
            });
            this.activeNodes = [];
            this.isPlaying = false;
        }, 1100);
    }
}
