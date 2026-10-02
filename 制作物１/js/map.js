import * as THREE from "three";

import { OrbitControls } from
    "three/addons/controls/OrbitControls.js";

import { GLTFLoader } from
    "three/addons/loaders/GLTFLoader.js";


// ========================================
// 1. HTMLの要素を取得
// ========================================

const container =
    document.getElementById("map-container");

const infoTitle =
    document.getElementById("info-title");

const infoText =
    document.getElementById("info-text");

const infoLink =
    document.getElementById("info-link");

const infoClose =
    document.getElementById("map-info-close");

const resetButton =
    document.getElementById("map-reset");


// ========================================
// 2. 3Dシーンを作成
// ========================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0xe6e9e4);

// 3Dマップ全体をまとめるグループ
const mapGroup = new THREE.Group();

scene.add(mapGroup);

// ========================================
// 3. カメラ
// ========================================

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

// 初期視点
const initialCameraPosition =
    new THREE.Vector3(75, 85, 95);

const initialTarget =
    new THREE.Vector3(0, 0, 0);

camera.position.copy(initialCameraPosition);


// ========================================
// 4. レンダラー
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1;

container.appendChild(renderer.domElement);


// ========================================
// 5. カメラ操作
// ========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.copy(initialTarget);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.minDistance = 25;
controls.maxDistance = 180;

controls.maxPolarAngle = Math.PI / 2.05;


// ========================================
// 6. ライト
// ========================================

const ambientLight =
    new THREE.HemisphereLight(
        0xffffff,
        0xaaa08d,
        2.2
    );

scene.add(ambientLight);


const sun = new THREE.DirectionalLight(
    0xffffff,
    3
);

sun.position.set(40, 80, 30);

scene.add(sun);


// ========================================
// 7. 地面
// ========================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 200),

    new THREE.MeshStandardMaterial({
        color: 0xe6e2d8,
        roughness: 1
    })
);

ground.rotation.x = -Math.PI / 2;

ground.position.set(
    0, -0.2, 0
);

mapGroup.add(ground);


// ========================================
// 8. 道路を作る関数
// ========================================

function makeRoad(
    x,
    z,
    width,
    length,
    rotation = 0,
    color = 0xbfc6c9
) {

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(
            width,
            length
        ),

        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 1
        })
    );

    road.rotation.x = -Math.PI / 2;

    road.rotation.z = rotation;

    road.position.set(
        x,
        0,
        z
    );

    mapGroup.add(road);

    return road;

}


// ========================================
// 9. 花月川
// ========================================

const river = new THREE.Mesh(
    new THREE.PlaneGeometry(
        180,
        15
    ),

    new THREE.MeshStandardMaterial({
        color: 0x7bc9dc,
        roughness: 0.35,
        metalness: 0
    })
);

river.rotation.x = -Math.PI / 2;

river.position.set(
    0,
    0.05,
    -90
);

mapGroup.add(river);


// 川岸
makeRoad(
    0,
    -82,
    180,
    1.5,
    0,
    0xb0c0c5
);


// ========================================
// 10. 豆田町の道路
// ========================================

// 南北方向の道路（縦の道を2本に変更）

makeRoad(-30, 0, 6, 270);
makeRoad(30, 0, 6, 270);


// 東西方向の道路（変更なし）

makeRoad(0, -30, 115, 6);
makeRoad(0, 10, 115, 6);
makeRoad(0, 70, 115, 6);
makeRoad(0, 110, 65, 6);

// 花月川のすぐ下に横道を1本追加
makeRoad(0, -75, 115, 6);

// ========================================
// 11. クリック対象を管理
// ========================================

const clickableObjects = [];


// ========================================
// 12. 観光スポットのデータ
// ========================================

// 北は -Z、南は +Z
// 東は +X、西は -X
//
// 座標・建物サイズは仮配置です。
// 地図に合わせて後から変更してください。

const touristSpots = [

    // -------------------------------
    // 北側
    // -------------------------------

    {
        id: "kuncho",

        name: "薫長酒蔵資料館",

        description:
            "豆田町にある歴史ある酒蔵。酒造りの歴史や文化に触れられる観光スポットです。",

        x: 19,
        z: -65,

        w: 13,
        h: 8,
        d: 11,

        color: 0xc7ae8d,
        roofColor: 0x45464a,

        link: "spot.html"
    },


    // -------------------------------
    // 中央・西側
    // -------------------------------

    {
        id: "nihonmarukan",

        name: "日本丸館",

        description:
            "豆田町の歴史や町並みについて知ることができる施設です。",

        x: 40,
        z: 30,

        w: 12,
        h: 7,
        d: 10,

        color: 0xc6b69a,
        roofColor: 0x484848,

        link: "spot.html"
    },

    // -------------------------------
    // 中央・東側
    // -------------------------------

    {
        id: "hina",

        name: "日田醤油 雛御殿",

        description:
            "日田醤油にある雛御殿。豆田町の観光スポットのひとつです。",

        x: -40,
        z: -15,

        w: 12,
        h: 7,
        d: 10,

        color: 0xcbb99b,
        roofColor: 0x4d4d4d,

        link: "spot.html"
    },


    // -------------------------------
    // 南側
    // -------------------------------

    {
        id: "kusano",

        name: "草野本家",

        description:
            "豆田町を代表する歴史的な建物。伝統的な町家の外観を楽しめる観光スポットです。",

        x: -42,
        z: 130,

        w: 15,
        h: 9,
        d: 12,

        color: 0xc5b08d,
        roofColor: 0x454545,

        link: "spot.html"
    },

    {
        id: "rekishi",

        name: "豆田まちづくり歴史交流館",

        description:
            "豆田町の歴史や町並みについて知ることができる施設です。",

        x: -20,
        z: 90,

        w: 12,
        h: 7,
        d: 10,

        color: 0xc6b69a,
        roofColor: 0x484848,

        link: "spot.html"
    },

    {
        id: "tenryo",

        name: "天領日田資料館",

        description:
            "日田の歴史や文化を紹介する資料館です。",

        x: -40,
        z: 105,

        w: 12,
        h: 7,
        d: 10,

        color: 0xc9b89a,
        roofColor: 0x4c4b48,

        link: "spot.html"
    },


    // -------------------------------
    // 東側・南東側
    // -------------------------------


];


// ========================================
// 13. 建物を作成する関数
// ========================================

function makeSpot(data) {

    const group = new THREE.Group();

    group.position.set(
        data.x,
        0,
        data.z
    );


    // 建物本体

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            data.w,
            data.h,
            data.d
        ),

        new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 1
        })
    );

    body.position.y = data.h / 2;

    body.userData.name = data.name;

    body.userData.description =
        data.description;

    body.userData.link = data.link;

    group.add(body);

    clickableObjects.push(body);


    // 屋根

    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(
            data.w + 1.2,
            0.8,
            data.d + 1.2
        ),

        new THREE.MeshStandardMaterial({
            color: data.roofColor,
            roughness: 1
        })
    );

    roof.position.y = data.h + 0.4;

    roof.userData.name = data.name;

    roof.userData.description =
        data.description;

    roof.userData.link = data.link;

    group.add(roof);

    clickableObjects.push(roof);


    // 建物正面の看板

    const marker = new THREE.Mesh(
        new THREE.BoxGeometry(
            Math.min(data.w * 0.65, 6),
            0.8,
            0.3
        ),

        new THREE.MeshStandardMaterial({
            color: 0x76543a
        })
    );

    marker.position.set(
        0,
        data.h * 0.7,
        data.d / 2 + 0.2
    );

    marker.userData.name = data.name;

    marker.userData.description =
        data.description;

    marker.userData.link = data.link;

    group.add(marker);

    clickableObjects.push(marker);


    // シーンに追加

    mapGroup.add(group);

    return group;

}


// ========================================
// 14. 観光スポットを配置
// ========================================

touristSpots.forEach((spot) => {

    makeSpot(spot);

});


// ========================================
// 15. 公園を配置
// ========================================

const siteMarkers = [


];


siteMarkers.forEach((data) => {

    const park = new THREE.Mesh(
        new THREE.BoxGeometry(
            data.w,
            0.25,
            data.d
        ),

        new THREE.MeshStandardMaterial({
            color: 0xa8c89b,
            roughness: 1
        })
    );

    park.position.set(
        data.x,
        0.15,
        data.z
    );

    park.userData.name = data.name;

    park.userData.description =
        data.name + "の位置を示しています。";

    park.userData.link = "spot.html";

    mapGroup.add(park);

    clickableObjects.push(park);

});


// ========================================
// 16. 施設名ラベルを作る
// ========================================

function makeSpotLabel(
    name,
    x,
    z
) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");


    // 背景

    ctx.fillStyle =
        "rgba(255,255,255,0.95)";

    ctx.beginPath();

    ctx.roundRect(
        4, 4,
        504, 120,
        18
    );

    ctx.fill();


    // 枠線

    ctx.strokeStyle = "#c8c8c8";

    ctx.lineWidth = 3;

    ctx.stroke();


    // 施設名

    ctx.fillStyle = "#333333";

    ctx.font = "bold 32px sans-serif";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        name,
        256,
        64,
        480
    );


    const texture =
        new THREE.CanvasTexture(canvas);

    texture.colorSpace =
        THREE.SRGBColorSpace;


    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });


    const label =
        new THREE.Sprite(material);

    label.position.set(
        x,
        14,
        z
    );

    label.scale.set(
        15,
        3.75,
        1
    );

    mapGroup.add(label);

}


// 観光スポットのラベル

touristSpots.forEach((spot) => {

    makeSpotLabel(
        spot.name,
        spot.x,
        spot.z
    );

});


// 公園のラベル

siteMarkers.forEach((spot) => {

    makeSpotLabel(
        spot.name,
        spot.x,
        spot.z
    );

});


// ========================================
// 17. GLBを読み込む関数
// ========================================

const loader = new GLTFLoader();

function loadSpotGLB(
    file,
    data,
    scale = 1
) {

    loader.load(

        file,

        (gltf) => {

            const model = gltf.scene;

            model.position.set(
                data.x,
                0,
                data.z
            );

            model.scale.setScalar(scale);


            // モデル内のメッシュに
            // 施設情報を設定

            model.traverse((child) => {

                if (child.isMesh) {

                    child.userData.name =
                        data.name;

                    child.userData.description =
                        data.description;

                    child.userData.link =
                        data.link;

                    clickableObjects.push(child);

                }

            });


            scene.add(model);

        },

        undefined,

        (error) => {

            console.error(
                "GLBの読み込みエラー:",
                file,
                error
            );

        }

    );

}


// ========================================
// 18. BlenderのGLBを使用する場合
// ========================================

// Blenderで作ったモデルが完成したら、
// 該当施設の makeSpot() を外して、
// 以下のようにGLBを読み込みます。

/*
const kusano = touristSpots.find(
    spot => spot.id === "kusano"
);

loadSpotGLB(
    "models/kusano.glb",
    kusano,
    1
);
*/


// ========================================
// 19. 建物のクリック判定
// ========================================

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();


// 建物をクリックしたときの処理

renderer.domElement.addEventListener(
    "click",

    (event) => {

        const rect =
            renderer.domElement.getBoundingClientRect();


        pointer.x =
            ((event.clientX - rect.left) /
                rect.width) * 2 - 1;

        pointer.y =
            -((event.clientY - rect.top) /
                rect.height) * 2 + 1;


        raycaster.setFromCamera(
            pointer,
            camera
        );


        const hits =
            raycaster.intersectObjects(
                clickableObjects,
                false
            );


        if (hits.length > 0) {

            const object =
                hits[0].object;

            const name =
                object.userData.name;

            const description =
                object.userData.description;

            const link =
                object.userData.link;


            if (name) {

                infoTitle.textContent =
                    name;

                infoText.textContent =
                    description || name;

                infoLink.href =
                    link || "spot.html";

                infoLink.style.display =
                    "inline-block";

            }

        }

    }

);


// ========================================
// 20. 説明パネルを閉じる
// ========================================

infoClose.addEventListener(
    "click",

    () => {

        infoTitle.textContent =
            "豆田町 3D MAP";

        infoText.textContent =
            "建物をクリックすると、観光スポットの説明が表示されます。";

        infoLink.style.display =
            "none";

    }

);


// ========================================
// 21. 視点リセット
// ========================================

resetButton.addEventListener(
    "click",

    () => {

        camera.position.copy(
            initialCameraPosition
        );

        controls.target.copy(
            initialTarget
        );

        controls.update();

    }

);


// ========================================
// 22. 画面サイズ変更
// ========================================

window.addEventListener(
    "resize",

    () => {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;


        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }

);


// ========================================
// 23. マップ全体の位置調整
// ========================================

mapGroup.position.set(
    0,
    0,
    -50
);


// ========================================
// 24. アニメーション
// ========================================

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );

}

animate();