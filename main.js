import './style.css'
import * as THREE from "three";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, directionallight, pointLight, controls;
window.addEventListener("load", init);

function init() {

  //サイズ設定
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //シーン
  scene = new THREE.Scene();

  //カメラ
  camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
  );

  //キャンバスの取得
  const canvas = document.querySelector(".webgl");


  camera.position.set(2, 1, 8);
  scene.add(camera)

  //レンダラー
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //背景設定
    alpha: true
  });
  console.log(renderer);

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  //マウス操作
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //UIデバックを実装
  const gui = new dat.GUI();

  //フォント
  const fontLoader = new FontLoader();

  fontLoader.load('./fonts/droid/droid_serif_regular.typeface.json', function (font) {
    console.log(font);
    const textGeometry = new TextGeometry('MOODIFY', {
      font: font,
      size: 0.5,
      height: 0.3,
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

  //オブジェクトを作成
  //マテリアル
  const material = new THREE.MeshPhysicalMaterial({
    color: "#8d96b9",
    roughness: 0.336,
    flatShading: true,
    metalness: 0.7,
  });

  gui.addColor(material, "color");
  gui.add(material, "metalness").min(0).max(3).step(0.001);
  gui.add(material, "roughness").min(0).max(1).step(0.001);

  //メッシュ
  const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 16, 60), material);
  const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), material);
  const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16), material);
  const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), material);
  const mesh5 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), material);
  const mesh6 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16), material);
  const mesh7 = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), material);
  const mesh8 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 16, 60), material);

  //メッシュの配置設定
  mesh1.position.set(4, 2, 0);
  mesh2.position.set(4, -2, 0);
  mesh3.position.set(-4, 2, 0);
  mesh4.position.set(-4, -2, 0);
  mesh5.position.set(4, 2, -5);
  mesh6.position.set(4, -2, -5);
  mesh7.position.set(-4, 2, -5);
  mesh8.position.set(-4, -2, -5);
  scene.add(mesh1, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7, mesh8);
  const meshes = [mesh1, mesh2, mesh3, mesh5, mesh4, mesh6, mesh7, mesh8];

  //地球
  //テクスチャを追加
  const textures = new THREE.TextureLoader().load("./textures/earth.jpg");

  //ジオメトリを作成
  const ballGeometry = new THREE.SphereGeometry(2.5);

  //マテリアルを作成 材質やカラーを設定
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });

  //メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  ballMesh.position.set(0, 0, -3);

  //シーンに載せる
  scene.add(ballMesh);

  function animate() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);

    let getDeltaTime = clock.getDelta();

    //メッシュを回転させる for文
    for (const mesh of meshes) {
      mesh.rotation.x += 0.5 * getDeltaTime;
      mesh.rotation.y += 0.2 * getDeltaTime;
    }

    ballMesh.rotation.y += 0.1 * getDeltaTime;

    pointLight.position.set(
      200 * Math.sin(Date.now() / 500),
      200 * Math.sin(Date.now() / 1000),
      200 * Math.cos(Date.now() / 500)
    );

    controls.update();
  };

  //パーティクル
  const particlesGeometory = new THREE.BufferGeometry();
  const count = 6000;

  const positionArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);

  //パーティクルテクスチャ
  const textureLoader = new THREE.TextureLoader();
  const particlesTexture = textureLoader.load("./textures/light.png");


  //パーティクルマテリアル
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.12,
    sizeAttenuation: true,
    alphaMap: particlesTexture,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particlesGeometory, pointMaterial);
  scene.add(particles);

  for (let i = 0; i < count * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 20;
    colorArray[i] = Math.random();
  }

  particlesGeometory.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  //パーティクルの座標ごとに色を取得
  particlesGeometory.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3)
  );

  //並行光源を追加
  directionallight = new THREE.DirectionalLight("#8d96b9", 5);
  directionallight.position.set(0.5, 1, 0);
  scene.add(directionallight);

  //ポイント光源を追加 地球の周りで動かすためグローバル変数として宣言
  pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);

  //ポイント光源の位置を設定
  pointLight.position.set(-50, -50, -50);

  const clock = new THREE.Clock();

  //ブラウザのリサイズ操作
  function onWindowResize() {
    //サイズのアップデート
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //カメラのアップデート
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //レンダラーのアップデート
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  };

  animate();
  onWindowResize();
}
