import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Global variables with proper types
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls | null = null;
let heart: THREE.Object3D;
let heartGroup: THREE.Group;
let animationId: number | undefined;
let isAnimating: boolean = true;
let fbxLoader: FBXLoader;
let mixer: THREE.AnimationMixer | null = null;
let heartBeatAction: THREE.AnimationAction | null = null;
let clock: THREE.Clock;
let textureLoader: THREE.TextureLoader;
let heartTexture: THREE.Texture | null = null;

// Initialize the 3D scene
function init(): void {
    console.log('Initializing 3D scene...');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f8ff); // Light blue-white background (AliceBlue)
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 2.5); // Start more zoomed in (was 5, now 2.5)
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to DOM
    const container = document.getElementById('container');
    if (container) {
        container.appendChild(renderer.domElement);
    }
    
    // Create controls
    console.log('Creating OrbitControls...');
    try {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1; // Allow closer zoom (was 2)
        controls.maxDistance = 15; // Reduced max zoom out (was 20)
        controls.maxPolarAngle = Math.PI;
        console.log('OrbitControls created successfully');
    } catch (error) {
        console.error('Error creating OrbitControls:', error);
        // Create a simple fallback camera movement
        createFallbackControls();
    }
    
    // Initialize FBX loader, texture loader, and animation clock
    console.log('Initializing loaders...');
    try {
        fbxLoader = new FBXLoader();
        textureLoader = new THREE.TextureLoader();
        clock = new THREE.Clock();
        
        // Load the heart texture
        loadHeartTexture();
        
        console.log('Loaders initialized successfully');
    } catch (error) {
        console.error('Error initializing loaders:', error);
        createFallbackHeart();
        return;
    }
    
    // Add lighting
    addLighting();
    
    // Add ambient particles
    addParticles();
    
    // Load the heart model
    loadHeartModel();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Create fallback controls if OrbitControls fails
function createFallbackControls(): void {
    console.log('Creating fallback controls...');
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    renderer.domElement.addEventListener('mousedown', (event: MouseEvent) => {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
        if (isMouseDown) {
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            camera.position.x += deltaX * 0.01;
            camera.position.y -= deltaY * 0.01;
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });
    
    renderer.domElement.addEventListener('wheel', (event: WheelEvent) => {
        const zoom = event.deltaY > 0 ? 1.1 : 0.9;
        camera.position.multiplyScalar(zoom);
    });
}

// Create a fallback heart if GLB loading fails
function createFallbackHeart(): void {
    console.log('Creating fallback heart...');
    
    // Create a simple heart shape
    const heartGeometry = new THREE.SphereGeometry(1, 32, 32);
    const heartMaterial = createHeartMaterial();
    
    heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.castShadow = true;
    heart.receiveShadow = true;
    
    heartGroup = new THREE.Group();
    heartGroup.add(heart);
    scene.add(heartGroup);
    
    // Hide loading message
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    console.log('Fallback heart created');
}

// Load the rigged heart model
function loadHeartModel(): void {
    console.log('Starting to load FBX heart model...');
    const loadingElement = document.getElementById('loading');
    
    // Add a timeout in case the loading hangs
    const loadingTimeout = setTimeout(() => {
        console.log('Loading timeout reached, creating fallback heart');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div style="color: #ffaa00; margin-bottom: 15px;">⏰</div>
                Loading taking too long...<br>
                <small>Creating fallback heart model...</small>
            `;
        }
        setTimeout(createFallbackHeart, 1000);
    }, 10000); // 10 second timeout
    
    fbxLoader.load(
        './heart.fbx',
        function (object: THREE.Group) {
            // Successfully loaded the FBX model
            console.log('FBX Heart model loaded successfully!', object);
            clearTimeout(loadingTimeout);
            
            // Start with the original object as heart
            heart = object;
            
            // Get the original object dimensions before any modifications
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Scale to fit nicely in view
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            heart.scale.setScalar(scale);
            
            // Center the heart
            heart.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
            
            // Setup animation mixer for the rigged model
            mixer = new THREE.AnimationMixer(heart);
            
            // Check if the FBX has animations
            if (object.animations && object.animations.length > 0) {
                // Use the first animation (typically the heart beat)
                const heartBeatClip = object.animations[0];
                if (heartBeatClip) {
                    heartBeatAction = mixer.clipAction(heartBeatClip);
                    heartBeatAction.setLoop(THREE.LoopRepeat, Infinity);
                    heartBeatAction.play();
                }
            } else {
                // Create a custom beating animation using scale
                createCustomHeartBeatAnimation();
            }
            
            // Enable shadows and apply materials for all meshes in the model
            object.traverse(function (child: THREE.Object3D) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Apply heart material with texture if available
                    child.material = createHeartMaterial();
                }
            });
            
            // Create a group for the heart
            heartGroup = new THREE.Group();
            heartGroup.add(heart);
            scene.add(heartGroup);
            
            // Heart successfully loaded and configured
            
            // Hide loading message
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
        },
        function (xhr: ProgressEvent<EventTarget>) {
            // Loading progress
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                console.log('Loading progress:', percent + '%');
                if (loadingElement) {
                    loadingElement.innerHTML = `
                        <div class="loading-spinner"></div>
                        Loading Realistic Heart Model... ${percent}%
                    `;
                }
            }
        },
        function (error: unknown) {
            // Error loading
            console.error('Error loading heart model:', error);
            clearTimeout(loadingTimeout);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <div style="color: #ff6b6b; margin-bottom: 15px;">⚠️</div>
                    Error loading heart model:<br>
                    <small>${error instanceof Error ? error.message : 'Unknown error'}</small><br>
                    <small>Creating fallback heart model...</small>
                `;
            }
            // Create fallback heart after a short delay
            setTimeout(createFallbackHeart, 1000);
        }
    );
}

// Load the heart texture
function loadHeartTexture(): void {
    textureLoader.load(
        './corazon_atropellado.jpg',
        function (texture: THREE.Texture) {
            // Successfully loaded texture
            heartTexture = texture;
            
            // Configure texture properties
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.flipY = true; // Flip Y axis for proper FBX texture alignment
        },
        function (_progress: ProgressEvent<EventTarget>) {
            // Loading progress - optional
        },
        function (error: unknown) {
            console.error('Error loading heart texture:', error);
            // Continue without texture - will use default material
        }
    );
}

// Create a heart material with texture if available
function createHeartMaterial(): THREE.MeshPhongMaterial {
    const materialConfig: any = {
        shininess: 80,
        transparent: false,
        side: THREE.DoubleSide, // Ensure both sides are visible
    };
    
    if (heartTexture) {
        // Use the loaded texture
        materialConfig.map = heartTexture;
        materialConfig.color = 0xffffff; // White to show texture colors properly
        materialConfig.emissive = 0x221111; // Subtle red glow
    } else {
        // Fallback to solid red color
        materialConfig.color = 0xff4466;
        materialConfig.emissive = 0x882222;
    }
    
    return new THREE.MeshPhongMaterial(materialConfig);
}


// Create a custom heart beat animation using scale keyframes
function createCustomHeartBeatAnimation(): void {
    if (!heart || !mixer) return;
    
    // Create keyframe tracks for scaling animation
    const times = [0, 0.3, 0.6]; // Animation keyframe times (in seconds)
    const scaleValues = [
        1.0, 1.0, 1.0,    // Normal size
        1.15, 1.15, 1.15, // Expanded (systole)
        1.0, 1.0, 1.0     // Back to normal (diastole)
    ];
    
    // Create scale track
    const scaleTrack = new THREE.VectorKeyframeTrack(
        '.scale', // Target property
        times,
        scaleValues
    );
    
    // Create animation clip
    const heartBeatClip = new THREE.AnimationClip('HeartBeat', 0.6, [scaleTrack]);
    
    // Create and play the animation
    heartBeatAction = mixer.clipAction(heartBeatClip);
    heartBeatAction.setLoop(THREE.LoopRepeat, Infinity);
    heartBeatAction.play();
}

// Add lighting to the scene
function addLighting(): void {
    // Ambient light - much brighter for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased from 0.6 to 0.8
    scene.add(ambientLight);
    
    // Directional light (main light source) - brighter and more intense
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased from 1.2 to 2.0
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Additional directional light from opposite side - brighter
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5); // Increased from 0.8 to 1.5
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Additional directional light from above - new light source
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight3.position.set(0, 10, 0);
    scene.add(directionalLight3);
    
    // Additional directional light from below - new light source
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight4.position.set(0, -10, 0);
    scene.add(directionalLight4);
    
    // Point light for dramatic effect - brighter and closer
    const pointLight = new THREE.PointLight(0xff0066, 1.0, 50); // Increased from 0.5 to 1.0, reduced range
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    // Additional warm point light for better heart visibility
    const warmLight = new THREE.PointLight(0xffaa44, 0.8, 30);
    warmLight.position.set(3, 0, 0);
    scene.add(warmLight);
    
    // Additional cool point light for balance
    const coolLight = new THREE.PointLight(0x4488ff, 0.6, 30);
    coolLight.position.set(-3, 0, 0);
    scene.add(coolLight);
}

// Add floating particles for atmosphere
function addParticles(): void {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        colors[i * 3] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 1] = Math.random() * 0.3;
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// Animation loop
function animate(): void {
    animationId = requestAnimationFrame(animate);
    
    // Update animation mixer for heart beating
    if (mixer && isAnimating) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }
    
    if (isAnimating && heartGroup) {
        // Gentle rotation of the heart
        heartGroup.rotation.y += 0.003;
        
        // Subtle floating motion
        heartGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    // Update controls
    if (controls && controls.update) {
        controls.update();
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Reset camera to default position
function resetCamera(): void {
    camera.position.set(0, 0, 2.5); // Match the new closer starting position
    if (controls && controls.reset) {
        controls.reset();
    }
}

// Toggle heart animation
function toggleAnimation(): void {
    isAnimating = !isAnimating;
    const btn = (event?.target as HTMLButtonElement);
    if (btn) {
        btn.textContent = isAnimating ? 'Pause Animation' : 'Resume Animation';
    }
    
    // Control heart beat animation
    if (heartBeatAction) {
        if (isAnimating) {
            heartBeatAction.paused = false;
        } else {
            heartBeatAction.paused = true;
        }
    }
    
    // Resume animation if it was paused
    if (isAnimating && !animationId) {
        animate();
    }
}

// Make functions globally accessible for HTML buttons
declare global {
    interface Window {
        resetCamera: () => void;
        toggleAnimation: () => void;
    }
}

window.resetCamera = resetCamera;
window.toggleAnimation = toggleAnimation;

// Initialize when page loads
window.addEventListener('load', init);
