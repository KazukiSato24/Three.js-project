import './style.css'
import * as THREE from "three";

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
  color: "6c99b2",
  roughness: 0.336,
  flatShading: true,
  metalness: 0.5,
})

//メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

//メッシュの配置設定
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 2);

scene.add(mesh1, mesh2, mesh3, mesh4);

//ライトを追加
const directionallight = new THREE.DirectionalLight("ffffff", 2);
directionallight.position.set(0.5, 1, 0);
scene.add(directionallight);

renderer.render(scene, camera);
