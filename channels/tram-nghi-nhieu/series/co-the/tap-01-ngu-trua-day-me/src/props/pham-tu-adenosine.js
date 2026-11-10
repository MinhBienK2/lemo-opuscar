// Phân tử adenosine: một mô hình phân tử (purin + ribose + hydroxyl), dựng bằng
// hạt và que. Cùng một hình dùng cho cái đơn lẻ bám vào khía thụ thể và cho đám
// phân tử lơ lửng trong khe.
import { adenosineParts, moleculeParts, moleculeCloud } from './_molecule.js';

export const ADENO_SCALE = 0.034;               // kích thước một phân tử trong khe
const A = adenosineParts();
export const ADENO_PARTS = moleculeParts(A.atoms, A.bonds);

export function phamTuAdenosine() {
  const g = moleculeCloud(ADENO_PARTS, { count: 1, scale: ADENO_SCALE });
  g.name = 'pham-tu-adenosine';
  g.set(0, 0, 0, 0);
  g.flush();
  return g;
}

// đám phân tử trong khe: cùng hình, nhiều bản sao
export function damPhanTuAdenosine(count = 22) {
  const g = moleculeCloud(ADENO_PARTS, { count, scale: ADENO_SCALE });
  g.name = 'dam-phan-tu-adenosine';
  return g;
}

export const PROP = { name: 'phân tử adenosine', view: () => phamTuAdenosine() };
