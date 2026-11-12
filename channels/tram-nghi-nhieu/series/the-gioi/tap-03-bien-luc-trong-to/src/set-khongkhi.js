// N2 · trong không khí, ban ngày
import * as THREE from 'three';
import { mulberry } from '../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../rig/lights.js';
import { V3, skyTexture } from './props/_common.js';
import { hatKhongKhi } from './props/hat-khong-khi.js';
import { hatRucSang } from './props/hat-ruc-sang.js';
import { daiSongAnhSang } from './props/dai-song-anh-sang.js';
import { dongSangRe } from './props/dong-sang-re.js';
import { chumSangNgang } from './props/chum-sang-ngang.js';
import { chumSangTrucTiep } from './props/chum-sang-truc-tiep.js';

// ── N2 · trong không khí, ban ngày ────────────────────────────────────────
// Trong không khí ban ngày: một chùm sáng trắng của Mặt Trời đi ngang qua
// một lớp hạt nhỏ, hạt sát chùm thì rực lên rồi ném ra dòng sáng sang bên,
// hai màu bị rẽ khác nhau, và một chùm sáng đi thẳng không bị rẽ.
//
// Nguyên tắc hình của cảnh này — cảnh không có vật thể nào đứng im, nên mọi
// thứ phải đọc được bằng HÌNH, không bằng ánh sáng:
//
//  1. Hạt khí là CẦU TOON có viền mực (lớp 0), không phải chấm sáng. Một chấm
//     sáng nhỏ trên nền trời đọc ra là sao; một cầu có mặt và có nét thì đọc
//     ra là "một lớp hạt nhỏ". Hạt ở xa phải to lên theo khoảng cách, nếu không
//     chúng thành sao.
//  2. Chùm sáng là LÕI SÁNG + VỎ SÁNG MỀM, không phải một vệt sương nhòe.
//     Chùm là ánh sáng nên không có viền mực: một ống toon đặc có mép mực
//     cứng và mặt kem đục, đọc ra là que gỗ. Lõi sáng cho hướng, vỏ sáng
//     mềm cho quang; hai đầu chùm mờ dần nên chùm tan vào không khí chứ
//     không kết thúc bằng một mũi nhọn.
//  3. Dòng sáng bị rẽ là SỢI MẢNH có nét mực, không phải bông. Bông trông
//     như mây hay như quả bóng, và người xem sẽ đọc nhầm thành vật thể khác.
//  4. Dòng sáng luôn BÁM vào một hạt vừa rực lên: hạt là quả cầu trắng rực,
//     dòng là sợi mảnh nối từ quả cầu ấy. Tách hai thứ ra thì dòng sáng đọc
//     ra là vật thể trôi trong không trung.
//  5. Chùm đi thẳng là ỐNG RỖNG: hai mép sáng rõ, giữa tối hơn, nhìn ngược
//     thì thấy nó kéo về phía máy.
//
// Mọi vật trong cảnh này đã tách ra thành vật dựng riêng trong `props/`; bộ
// dựng ở đây chỉ lo chỗ đứng, ánh sáng và nhịp bật/tắt của từng câu.
export function buildKhongKhi() {
  const scene = new THREE.Scene();
  scene.background = skyTexture({
    stops: [[90, '#1c5ab4'], [50, '#2f79c9'], [24, '#5299d8'], [8, '#7fb6e4'],
      [0, '#a9cdec'], [-6, '#c2dcf1'], [-20, '#b0c8dc']],
  });
  scene.fog = new THREE.Fog('#a9c8e4', 18, 48);

  // Một dãy số ngẫu nhiên duy nhất cho cả cảnh: hạt khí trước, rồi hạt rực
  // lên. Hai bộ hạt nằm trên cùng một dãy nên vị trí của chúng phải giữ
  // nguyên thứ tự — đổi thứ tự là đổi cả bức tranh.
  const rnd = mulberry(19);

  // ── hạt khí: cầu nhỏ có viền mực, lơ lửng quanh chùm sáng ──────────────
  const mols = hatKhongKhi({ rnd });
  scene.add(mols);

  // ── chùm sáng ngang: LÕI SÁNG + VỎ SÁNG MỀM ─────────────────────────
  const beam = chumSangNgang({ a: -16, b: 28 });
  scene.add(beam);

  // ── hạt sát chùm: rực lên — nằm ngay trong lòng chùm ───────────────────
  const hots = hatRucSang({ rnd });
  scene.add(hots);

  // ── dải sóng: sóng ngắn (xanh, rẽ mạnh) và sóng dài (đỏ, rẽ yếu) ─────
  // Hai hạt đứng gần nhau ở giữa khung: cận cảnh phải thấy được CẢ HAI trong
  // một khung, nên khoảng cách giữa chúng nhỏ hơn bề ngang của khung cận.
  // Hai quả cầu này chỉ hiện ở câu nói về dải sóng (c08, c09): ở những câu
  // khác, thứ đọc được là DÒNG sáng, không phải quả cầu — một quả cầu đặc
  // đọc ra là vật thể khác, không phải ánh sáng.
  const pA = V3(-.42, .26, 0), pB = V3(.42, .26, 0);
  const waveShort = daiSongAnhSang({
    waves: 9, amp: .024, len: .62, thick: .014, color: '#8fe4ff',
    dotColor: '#dff4ff', dotGlow: '#7fd8ff', dotK: .6,
    at: { x: pA.x, y: pA.y, z: pA.z },
  });
  const waveLong = daiSongAnhSang({
    waves: 1, amp: .045, len: .62, thick: .014, color: '#ff9a7a',
    dotColor: '#ffe0d4', dotGlow: '#ff8a6a', dotK: .35,
    at: { x: pB.x, y: pB.y, z: pB.z },
  });
  scene.add(waveShort, waveLong);

  // ── dòng sáng bị rẽ: SỢI MẢNH có nét mực, chạy từ hạt sang bên ───────
  // Sợi nằm trên lớp 0 nên có viền mực: đọc ra là một tia vẽ tay, không phải
  // một cục sáng mềm trông như quả bóng. Sợi phải BÁM đúng hạt vừa sáng.
  const rays = dongSangRe({ fan: 14 });
  scene.add(rays);

  // ── chùm đi thẳng: một ỐNG, không phải một cục trắng ──────────────────
  // Ống sáng đi thẳng về phía máy được dựng bằng hai sợi mép (lớp 0, có
  // viền mực) và một vỏ sáng mờ ở giữa: nhìn ngược thì thấy nó là một ống
  // kéo về phía ta — hai mép sáng rõ, giữa ống mờ hơn.
  // Không dùng một khối trắng: khối trắng đọc ra là mặt trời, chứ không
  // phải một chùm sáng đi thẳng. Miệng ống nằm ở z = 0 (cục bộ), thân ống
  // chạy về z âm; mỗi câu đặt lại miệng ống cho đúng tầm xa của nó.
  const straight = chumSangTrucTiep({ r: .50, len: 18, tubeR: .042, body: false });
  scene.add(straight);

  // Ban ngày: nắng ấm làm chính, trời xanh làm đèn lấp. Không tím: tím là
  // màu của đêm ở các cảnh khác của tập, đặt vào đây thì hạt trắng thành
  // tím và cảnh trông như đêm.
  // Cường độ nắng giữ ở mức vừa: sáng quá thì mặt sáng của mọi vật vượt
  // ngưỡng bloom, và cả khung bị một màn sương trắng phủ.
  const key = keyLight(scene, { color: '#fff2dc', intensity: 1.30, from: V3(-6, 6, 6), to: V3(0, 0, 0), size: 9, far: 40 });
  ambience(scene, { sky: '#bcd8f2', ground: '#93a7b6', fill: .40, rim: '#cfe6ff', rimI: .35, rimFrom: [3, 3, -4] });

  return {
    scene, key, pA, pB,
    waveShortAt: V3(pA.x, pA.y, pA.z), waveLongAt: V3(pB.x, pB.y, pB.z),
    update(t, s) {
      const m = s || {};
      mols.userData.update(t, m.mols || 'all');
      hots.userData.update(t, m.hot ? 1 : .18);
      hots.visible = m.side !== false && m.hot !== false;
      beam.userData.parts.beamCore.visible = m.side !== false;
      beam.userData.parts.beamGlow.visible = m.side !== false;

      // dải sóng (waves) chỉ ở c08, c09 — cùng lúc với hai quả cầu màu.
      waveShort.visible = !!m.waves; waveLong.visible = !!m.waves;

      // dòng bị rẽ (rays) chỉ ở c06, c07 — cùng lúc với hai hạt neo trắng.
      rays.userData.parts.side.visible = !!m.rays;

      // dòng bay về phía ta (toCam) chỉ ở c06.
      rays.userData.parts.toward.visible = !!m.toCam;

      // dòng từ mọi hướng (all) chỉ ở c10, c11.
      rays.userData.parts.all.visible = !!m.all;

      // chùm đi thẳng chỉ hiện ở câu nói về nó: c07 (đứng giữa), c12 (đi
      // thẳng vào mắt ta) và c13 (nhìn dọc theo chùm). Mỗi câu đặt miệng
      // ống ở tầm xa khác nhau.
      straight.visible = !!(m.straight || m.straightCore);
      straight.userData.parts.sbBody.visible = !!m.straightCore;
      if (m.straightZ !== undefined) straight.position.z = m.straightZ;
      if (m.straightScale !== undefined) straight.scale.setScalar(m.straightScale);
    },
  };
}
