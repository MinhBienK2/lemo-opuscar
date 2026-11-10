// Viền mực tô trong vật liệu, theo GÓC NHÌN (fresnel).
//
// Pass viền mực ở mức màn hình bắt được những vật có cạnh sắc, nhưng không
// bắt được một vật mềm không cạnh (khối mô não, vành túi protein): mép vật
// chỉ còn một mảng màu trơn, lạc giữa phong cách vẽ tay của kênh.
//
// Cách đã thử và bỏ: dựng một VỎ NGOÀI cùng hình, nhô ra, chỉ vẽ mặt
// trong. Vỏ đó không bám được đường viền thật của một bề mặt có nếp: ở góc
// nhìn nghiêng, mép vỏ nhô ra thành một dải răng cưa trông như lỗi render.
//
// Dải tối theo góc nhìn thì bám đúng đường viền thật: càng vuông góc với
// mắt càng tối. Nền của vật liệu là sRGB, nên màu mực ở đây là giá trị
// tuyến tính của mực của kênh (#171a2b).
export function inkRim(material, { power = 2.4, amount = 1.5, max = .88 } = {}) {
  material.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `#include <opaque_fragment>
      float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), ${power});
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.010, 0.011, 0.024), clamp(fres * ${amount}, 0.0, ${max}));`);
  };
  material.needsUpdate = true;
  return material;
}
