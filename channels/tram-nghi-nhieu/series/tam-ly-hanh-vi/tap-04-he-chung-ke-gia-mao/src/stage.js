// The sets of this episode: the meeting room where the presentation ends, the corridor he walks into alone,
// the night room of the host, and the bedroom where the notebook waits. Same line language as the channel:
// flat fills, one hard shadow, a dark line, no gradients on objects.
import { cel, path, poly, ellP, line, mix, rgba, TAU, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import * as S from '../../../../rig/sets.js';

// ——— the meeting room: a long table, a screen on the wall, the colleagues ———
// The room is drawn in two layers: the wall and the people behind, the table in front.
export function meetingBack(g, T, o = {}) {
  g.fillStyle = '#151827'; g.fillRect(-200, -200, 2320, 1480);
  // the back wall with a projection screen
  cel(g, rect(-200, -200, 2120, 640), { f: '#1D2133', s: '#141724', l: '#12131A', lw: 3 });
  const sx = 560, sy = 70, sw = 800, sh = 430;
  cel(g, rect(sx, sy, sx + sw, sy + sh), { f: '#E8ECF5', s: '#C4CBDA', so: [0, 10], l: '#12131A', lw: 4 });
  // the slide on the screen: three bars and a title line
  cel(g, rect(sx + 70, sy + 66, sx + 470, sy + 92), { f: '#8A93AC', s: '#8A93AC', l: '#8A93AC', lw: 1 });
  for (let i = 0; i < 3; i++) {
    const h = 90 + i * 46;
    cel(g, rect(sx + 90 + i * 96, sy + sh - 80 - h, sx + 160 + i * 96, sy + sh - 80),
      { f: i === 1 ? PAL.hoodie.f : '#5A6488', s: i === 1 ? PAL.hoodie.s : '#3E4665', l: PAL.ink, lw: 3 });
  }
  cel(g, rect(sx + 520, sy + 180, sx + 720, sy + 250), { f: '#C2C9D8', s: '#C2C9D8', l: '#C2C9D8', lw: 1 });
  cel(g, rect(sx + 520, sy + 280, sx + 690, sy + 340), { f: '#C2C9D8', s: '#C2C9D8', l: '#C2C9D8', lw: 1 });
  // the colleagues, seated at the far side of the table
  S.person(g, 300, 820, .58, '#3A4260', { ph: .1 });
  S.person(g, 620, 870, .6, '#4A4260', { ph: .4 });
  S.person(g, 1140, 850, .56, '#3A4260', { ph: .7 });
  S.person(g, 1640, 810, .54, '#4A5266', { ph: .2 });
}
export function meetingFront(g, T, o = {}) {
  // the table, in perspective
  cel(g, poly([[-200, 760], [2120, 760], [1900, 1120], [20, 1120]]), { f: '#3E2E1E', s: '#2A1E14', so: [0, -10], l: '#140E08', lw: 3 });
  cel(g, rect(-200, 1100, 2120, 1500), { f: '#1D2030', s: '#14161F', l: '#0A0C14', lw: 3 });
  // the laptops and cups on the table
  for (const [x, y] of [[420, 880], [780, 930], [1180, 900], [1500, 950]]) {
    cel(g, poly([[x - 60, y], [x + 60, y], [x + 46, y - 52], [x - 46, y - 52]]), { f: '#2A3040', s: '#1A1E2C', l: PAL.ink, lw: 2.6 });
    cel(g, rect(x - 54, y + 2, x + 54, y + 16), { f: '#333B4E', s: '#242A3A', l: PAL.ink, lw: 2 });
  }
}
export function meetingRoom(g, T, o = {}) { meetingBack(g, T, o); meetingFront(g, T, o); }

// ——— the corridor after the meeting ———
export function corridor(g, T, o = {}) {
  g.fillStyle = '#12141F'; g.fillRect(-200, -200, 2320, 1480);
  // the far wall with a window on the city
  const wx = 760, wy = 180, ww = 400, wh = 460;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', s: '#111524', l: '#2A3145', lw: 4 });
  g.save(); g.beginPath(); g.rect(wx + 6, wy + 6, ww - 12, wh - 12); g.clip();
  for (let i = 0; i < 60; i++) {
    const a = Math.abs(Math.sin(i * 31.7) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 43758.5453) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .22 + b * .45);
    g.fillRect(wx + 20 + a * (ww - 40), wy + 40 + b * (wh - 120), 4, 4);
  }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
  // the side walls
  cel(g, poly([[-200, -200], [760, 180], [760, 640], [-200, 520]]), { f: '#1B1F2E', s: '#141824', l: '#12131A', lw: 3 });
  cel(g, poly([[2120, -200], [1160, 180], [1160, 640], [2120, 520]]), { f: '#1B1F2E', s: '#141824', l: '#12131A', lw: 3 });
  // the doors along the walls
  for (const [x, y, w, h] of [[300, 240, 210, 560], [1500, 240, 210, 560]]) {
    cel(g, rect(x, y, x + w, y + h), { f: '#2A3040', s: '#1A1E2C', so: [0, 8], l: PAL.ink, lw: 3 });
    cel(g, rect(x + w - 44, y + h * .5, x + w - 22, y + h * .5 + 26), { f: PAL.hoodie.f, l: PAL.ink, lw: 2 });
  }
  // the floor, in perspective
  cel(g, poly([[-200, 520], [760, 640], [1160, 640], [2120, 520], [2120, 1500], [-200, 1500]]), { f: '#222636', s: '#171B27', l: '#0A0C14', lw: 3 });
  // the lines of the floor, all of them running to the window
  for (let i = 0; i <= 8; i++) {
    const x = -400 + i * 340;
    line(g, [[x, 1500], [960, 640]], 'rgba(255,255,255,.05)', 3);
  }
  for (let i = 0; i < 7; i++) {
    const y = 700 + i * i * 26;
    line(g, [[-200 + i * 60, y], [2120 - i * 60, y]], 'rgba(255,255,255,.045)', 3);
  }
  // the ceiling lights
  for (let i = 0; i < 2; i++) {
    const y = 30 + i * 80, w = 380 - i * 90;
    cel(g, rect(960 - w / 2, y, 960 + w / 2, y + 24), { f: 'rgba(255,240,200,.55)', s: 'rgba(255,240,200,.25)', l: '#2A3145', lw: 2 });
  }
}

// ——— the bedroom at night: the notebook waits on the bedside table ———
export function bedroom(g, T, o = {}) {
  g.fillStyle = '#0F1119'; g.fillRect(-200, -200, 2320, 1480);
  // the window with the moon
  const wx = 1180, wy = 120, ww = 560, wh = 420;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', s: '#111524', l: '#2A3145', lw: 4 });
  g.save(); g.beginPath(); g.rect(wx + 6, wy + 6, ww - 12, wh - 12); g.clip();
  g.fillStyle = 'rgba(103,232,249,.07)'; g.fillRect(wx, wy, ww, wh);
  cel(g, ellP(wx + 420, wy + 110, 52, 52), { f: '#F3F0DC', s: '#D8D4BE', l: '#12131A', lw: 2.4 });
  for (let i = 0; i < 50; i++) {
    const a = Math.abs(Math.sin(i * 27.3) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 61.7) * 43758.5453) % 1;
    g.fillStyle = rgba('#FFFFFF', .2 + b * .5); g.fillRect(wx + 20 + a * (ww - 40), wy + 20 + b * (wh - 40), 3, 3);
  }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
  // the bed
  cel(g, rect(-200, 700, 980, 1120), { f: '#2A3048', s: '#1D2236', so: [0, -10], l: '#12131A', lw: 3.4 });
  cel(g, poly([[-200, 700], [40, 620], [980, 620], [980, 700]]), { f: '#333B58', s: '#1D2236', so: [0, -8], l: '#12131A', lw: 3.4 });
  cel(g, poly([[420, 700], [560, 610], [860, 610], [960, 700]]), { f: '#4A5578', s: '#39415E', so: [0, -6], l: '#12131A', lw: 3 });
  // the bedside table with the notebook
  cel(g, rect(1030, 700, 1530, 860), { f: '#3A2A1C', s: '#2A1E14', so: [0, 8], l: '#140E08', lw: 3 });
  cel(g, rect(1060, 860, 1098, 1010), { f: '#2A1E14', s: '#1E150E', l: '#140E08', lw: 2.4 });
  cel(g, rect(1462, 860, 1500, 1010), { f: '#2A1E14', s: '#1E150E', l: '#140E08', lw: 2.4 });
  // the small lamp on the table
  cel(g, poly([[1330, 540], [1430, 540], [1412, 600], [1348, 600]]), { f: '#33394E', s: '#222736', so: [0, -6], l: PAL.ink, lw: 2.6 });
  cel(g, rect(1364, 600, 1396, 666), { f: '#33394E', s: '#222736', l: PAL.ink, lw: 2.4 });
  cel(g, rect(1330, 662, 1430, 676), { f: '#33394E', s: '#222736', l: PAL.ink, lw: 2.4 });
  const grd = g.createRadialGradient(1380, 690, 10, 1380, 690, 420);
  grd.addColorStop(0, 'rgba(255,183,3,.22)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(960, 380, 840, 520);
}

// ——— the host at his own desk, at night: the channel's room set ———
export function hostDesk(g, T, o = {}) {
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  if (o.before) o.before(g, T);
  return { cam };
}
