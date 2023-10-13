let isDragging = false;
let previousMouseX;
let previousMouseY;
let rotationSpeedX = 0;
let rotationSpeedY = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('PIA17386-1.jpg', (texture) => {
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const animate = () => {
        requestAnimationFrame(animate);
        // Adjust rotation for slower Jupiter-like rotation
        earth.rotation.x += 0.001; // Adjust the rotation speed as needed
        earth.rotation.y += 0.001; // Adjust the rotation speed as needed

        if (!isDragging) {
            // Apply inertia and damping
            rotationSpeedX *= 0.98;
            rotationSpeedY *= 0.98;
            earth.rotation.x += rotationSpeedY;
            earth.rotation.y += rotationSpeedX;
        }
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    renderer.domElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        rotationSpeedX = 0;
        rotationSpeedY = 0;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const currentMouseX = event.clientX;
            const currentMouseY = event.clientY;
            const deltaX = currentMouseX - previousMouseX;
            const deltaY = currentMouseY - previousMouseY;
            rotationSpeedX = deltaX * 0.005;
            rotationSpeedY = deltaY * 0.005;
            previousMouseX = currentMouseX;
            previousMouseY = currentMouseY;
        }
    });
});
