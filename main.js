import './style.css'
import * as THREE from "three";

//キャンバスの取得
const canvas = document.querySelector(".webgl")

//シーン
const scene = new THREE.Scene();

//サイズ設定
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(35,
  sizes.width / sizes.height,
  35,
  100
);

camera.position.z = 6
scene.add(camera)

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio
