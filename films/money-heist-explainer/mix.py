"""mix.py — Synthesize score, procedural foley and mix voice for Money Heist Explainer."""
import os
import sys
import json
import numpy as np
import soundfile as sf

# Add library root to path to import core/audio/sfx
LIB_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, LIB_ROOT)

import core.audio.sfx as sfx

SR = 48000
HERE = os.path.dirname(__file__)
OUT_DIR = os.path.join(HERE, "out")
os.makedirs(OUT_DIR, exist_ok=True)

with open(os.path.join(HERE, "cues.json"), "r", encoding="utf-8") as f:
    cue_data = json.load(f)

TOTAL_DUR = cue_data["total_dur"]
TOTAL_SAMPLES = int(np.ceil(TOTAL_DUR * SR))
mix_buf = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

def add(target, src, at_sec, gain=1.0):
    start = int(round(at_sec * SR))
    if start >= len(target):
        return
    end = min(len(target), start + len(src))
    target[start:end] += src[:end - start] * gain

# 1. Procedural Score: Dark Investigative Bed in D minor (73.4 Hz D2, 146.8 Hz D3, 220 Hz A3, 174.6 Hz F3)
print("Synthesizing score bed...")
t = np.arange(TOTAL_SAMPLES) / SR
# Swelling D minor drone bed
drone = (
    0.45 * np.sin(2 * np.pi * 73.416 * t) +
    0.35 * np.sin(2 * np.pi * 146.83 * t + 0.5) +
    0.25 * np.sin(2 * np.pi * 220.00 * t + 1.2) +
    0.20 * np.sin(2 * np.pi * 174.61 * t + 0.8)
)
# Lowpass filter and subtle slow LFO modulation
drone = sfx.lp(drone, 450)
lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * t)
drone *= lfo

# 2. Clockwork Ticking (0.5s grid) — Creates forensic tension
print("Adding clockwork ticks...")
clock_tick = sfx.click(pitch=1.4, v=0.25)
clock_accent = sfx.click(pitch=0.9, v=0.45)
for sec in np.arange(0.5, TOTAL_DUR - 1.0, 0.5):
    # Accent every 2 seconds
    if int(round(sec * 2)) % 4 == 0:
        add(mix_buf, clock_accent, sec, gain=0.35)
    else:
        add(mix_buf, clock_tick, sec, gain=0.18)

# 3. Procedural Industrial Foley: Money Printing Press (ch-clack rhythm) during L03 & L04 (t = 30.0s to 55.0s)
print("Adding industrial printing press foley...")
for sec in np.arange(30.0, 55.0, 0.75):
    press_thump = sfx.thump(v=0.4, f=90)
    press_clack = sfx.clack(pitch=1.1, v=0.3)
    add(mix_buf, press_thump, sec, gain=0.25)
    add(mix_buf, press_clack, sec + 0.08, gain=0.22)

# 4. Impact Thumps on Key Section Transitions
print("Adding transition impacts...")
for cue in cue_data["cues"]:
    impact = sfx.thump(v=0.8, f=60)
    add(mix_buf, impact, cue["t0"], gain=0.55)
    sw = sfx.whoosh(d=0.4, v=0.3)
    add(mix_buf, sw, max(0, cue["t0"] - 0.25), gain=0.3)

# Add score bed to mix
mix_buf += drone * 0.28

# 5. Add Voice Lines with Automatic Ducking
print("Mixing voice lines...")
voices_dir = os.path.join(HERE, "voices")
for cue in cue_data["cues"]:
    wav_path = os.path.join(voices_dir, f"{cue['id']}.wav")
    if os.path.exists(wav_path):
        vdata, _ = sf.read(wav_path)
        # Apply voice compressor / normalization
        v_norm = sfx.norm(vdata, p=0.92)
        # Duck music bed during voice by -9 dB
        v_start = int(round(cue["t0"] * SR))
        v_end = min(TOTAL_SAMPLES, v_start + len(v_norm))
        mix_buf[v_start:v_end] *= 0.42 # Duck background
        # Add voice
        add(mix_buf, v_norm, cue["t0"], gain=1.15)

# 6. Master Limiting & Normalization
print("Mastering final mix...")
peak = np.abs(mix_buf).max()
if peak > 0:
    mix_buf = mix_buf / peak * 0.90

out_wav = os.path.join(OUT_DIR, "mix.wav")
sf.write(out_wav, mix_buf, SR, subtype="PCM_16")
print(f"Mix saved successfully to {out_wav} (Duration: {TOTAL_DUR}s)")

# Also generate SRT subtitles file
srt_path = os.path.join(HERE, "money-heist-explainer.srt")
with open(srt_path, "w", encoding="utf-8") as f:
    for idx, cue in enumerate(cue_data["cues"]):
        def fmt(t_sec):
            h = int(t_sec // 3600)
            m = int((t_sec % 3600) // 60)
            s = int(t_sec % 60)
            ms = int(round((t_sec - int(t_sec)) * 1000))
            return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
        f.write(f"{idx+1}\n")
        f.write(f"{fmt(cue['t0'])} --> {fmt(cue['t1'])}\n")
        f.write(f"{cue['text']}\n\n")

print(f"Subtitles written to {srt_path}")
