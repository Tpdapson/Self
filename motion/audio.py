"""Beat-locked audio: 7-bar song section + synthesized UI sounds placed by their measured peaks."""
import json, numpy as np, subprocess, os, sys
SR = 48000
here = os.path.dirname(os.path.abspath(__file__))
x = np.fromfile(os.path.join(here, 'out/song48.f32'), dtype=np.float32).reshape(-1, 2)
mono = x.mean(1)

# ── refine the grid: kick peaks (low-passed envelope) near each predicted beat ──
BPM, PHASE = 119.985, 0.3077           # from the whole-track spectral-flux fit
beat = 60 / BPM
def lowpass(sig, fc):
    n = len(sig); F = np.fft.rfft(sig); f = np.fft.rfftfreq(n, 1 / SR)
    F[f > fc] = 0; return np.fft.irfft(F, n)
seg_a, seg_b = int(60 * SR), int(82 * SR)
lo = np.abs(lowpass(mono[seg_a:seg_b], 120))
env = np.convolve(lo, np.ones(96) / 96, 'same')             # 2 ms smoothing
start_bar = 32                                               # first bar after the break (64.3 s)
t0 = PHASE + start_bar * 4 * beat
offs = []
for k in range(0, 28, 4):                                    # downbeats carry the kick
    tb = t0 + k * beat
    i0 = int((tb - 0.03) * SR)
    seg = mono[i0:int((tb + 0.09) * SR)]
    e = np.sqrt(np.convolve(seg ** 2, np.ones(96) / 96, 'same'))   # 2 ms RMS envelope
    on = np.argmax(e > 0.5 * e.max())                        # onset = half-rise of the kick
    offs.append((i0 + on) / SR - tb)
offs = np.array(offs)
START = t0 + np.median(offs)
print(f'grid start {t0:.4f}s, kick onset offsets ms {np.round(offs*1000,1)}, audio start {START:.4f}s')

L = 14.0; N = int(L * SR); XF = int(0.03 * SR)
i = int(round(START * SR))
music = x[i:i + N].copy()
tail = x[i + N:i + N + XF]
ramp = np.linspace(0, 1, XF)[:, None]
music[:XF] = music[:XF] * ramp + tail * (1 - ramp)          # seam crossfade: loops cleanly

# ── UI sounds (synthesized, so they're ours) ──
rng = np.random.default_rng(7)
def tt(d): return np.arange(int(d * SR)) / SR
def bp_noise(d, f0, f1):
    n = rng.standard_normal(int(d * SR)); F = np.fft.rfft(n); f = np.fft.rfftfreq(len(n), 1 / SR)
    F[(f < f0) | (f > f1)] = 0; y = np.fft.irfft(F, len(n)); return y / np.abs(y).max()
def env_ad(d, a, dec):
    t = tt(d); return np.minimum(t / a, 1) * np.exp(-np.maximum(t - a, 0) / dec)
def click():
    d = .05; t = tt(d)
    return .55 * bp_noise(d, 2500, 7000) * env_ad(d, .0006, .004) + .5 * np.sin(2 * np.pi * 1850 * t) * env_ad(d, .0008, .009)
def key():
    d = .06; t = tt(d)
    return .5 * bp_noise(d, 1500, 5000) * env_ad(d, .0008, .006) + .45 * np.sin(2 * np.pi * 1150 * t) * env_ad(d, .001, .012)
def enter():
    d = .09; t = tt(d)
    return .5 * bp_noise(d, 900, 3500) * env_ad(d, .001, .009) + .6 * np.sin(2 * np.pi * 620 * t) * env_ad(d, .0015, .022)
def tick():
    d = .02; t = tt(d); return np.sin(2 * np.pi * 3200 * t) * env_ad(d, .0004, .0025)
def pop():
    d = .12; t = tt(d); f = 520 + 420 * (1 - np.exp(-t / .02)); ph = 2 * np.pi * np.cumsum(f) / SR
    return .8 * np.sin(ph) * env_ad(d, .002, .03)
def thump():
    d = .18; t = tt(d); f = 95 + 90 * np.exp(-t / .03); ph = 2 * np.pi * np.cumsum(f) / SR
    return .9 * np.sin(ph) * env_ad(d, .003, .05)
def grab():
    d = .05; t = tt(d); return .4 * bp_noise(d, 1200, 4000) * env_ad(d, .0008, .005) + .35 * np.sin(2 * np.pi * 900 * t) * env_ad(d, .001, .01)
def release():
    d = .05; t = tt(d); return .3 * bp_noise(d, 1800, 5000) * env_ad(d, .0008, .004) + .3 * np.sin(2 * np.pi * 1300 * t) * env_ad(d, .001, .008)
SYN = dict(click=click, key=key, enter=enter, tick=tick, pop=pop, thump=thump, grab=grab, release=release)
LEVEL = dict(click=.34, key=.26, enter=.34, tick=.16, pop=.26, thump=.42, grab=.26, release=.22)

sfx = np.zeros(N)
cues = json.load(open(os.path.join(here, 'out/sounds.json')))
for c in cues:
    s = SYN[c['type']]() * LEVEL[c['type']] * c['gain']
    pk = np.argmax(np.abs(s))                                # measured peak, not the file start
    at = int(round(c['t'] * SR)) - pk
    idx = (np.arange(len(s)) + at) % N                       # wraps around the loop seam
    np.add.at(sfx, idx, s)
out = music * 0.88 + sfx[:, None]
peak = np.abs(out).max()
if peak > 0.98: out *= 0.98 / peak
print(f'{len(cues)} cues, peak {peak:.3f}')
subprocess.run([os.environ['FFMPEG'], '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', os.path.join(here, 'out/audio.wav')],
               input=out.astype(np.float32).tobytes(), check=True)
