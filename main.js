import './style.css'
import * as THREE from "three";
import * as dat from "lil-gui";

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

camera.position.z = 6
scene.add(camera)

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //背景設定
  alpha: true
});

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
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

//メッシュの配置設定
mesh1.position.set(0, -2, -3);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 2, -5);
mesh4.position.set(-3, 1, -4);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

//ライトを追加
const directionallight = new THREE.DirectionalLight("ffffff", 2);
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

//アニメーション
const animate = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);

  //メッシュを回転させる for文
  for (const mesh of meshes) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }
};

animate();
