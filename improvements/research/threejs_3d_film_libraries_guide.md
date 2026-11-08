# Thư viện và công nghệ có thể kết hợp với Three.js cho dự án AI làm phim 3D

> Mục tiêu: xây dựng một môi trường 3D có thể được AI Agent điều khiển
> bằng code, có vật lý, nhân vật, animation, tương tác, camera cinematic
> và khả năng xuất video.
>
> Tài liệu này là bản đồ tham khảo công nghệ. Không cần cài tất cả thư
> viện cùng lúc. Hãy chọn theo từng lớp chức năng và kiểm tra tương
> thích phiên bản trước khi triển khai.

------------------------------------------------------------------------

## 1. Kiến trúc tổng quan

Three.js nên đảm nhiệm phần lõi hiển thị 3D: scene graph, geometry,
material, camera, ánh sáng và render. Các hệ thống chuyên biệt được ghép
vào xung quanh.

``` text
AI Agent
   |
   v
Scene DSL / Action API
   |
   v
AI 3D Film Runtime
   |
   +-- World & Assets       -> Three.js, GLTF, Blender
   +-- Physics              -> Rapier
   +-- Character & Motion   -> AnimationMixer, Mixamo, IK
   +-- Navigation           -> Recast Navigation
   +-- Cinematography       -> Three.js Camera, GSAP, Theatre.js
   +-- Visual Quality       -> PBR, HDRI, postprocessing
   +-- Validation           -> collision checks, animation checks, preview
   |
   v
Frame Renderer -> PNG/EXR sequence -> FFmpeg -> MP4
```

### Stack đề xuất để bắt đầu

  -----------------------------------------------------------------------
  Lớp                     Lựa chọn khởi đầu       Vai trò
  ----------------------- ----------------------- -----------------------
  Ngôn ngữ                TypeScript              Kiểu dữ liệu rõ ràng,
                                                  dễ sinh code và kiểm
                                                  tra

  3D engine               Three.js                Scene, camera,
                                                  geometry, materials,
                                                  rendering

  React integration (nếu  React Three Fiber       Khai báo scene bằng
  làm app React)                                  React components

  Helpers                 Drei                    Environment, controls,
                                                  loaders, text, shadows

  Physics                 Rapier                  Rigid body, collider,
                                                  gravity, joints

  Navigation              Recast Navigation JS    NavMesh và pathfinding

  Asset format            glTF / GLB              Trao đổi model,
                                                  material, skeleton,
                                                  animation

  Animation               Three.js AnimationMixer Phát và blend animation
                                                  clips

  IK                      IK solver phù hợp với   Đặt tay/chân tới target
                          rig                     

  Timeline                GSAP hoặc Theatre.js    Điều phối camera và
                                                  hành động theo thời
                                                  gian

  Post-processing         `postprocessing` +      Bloom, DOF, vignette,
                          React wrapper nếu dùng  color effects
                          R3F                     

  Asset processing        Blender + glTF          Tạo, sửa và tối ưu
                          Transform               model

  Video                   Frame sequence + FFmpeg Ghép frame thành video
  -----------------------------------------------------------------------

**Khuyến nghị:** Nếu không cần React, dùng Three.js thuần với TypeScript
vẫn hoàn toàn hợp lý. React Three Fiber không phải engine khác; nó là
renderer giúp dùng Three.js trong React.

------------------------------------------------------------------------

## 2. Core 3D và framework

### 2.1 Three.js --- lõi 3D

-   Website: https://threejs.org/
-   Documentation: https://threejs.org/docs/
-   GitHub: https://github.com/mrdoob/three.js

Dùng cho: - Scene graph, Object3D, Mesh, geometry. - Camera, lights,
shadows. - PBR materials và texture. - Loading GLTF/GLB. -
AnimationMixer. - WebGLRenderer và các tính năng WebGPU tùy mức độ hỗ
trợ.

Three.js không phải một bộ phim trường hoàn chỉnh. Physics, navigation,
character controller, timeline và xuất video cần được thiết kế hoặc tích
hợp riêng.

### 2.2 React Three Fiber (R3F) --- khi ứng dụng dùng React

-   Docs: https://r3f.docs.pmnd.rs/
-   GitHub: https://github.com/pmndrs/react-three-fiber

R3F cho phép khai báo scene bằng React components. Có ích khi xây một
ứng dụng có giao diện editor, panel thuộc tính, asset browser và
viewport 3D.

Không bắt buộc dùng R3F nếu runtime chỉ là một tiến trình render
headless hoặc một ứng dụng Three.js thuần.

### 2.3 Drei --- bộ helper cho R3F

-   Docs: https://drei.docs.pmnd.rs/
-   GitHub: https://github.com/pmndrs/drei

Các tiện ích thường dùng: - `Environment`: môi trường ánh sáng/HDRI. -
`useGLTF`: tải model glTF. - `useAnimations`: tiện ích dùng animation
clips. - `ContactShadows`: bóng tiếp xúc. - `Stage`: thiết lập sân khấu
nhanh cho preview. - `OrbitControls`, `TransformControls`: thao tác
viewport. - `Text`, `Html`: chữ và UI trong scene.

Drei phụ thuộc vào R3F. Không nên cài Drei cho dự án Three.js thuần nếu
không sử dụng React Three Fiber.

------------------------------------------------------------------------

## 3. Physics và tương tác vật thể

### 3.1 Rapier --- lựa chọn khởi đầu đề xuất

-   Website/docs: https://rapier.rs/
-   GitHub: https://github.com/dimforge/rapier
-   React integration: https://github.com/pmndrs/react-three-rapier

Có thể dùng để mô phỏng: - Gravity và rigid bodies. - Collider và
collision events. - Impulse, force, velocity. - Fixed, revolute và các
loại joints. - Character controller. - Ray casting và shape casting.

Ví dụ use case: - Cốc rơi xuống sàn. - Quả bóng lăn trên mặt bàn. - Cánh
cửa quay quanh bản lề. - Nhân vật không đi xuyên qua tường. - Vật được
gắn vào tay nhân vật trong lúc cầm.

**Lưu ý:** Rapier không tự tạo animation đi bộ đẹp, không tự giải quyết
toàn bộ bài toán bàn tay nắm đúng quai cốc. Cần phối hợp animation, IK,
constraints và logic tương tác.

### 3.2 Các lựa chọn khác

  -------------------------------------------------------------------------------------------
  Công nghệ               Khi nào xem xét         Tham khảo
  ----------------------- ----------------------- -------------------------------------------
  Jolt Physics            Cần physics engine      https://github.com/jrouwe/JoltPhysics
                          native hiệu năng cao    
                          hoặc muốn thử WASM      
                          binding                 

  Ammo.js / Bullet        Cần hệ sinh thái Bullet https://github.com/kripken/ammo.js
                          hoặc có code cũ dựa     
                          trên Ammo               

  PhysX                   Dự án native hoặc       https://github.com/NVIDIA-Omniverse/PhysX
                          pipeline tích hợp       
                          PhysX; không phải lựa   
                          chọn JS mặc định đơn    
                          giản                    
  -------------------------------------------------------------------------------------------

Không nên tích hợp nhiều physics engine cùng điều khiển một vật thể.
Chọn một engine làm nguồn chân lý cho trạng thái vật lý.

### 3.3 Quy tắc quan trọng khi ghép physics với Three.js

-   Dùng fixed timestep cho physics, ví dụ 1/60 giây.
-   Đồng bộ transform từ physics body sang Three.js mesh.
-   Phân biệt static, dynamic và kinematic body.
-   Thiết kế collider riêng, không mặc định dùng mesh render phức tạp
    làm collider.
-   Có quy tắc chuyển quyền điều khiển giữa animation và physics.
-   Khi nhân vật cầm đồ vật, dùng constraint/attachment có kiểm soát;
    khi thả, trả vật thể về dynamic body.

------------------------------------------------------------------------

## 4. Character, rigging và animation

### 4.1 glTF/GLB và Three.js AnimationMixer

-   glTF: https://www.khronos.org/gltf/
-   Three.js GLTFLoader:
    https://threejs.org/docs/#examples/en/loaders/GLTFLoader
-   Three.js animation manual:
    https://threejs.org/manual/en/animation-system.html

GLB/glTF có thể chứa: - Mesh và materials. - Skeleton và skinning. -
Animation clips. - Morph targets/blend shapes. - Scene hierarchy.

`AnimationMixer` phát các clip và hỗ trợ chuyển tiếp giữa các action. Có
thể dùng `crossFadeTo()`/`crossFadeFrom()` để blend Idle → Walk → Run.

### 4.2 Mixamo --- nguồn animation humanoid

-   Website: https://www.mixamo.com/

Hữu ích để lấy: - Idle, walk, run, jump. - Sit, stand, turn. - Một số
hành động tương tác và biểu diễn.

Workflow tham khảo: 1. Chuẩn bị model humanoid. 2. Rig bằng Mixamo hoặc
công cụ rigging phù hợp. 3. Tải animation clip. 4. Chuẩn hóa skeleton và
scale. 5. Import vào Blender để kiểm tra/retarget nếu cần. 6. Xuất GLB
và phát bằng Three.js AnimationMixer.

Lưu ý giấy phép và điều khoản sử dụng của nguồn asset. Kiểm tra khả năng
tương thích skeleton; không phải mọi nhân vật đều retarget hoàn hảo.

### 4.3 Motion capture và thư viện chuyển động

  -----------------------------------------------------------------------------------
  Công cụ                 Công dụng               Link
  ----------------------- ----------------------- -----------------------------------
  Rokoko                  Motion capture và       https://www.rokoko.com/
                          retargeting workflow    

  ActorCore               Character và motion     https://actorcore.reallusion.com/
                          assets                  

  Mixamo                  Auto-rig và animation   https://www.mixamo.com/
                          humanoid                
  -----------------------------------------------------------------------------------

Đây là các nguồn dữ liệu chuyển động, không phải runtime animation
engine thay thế Three.js.

### 4.4 IK --- Inverse Kinematics

IK giải quyết bài toán đặt đầu cuối của chi tới target: - Tay chạm bàn
hoặc nắm vật. - Chân thích nghi với mặt đất. - Tay đặt lên tay nắm
cửa. - Tư thế nhân vật khi tương tác.

Các hướng triển khai: - Tự xây solver CCD hoặc FABRIK cho rig cụ thể. -
Dùng thư viện IK JavaScript tương thích với skeleton của dự án. -
Tạo/retarget rig và animation trong Blender rồi xuất sang glTF.

Không có một IK package duy nhất phù hợp với mọi rig. Cần prototype với
đúng skeleton sẽ dùng trong phim trước khi chọn thư viện.

### 4.5 Các kỹ thuật cần có để đi bộ tự nhiên

-   Animation blending: blend Idle/Walk/Run theo tốc độ.
-   Root motion hoặc in-place locomotion: chọn một mô hình điều khiển rõ
    ràng.
-   Foot planting: giữ chân không trượt khi đang chống đất.
-   Foot IK: đặt chân lên địa hình.
-   Hand IK: đưa tay đến điểm tương tác.
-   Retargeting: dùng motion clip cho nhiều nhân vật.
-   Ragdoll: chuyển sang physics khi ngã/va chạm mạnh, nếu cần.

**Quan trọng:** Character Controller giải quyết di chuyển và va chạm;
animation system giải quyết dáng đi. Hai việc này phải đồng bộ với nhau.

------------------------------------------------------------------------

## 5. Navigation và pathfinding

### Recast Navigation JS

-   GitHub: https://github.com/isaac-mason/recast-navigation-js
-   Recast Navigation:
    https://github.com/recastnavigation/recastnavigation

Dùng để: - Tạo navigation mesh từ geometry. - Tìm đường từ vị trí hiện
tại đến target. - Tránh khu vực không thể đi. - Hỗ trợ nhiều nhân vật đi
trong môi trường.

Một số khái niệm: - NavMesh: bề mặt mà nhân vật có thể đi. - Path query:
tìm đường. - Crowd: điều phối nhiều agent và tránh nhau.

Pathfinding không tự điều khiển xương nhân vật. Kết quả đường đi cần
được chuyển thành vận tốc/hướng di chuyển, sau đó phối hợp với
locomotion animation và physics character controller.

------------------------------------------------------------------------

## 6. Cinematic camera và timeline

### 6.1 GSAP

-   Website: https://gsap.com/
-   Docs: https://gsap.com/docs/v3/

Dùng cho: - Animate camera position/rotation. - Animate object
transforms. - Điều phối chuyển động theo timeline. - Easing và
sequencing. - Đồng bộ nhiều hành động.

GSAP phù hợp khi muốn AI sinh timeline bằng code.

### 6.2 Theatre.js

-   Website: https://www.theatrejs.com/
-   Docs: https://www.theatrejs.com/docs/latest

Dùng cho: - Timeline có giao diện trực quan. - Keyframe camera và
object. - Chỉnh sửa chuyển động thủ công sau khi Agent tạo. - Xem lại và
tinh chỉnh shot.

Theatre.js phù hợp nếu bạn muốn có một công cụ kiểu mini film editor.
Kiểm tra khả năng tích hợp với phiên bản Three.js/R3F đang dùng trước
khi chốt.

### 6.3 Three.js Camera và controls

-   OrbitControls:
    https://threejs.org/docs/#examples/en/controls/OrbitControls
-   Camera: https://threejs.org/docs/#api/en/cameras/PerspectiveCamera

Các loại shot nên đưa vào API cấp cao: - Wide shot. - Medium shot. -
Close-up. - Over-the-shoulder. - Tracking shot. - Dolly in/out. - Pan và
tilt. - Follow camera.

Không nên để AI trực tiếp tạo hàng trăm keyframe tùy ý. Hãy cung cấp
camera presets và shot templates có tham số.

------------------------------------------------------------------------

## 7. Rendering, ánh sáng và hậu kỳ

### 7.1 PBR và physically based materials

Three.js có `MeshStandardMaterial` và `MeshPhysicalMaterial` để xây dựng
vật liệu PBR.

Nên chuẩn hóa material parameters: - Base color/albedo. - Roughness. -
Metalness. - Normal map. - Ambient occlusion map. - Emissive map. -
Transmission/clearcoat khi phù hợp.

Tài liệu:
https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

### 7.2 HDRI và image-based lighting

Dùng HDR environment map để tạo ánh sáng phản xạ và môi trường chân thực
hơn.

Drei có `Environment` cho R3F. Với Three.js thuần, tìm hiểu
`PMREMGenerator` và `RGBELoader`.

Tài liệu: - https://threejs.org/docs/#api/en/extras/PMREMGenerator -
https://threejs.org/docs/#examples/en/loaders/RGBELoader

Nguồn HDRI: - Poly Haven: https://polyhaven.com/hdris

Kiểm tra giấy phép của từng asset trước khi phân phối sản phẩm.

### 7.3 Post-processing

-   Three.js postprocessing examples:
    https://threejs.org/examples/?q=postprocessing
-   pmndrs postprocessing: https://github.com/pmndrs/postprocessing
-   React wrapper: https://github.com/pmndrs/react-postprocessing

Hiệu ứng có thể xem xét: - Bloom. - Depth of Field. - Vignette. - Tone
mapping. - Color grading. - SSAO. - Motion blur (tùy pipeline).

Không nên bật tất cả hiệu ứng. Hiệu ứng quá mạnh có thể làm ảnh mất tự
nhiên và tốn GPU. Hãy xây preset theo phong cách phim và kiểm tra chất
lượng ở độ phân giải đầu ra.

### 7.4 Texture và model optimization

  ----------------------------------------------------------------------------------------------
  Công cụ                 Chức năng               Link
  ----------------------- ----------------------- ----------------------------------------------
  glTF Transform          Tối ưu, nén, xử lý      https://gltf-transform.dev/
                          GLB/glTF                

  gltfjsx                 Chuyển GLTF thành React https://github.com/pmndrs/gltfjsx
                          component               

  Draco                   Nén geometry            https://google.github.io/draco/

  KTX-Software            Texture compression /   https://github.com/KhronosGroup/KTX-Software
                          KTX2                    
  ----------------------------------------------------------------------------------------------

Lưu ý: gltfjsx hữu ích với R3F, không cần thiết cho Three.js thuần.
Draco và KTX2 cần cấu hình loader tương ứng.

------------------------------------------------------------------------

## 8. Asset creation và nguồn tài nguyên 3D

AI Agent không nên tự dựng mọi thứ từ primitive. Hãy xây asset library
có metadata và giấy phép rõ ràng.

### Công cụ tạo/chỉnh sửa

  ---------------------------------------------------------------------------------------------------------
  Công cụ                 Vai trò                 Link
  ----------------------- ----------------------- ---------------------------------------------------------
  Blender                 Modeling, rigging, UV,  https://www.blender.org/
                          animation, bake, export 
                          GLB                     

  Houdini                 Procedural modeling,    https://www.sidefx.com/
                          simulation, VFX         

  Substance 3D Painter    Texture/material        https://www.adobe.com/products/substance3d-painter.html
                          authoring               
  ---------------------------------------------------------------------------------------------------------

### Nguồn model và texture

  --------------------------------------------------------------------------
  Nguồn                   Loại asset              Link
  ----------------------- ----------------------- --------------------------
  Poly Haven              HDRI, texture, model    https://polyhaven.com/

  ambientCG               PBR materials,          https://ambientcg.com/
                          textures, HDRI          

  Sketchfab               Model 3D đa dạng        https://sketchfab.com/

  Kenney                  Game-ready assets,      https://kenney.nl/assets
                          nhiều asset đơn giản    
  --------------------------------------------------------------------------

Trước khi đưa asset vào sản phẩm, kiểm tra license, attribution, quyền
sử dụng thương mại và điều kiện redistribution.

------------------------------------------------------------------------

## 9. Xuất video

Three.js không tự cung cấp một pipeline dựng phim hoàn chỉnh như phần
mềm video editor.

Workflow đề xuất:

1.  Xác định frame rate, ví dụ 24 FPS.
2.  Chạy simulation bằng fixed timestep.
3.  Đặt timeline ở thời điểm của từng frame.
4.  Render từng frame thành PNG hoặc EXR.
5.  Ghép frame bằng FFmpeg.
6.  Trộn âm thanh và hậu kỳ nếu cần.

Ví dụ ghép PNG sequence thành MP4:

``` bash
ffmpeg -framerate 24 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 output.mp4
```

Có thể tìm hiểu: - FFmpeg: https://ffmpeg.org/ - Playwright:
https://playwright.dev/ (tự động hóa Chromium để render scene trong
browser) - WebGLRenderer:
https://threejs.org/docs/#api/en/renderers/WebGLRenderer

**Lưu ý:** Browser renderer có giới hạn về GPU, WebGL context, memory và
độ ổn định khi render dài. Nên thử nghiệm quy trình render frame có thể
khởi động lại và render tiếp từ frame bị lỗi.

------------------------------------------------------------------------

## 10. AI Agent integration: phần tạo khác biệt của dự án

Không nên cho Agent tự viết toàn bộ scene và logic vật lý từ đầu mỗi
lần. Hãy xây một API/DSL ổn định.

Ví dụ DSL mô tả hành động:

``` json
{
  "scene": "living_room",
  "characters": ["person_01"],
  "actions": [
    {
      "type": "walk_to",
      "actor": "person_01",
      "target": "coffee_table",
      "speed": 1.2
    },
    {
      "type": "reach",
      "actor": "person_01",
      "target": "coffee_cup",
      "hand": "right"
    },
    {
      "type": "pickup",
      "actor": "person_01",
      "object": "coffee_cup"
    },
    {
      "type": "place",
      "actor": "person_01",
      "object": "coffee_cup",
      "target": "coffee_table"
    }
  ]
}
```

API runtime có thể cung cấp:

``` typescript
scene.createCharacter(...)
scene.createObject(...)
character.moveTo(...)
character.playAnimation(...)
character.reachFor(...)
character.pickUp(...)
character.release(...)
camera.createShot(...)
timeline.addAction(...)
simulation.step(...)
renderer.renderFrame(...)
validator.checkScene(...)
```

Đây là API minh họa cần tự xây, không phải API có sẵn của Three.js.

### Validation và feedback loop

Sau khi thực thi action, runtime nên trả về trạng thái có cấu trúc:

``` json
{
  "action": "walk_to",
  "status": "completed",
  "position": [2.5, 0, 1.2],
  "collisions": [],
  "warnings": []
}
```

Nên xây các validator riêng: - Object có xuyên collider không? -
Character có đi ra khỏi NavMesh không? - Animation có kết thúc đúng thời
điểm không? - Chân có trượt khi đang chống đất không? - Tay có chạm
target không? - Vật thể sau khi thả có ổn định không? - Camera có nhìn
thấy chủ thể không?

Physics engine không tự đánh giá được toàn bộ chất lượng diễn xuất. Các
kiểm tra về foot sliding, framing và chất lượng hình ảnh cần logic
riêng.

------------------------------------------------------------------------

## 11. Thứ tự triển khai MVP

### Phase 1 --- World Builder

-   [ ] Three.js + TypeScript.
-   [ ] Tạo scene, camera, lights.
-   [ ] Load GLB.
-   [ ] HDRI và PBR materials.
-   [ ] Tạo phòng, sàn, tường, bàn, ghế.
-   [ ] Render preview.

**Kết quả:** Agent có thể tạo một bối cảnh 3D từ scene description.

### Phase 2 --- Physics

-   [ ] Tích hợp Rapier.
-   [ ] Collider cho environment và props.
-   [ ] Gravity và rigid body.
-   [ ] Collision events.
-   [ ] Fixed timestep.
-   [ ] Kiểm tra vật thể rơi, va chạm và đặt lên bàn.

**Kết quả:** Vật thể có hành vi vật lý thay vì chỉ di chuyển theo tọa
độ.

### Phase 3 --- Character

-   [ ] Import humanoid GLB.
-   [ ] AnimationMixer.
-   [ ] Idle, walk, run, sit.
-   [ ] Animation blending.
-   [ ] NavMesh và pathfinding.
-   [ ] Hand IK / Foot IK.
-   [ ] Pickup và release object.

**Kết quả:** Nhân vật di chuyển và tương tác cơ bản.

### Phase 4 --- Cinematic

-   [ ] Camera shot presets.
-   [ ] Camera timeline.
-   [ ] GSAP hoặc Theatre.js.
-   [ ] Lighting presets.
-   [ ] Postprocessing.
-   [ ] Render frame sequence.
-   [ ] FFmpeg export.

**Kết quả:** Tạo được một đoạn phim 3D ngắn.

### Phase 5 --- AI Film Director

-   [ ] Scene DSL.
-   [ ] Action planner.
-   [ ] Asset retrieval.
-   [ ] Action executor.
-   [ ] Scene validator.
-   [ ] Render preview và feedback loop.
-   [ ] Tự chia kịch bản thành shot.
-   [ ] Render và ghép phim.

**Kết quả:** Agent nhận kịch bản, dựng cảnh, điều phối nhân vật, quay và
xuất video.

------------------------------------------------------------------------

## 12. Các quyết định kỹ thuật cần chốt

Trước khi cài toàn bộ stack, hãy quyết định:

1.  **Three.js thuần hay React Three Fiber?**

    -   App có editor, asset browser, inspector và UI: ưu tiên R3F.
    -   Runtime render thuần, ít UI: Three.js + TypeScript.

2.  **Physics:** bắt đầu với Rapier. Chỉ đổi khi benchmark cho thấy
    thiếu tính năng hoặc hiệu năng.

3.  **Character:** chọn một skeleton chuẩn và thử ít nhất một model +
    một bộ animation trước khi xây hệ thống retargeting.

4.  **Timeline:** chọn GSAP nếu chủ yếu điều khiển bằng code; chọn
    Theatre.js nếu cần timeline trực quan. Có thể phối hợp nhưng phải
    phân quyền rõ ràng.

5.  **Render:** xác định sớm độ phân giải, FPS, thời lượng shot và cách
    render frame. Đừng đợi đến cuối mới kiểm tra khả năng xuất video.

## 13. Kết luận

Stack khởi đầu được khuyến nghị:

``` text
TypeScript
+ Three.js
+ React Three Fiber (nếu dùng React)
+ Drei (nếu dùng R3F)
+ Rapier
+ Recast Navigation
+ GLB / Mixamo
+ AnimationMixer
+ IK
+ GSAP hoặc Theatre.js
+ PBR / HDRI
+ Postprocessing
+ Blender
+ glTF Transform
+ FFmpeg
```

**Nguyên tắc thiết kế:** Three.js render thế giới; Rapier mô phỏng vật
lý; NavMesh tìm đường; animation và IK điều khiển cơ thể; timeline điều
phối diễn xuất và camera; AI Agent chỉ lập kế hoạch và gọi các API cấp
cao. Đây là cách giảm việc Agent tự bịa tọa độ và chuyển động, đồng thời
giúp kết quả nhất quán, có thể kiểm thử và tái sử dụng.
