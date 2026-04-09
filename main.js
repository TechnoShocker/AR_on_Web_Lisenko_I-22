import * as THREE from 'three';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';

console.log('THREE:', typeof THREE);
console.log('MindARThree:', typeof MindARThree);

async function initAR() {
    try {
        // === Створення MindAR додатку з Three.js ===
        // Використовуємо готовий приклад маркера (картка)
        const mindarThree = new MindARThree({
            container: document.querySelector("#container"),
            imageTargetSrc: 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind',
        });

        // Отримуємо сцену та камеру з MindAR
        const { renderer, scene, camera } = mindarThree;

        // === Освітлення для матеріалів ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-3, 3, 3);
        scene.add(pointLight);

        // === Контейнер для об'єктів на маркері ===
        const anchor = mindarThree.addAnchor(0);

        // === Три різні геометричні об'єкти з різними матеріалами ===

        // 1. Куб - MeshStandardMaterial (зелений, металевий)
        const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const cubeMaterial = new THREE.MeshStandardMaterial({
            color: 0x2ecc71,
            metalness: 0.7,
            roughness: 0.3
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-0.7, 0, 0);
        anchor.group.add(cube);

        // 2. Сфера - MeshPhongMaterial (синя, глянцева)
        const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            shininess: 100,
            specular: 0x444444
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0.25, 0);
        anchor.group.add(sphere);

        // 3. Тор (Torus) - MeshLambertMaterial (червоний, матовий)
        const torusGeometry = new THREE.TorusGeometry(0.2, 0.08, 16, 100);
        const torusMaterial = new THREE.MeshLambertMaterial({
            color: 0xe74c3c,
            emissive: 0x330000,
            emissiveIntensity: 0.2
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(0.7, 0, 0);
        anchor.group.add(torus);

        // === Ховаємо повідомлення про завантаження ===
        document.getElementById('loading').style.display = 'none';

        // === Запуск MindAR ===
        await mindarThree.start();

        // === Анімація об'єктів ===
        let time = 0;

        renderer.setAnimationLoop(() => {
            time += 0.02;

            // Обертання куба
            cube.rotation.x = time;
            cube.rotation.y = time * 0.7;

            // Плаваюча сфера
            sphere.position.y = 0.25 + Math.sin(time) * 0.1;

            // Обертання тора
            torus.rotation.x = time * 0.8;
            torus.rotation.z = time * 0.5;

            renderer.render(scene, camera);
        });

    } catch (error) {
        console.error('MindAR помилка:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = '<strong>Помилка!</strong><br><br>' +
            error.message + '<br><br>' +
            'Можливі рішення:<br>' +
            '1. Дозвольте доступ до камери в браузері<br>' +
            '2. Використовуйте HTTPS або localhost<br>' +
            '3. Наведіть камеру на зображення маркера';
    }
}

initAR();
