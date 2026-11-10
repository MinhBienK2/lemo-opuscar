// Phân tử caffeine: purin + ba nhóm metyl + hai nguyên tử oxy. Nó chen vào đúng
// khía mà adenosine đang bám, nên adenosine không còn chỗ bám nữa.
import { caffeineParts, moleculeParts, moleculeCloud } from './_molecule.js';

export const CAFE_SCALE = 0.034;
const C = caffeineParts();
export const CAFE_PARTS = moleculeParts(C.atoms, C.bonds);

export function phanTuCaffeine() {
  const g = moleculeCloud(CAFE_PARTS, { count: 1, scale: CAFE_SCALE });
  g.name = 'phan-tu-caffeine';
  g.set(0, 0, 0, 0);
  g.flush();
  return g;
}

export const PROP = { name: 'phân tử caffeine', view: () => phanTuCaffeine() };
