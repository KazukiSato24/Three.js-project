import './style.css'
import * as THREE from "three";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

//フォント
const fontLoader = new FontLoader();
console.log(fontLoader);

fontLoader.load('./fonts/droid/droid_serif_regular.typeface.json', function (font) {
  console.log(font);
  const textGeometry = new TextGeometry('SAUVAGE', {
    font: font,
    size: 0.5,
    height: 0.5,
  });

  //フォントマテリアル
  const textMaterial = new THREE.MeshPhysicalMaterial({
    emissive: "#d3d9d9",
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
  });

  //メッシュ
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  textGeometry.center();
});


//UIデバックを実装
const gui = new dat.GUI();

//キャンバスの取得
const canvas = document.querySelector(".webgl");

//シーン
const scene = new THREE.Scene();

//サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 7
scene.add(camera)

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //背景設定
  alpha: true
});
console.log(renderer);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
//マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#8d96b9",
  roughness: 0.336,
  flatShading: true,
  metalness: 0.5,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(3).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

//メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), material);

//メッシュの配置設定
mesh1.position.set(0, -2, -3);
mesh2.position.set(-1, -1, -3);
mesh3.position.set(2, 2, -5);
mesh4.position.set(-3, 2, -4);
scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

//ライトを追加
const directionallight = new THREE.DirectionalLight("#8d96b9", 5);
directionallight.position.set(0.5, 1, 0);
scene.add(directionallight);

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイールを実装
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002;
  console.log(speed);
});

function rot() {
  rotation += speed;
  speed *= 0.93;

  //ジオメトリ全体を回転させる
  mesh1.position.x = 0 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -2 + 3.8 * Math.sin(rotation);
  mesh2.position.x = -1 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -2 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 0 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -2 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -2 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));
  window.requestAnimationFrame(rot);
}

rot();
//アニメーション
//デルタ
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);

  let getDeltaTime = clock.getDelta();

  //メッシュを回転させる for文
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.2 * getDeltaTime;
  }
};

animate();
