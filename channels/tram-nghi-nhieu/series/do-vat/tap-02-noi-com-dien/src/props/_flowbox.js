import * as THREE from 'three';

// Dòng hạt của rig (rig/fx.js, hàm flow) là một InstancedMesh có hình quả cầu
// bán kính 1, rồi thu nhỏ từng hạt bằng ma trận mô phỏng. Tới lúc ai đó gọi
// computeBoundingBox(), hộp bao của lưới hạt vẫn là ±1 — nên khi đo khung bao
// của vật, vật này bị coi như rộng hai mét: bước chấm vật dựng lùi camera ra xa
// và vật rút lại thành một chấm trong khung, không đọc ra là cái gì.
//
// fitFlow() nói lại cỡ thật, và xếp hạt ngay từ lúc dựng:
//  - hộp bao của lưới hạt bằng một cục rất nhỏ: hạt bay quanh vật, chúng không
//    phải thân vật, nên không được phình ra làm khung vật to lên;
//  - update(0, 0) xếp hạt theo đường cong với kích thước gần bằng không: nếu
//    không, mọi hạt còn nằm ở gốc toạ độ với cỡ 1 — một đám cầu trắng to
//    bằng vật, đè lên vật.
export function fitFlow(...flows) {
  for (const g of flows) {
    const im = g && g.children && g.children.find(c => c.isInstancedMesh);
    if (!im) continue;
    im.boundingBox = new THREE.Box3(
      new THREE.Vector3(-.002, -.002, -.002), new THREE.Vector3(.002, .002, .002));
    if (typeof g.update === 'function') g.update(0, 0);
  }
  return flows[0];
}

// Một sợi gợn nhiệt (rig/fx.js, hàm squiggle) là một tấm phẳng 1×1 mà tân
// biến kéo dọc ra thành sợi. Hộp bao của tấm phẳng vẫn là 1×1 — cũng nên đo
// vật bằng cái màn 1×1, tức là nhiệt kế chỉ còn một chấm trong khung.
// fitEffect() nói lại cỡ thật của sợi.
export function fitEffect(m, r = .02) {
  if (m && m.geometry) {
    m.geometry.boundingBox = new THREE.Box3(
      new THREE.Vector3(-r, -r, -r), new THREE.Vector3(r, r, r));
  }
  return m;
}

// Một phụ kiện (dây điện, phích cắm ở ổ trên tường) nằm trong nhóm vật nhưng
// không phải thân vật: dây chạy tới tận ổ cắm trên tường, xa hơn cả cái nồi
// gấp rưỡi. Nếu đo khung vật theo cả dây, cái nồi rút lại thành một chấm
// giữa khung và không đọc ra là nồi cơm điện.
// fitAccessory() gạt phụ kiện ra khỏi đường viền đo: mọi lưới trong nhóm đó
// được cho một hộp bao rất nhỏ, nên khung đo chỉ còn thân vật.
export function fitAccessory(root, r = .01) {
  if (!root) return root;
  root.traverse(o => {
    if (o.isMesh) {
      o.boundingBox = new THREE.Box3(
        new THREE.Vector3(-r, -r, -r), new THREE.Vector3(r, r, r));
    }
  });
  return root;
}
