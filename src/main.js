import './style.css'
import * as THREE from 'three'
// __controls_import__
// __gui_import__

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'

/**
 * Debug
 */
// __gui__
const configs = {
	example: 5,
}
const gui = new dat.GUI()
gui.add(configs, 'example', 0, 10, 0.1).onChange((val) => console.log(val))

/**
 * Scene
 */
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xdedede)

// __box__
/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.ShaderMaterial({
	vertexShader: /* glsl */ `

	uniform float uTime;

	void main() {

		vec3 pos = position;

		pos.z += sin(pos.x * 20. + uTime * 2.) * 0.05;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	}
	`,
	fragmentShader: /* glsl */ `

	uniform float uTime;

	void main() {

		float r = sin(uTime) * 0.5 + 0.5;
		float g = sin(uTime + 2.) * 0.5 + 0.5;
		float b = sin(uTime + 4.) * 0.5 + 0.5;
		gl_FragColor = vec4(r,g,b,1.0);
	}
	`,
	uniforms: {
		uTime: { value: 0 },
	},
	wireframe: true,
})
const geometry = new THREE.PlaneGeometry(1, 1, 50, 50)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0.3, 0, 1.5)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
// __helper_axes__
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
// __controls__
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

/**
 * Three js Clock
 */
// __clock__
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	const time = clock.getElapsedTime()

	material.uniforms.uTime.value = time

	// __controls_update__
	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height

	// camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
