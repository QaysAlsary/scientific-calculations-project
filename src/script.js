import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { BufferGeometry, GLSL1, log, TextureLoader, WireframeGeometry } from 'three'
import Rocket from "./physics/rocket"


/**
 * Texture
 */


const textureLoader = new THREE.TextureLoader()
const r = textureLoader.load( '/textures/1.jfif')
// const skytext = textureLoader.load( '/textures/sky.jpg')
const earth = textureLoader.load( '/textures/earth.jpg')
// const color = textureLoader.load('/textures/door/color.jpg')

// /**
//  *  Debug
//  */
// const gui = new dat.GUI()


/**
 *  Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const parameters = {
    po   : 10,
    wingarea : 8,
    massRocket : 300,
    massFuel : 10000,
    Cd :1,
    th :90,
    me : 10,
    fuel_type : 0,
    start: 0,
    a :10,
    status_camera : 0,
    fuel_rate : 1,
    fuel_speed: 100,
    }
    const masss = {
        mass : parameters.massFuel + parameters.massRocket
    }

const mesh = new THREE.Group()
// head
const geometry = new THREE.ConeGeometry( 2, 3, 32 );
const material = new THREE.MeshBasicMaterial( {color: 0x303A43} );
const cone = new THREE.Mesh( geometry, material );
cone.position.y=6.5


// body
const geometry1 = new THREE.CylinderGeometry( 2, 2, 10, 64 );
const material1 = new THREE.MeshBasicMaterial( {
//   color: 0xffffff,
  map: r
// wireframe:true
} );
const cylinder = new THREE.Mesh( geometry1, material1);

// win
// let a = 10
const geometry2 = new THREE.BoxGeometry( 8, 2, 0.2 );
const material2 = new THREE.MeshBasicMaterial( {color: 0x303A43} );
const cube = new THREE.Mesh( geometry2, material2 );
cube.position.y =-3
console.log("cylinder", cylinder.position)
const geometry9 = new THREE.BoxGeometry( 6, 2, 0.2 );
const material9 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
const cube9 = new THREE.Mesh( geometry9, material9 );
cube9.position.y =5
cube9.position.x =5

// wing2
const geometry3 = new THREE.BoxGeometry( 0.2, 2,6  );
const material3 = new THREE.MeshBasicMaterial( {color: 0x303A43} );
const cube2 = new THREE.Mesh( geometry3, material3 );
cube2.position.y =-3

mesh.add(cone , cylinder , cube , cube2)
mesh.scale.set(1,1,1)

scene.add(mesh)
// scene.add(cube9)
/**
 *  Models
 */


// console.log(gltfloader.Scene)

// console.log(model.position)

// para 


    // objecct 

    const phy = new Rocket( 
        new THREE.Vector3(1,2,1),
        // parameters.mass,
        parameters.wingarea,
        parameters.massFuel,
        parameters.massRocket,
        parameters.Cd,
        parameters.th,
        parameters.me,
        masss.mass,
        parameters.fuel_rate,
        parameters.fuel_speed,
        
    )

//Lights
var ambientLight = new THREE.AmbientLight(0xf1f1f1);
scene.add(ambientLight);

/**
 * Object
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(100, 100),
//     new THREE.MeshStandardMaterial(
//         {
//             color : '#444884',
//             metalness: 0,
//             roughness: 0.5
//         }
//     )
// )
// floor.rotation.x = - 1.55
// floor.position.y = - 10
// scene.add(floor)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10000 ,80,80),
    new THREE.MeshBasicMaterial({
        // color:0xff0000,
        map: earth
    })
)
sphere.position.y= -10010
sphere.rotation.x = 1
scene.add(sphere)

// sky pox
const sky = new THREE.Mesh(
    new THREE.BoxGeometry(100000 ,100000,100000),
    new THREE.MeshBasicMaterial({
        color:0x87CEEB,
        side: THREE.DoubleSide,
        // map: skytext,
    })
)
sky.position.y = -50
scene.add(sky)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
  
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// double click fullscreen
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitFullscreenElement()
        }    
    }
    else
    {
           if( document.exitFullscreen)
           {
            document.exitFullscreen()
           }
           else if( document.webkitExitFullscreen)
           {
            document.webkitExitFullscreen()
           }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 1000000)
camera.position.z = 20
camera.position.y = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)




/// gui 

/**
 * Debug
 */
 const gui = new dat.GUI({
    // closed: true,
    width: 400,
    // height: 4000
})

// gui.hide()
const rocketFolder = gui.addFolder('Rocket')
    rocketFolder.add(parameters, "massRocket").min(0).max(1000000).step(1).onFinishChange(() => {
        phy.massRocket = parameters.massRocket
    })
    rocketFolder.add(parameters, "wingarea").min(10).max(1000).step(1).onFinishChange(() => {
        phy.wingarea = parameters.wingarea
    })
    rocketFolder.close()

const fuelFolder = gui.addFolder("Fuel")
    fuelFolder.add(parameters, "massFuel").min(0).max(1000000).step(1).onFinishChange(() => {
        phy.massFuel = parameters.massFuel
    })
    fuelFolder.add(parameters, "fuel_type").min(0).max(1).step(1).onFinishChange(() => {
        phy.fuel_type = parameters.fuel_type
    })
const engineFolder = gui.addFolder("Engine")
    engineFolder.add(parameters, "fuel_rate").min(0).max(10000).step(1).onFinishChange(() => {
        phy.fuel_rate = parameters.fuel_rate
    })
    engineFolder.add(parameters, "fuel_speed").min(0).max(10000).step(1).onFinishChange(() => {
        phy.fuel_speed = parameters.fuel_speed
    })
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(parameters, "status_camera").min(0).max(1).step(1).onFinishChange(() => {
        parameters.status_camera = parameters.status_camera
    })
cameraFolder.open()


gui.add(parameters, "start").min(0).max(1).step(1).onFinishChange(() => {
    parameters.start = parameters.start
    phy.mass = phy.massFuel + phy.massRocket
})

gui.add(parameters, "th").min(0).max(90).step(45).onFinishChange(() => {
    phy.th = parameters.th
})





const word ={
    gltfloader:{
        width:100,
        height:100
    }
}

// gui.add(word.gltfloader,'width',100,200).onFinishChange(()=>{
//     mesh.geometry.dispose()
//     mesh.geometry = new THREE.BoxBufferGeometry(word.mesh.width, 1, 1)
// })
// gui.add(word.gltfloader,'height',100,200).onFinishChange(()=>{
//     mesh.geometry.dispose()
//     mesh.geometry = new THREE.BoxBufferGeometry(word.mesh.width,word.mesh.width , 1)
// })


let i

// movement
document.onkeydown=function(e){
    if(e.keyCode===38){
        mesh.rotation.z -= 0.01
    }

    if(e.keyCode===39){
    if (phy.th == 90) {
       phy.th = 45
       
    }
    else if (phy.th == 45) {
        phy.th = 90
        // mesh.rotateZ(45)
    }
    }
  };
   
const pointLight = new THREE.PointLight( 0xff7700, 100, 1000 );
// pointLight.castShadow = true
pointLight.position.set( 0, 5, 10 );

//   const spotLightHelper = new THREE.SpotLightHelper( spotLight );


// Clock
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    
console.log("fuel_speed", phy.fuel_speed)
console.log("fuel_rate", phy.fuel_rate)
    
    console.log("teta", phy.teta)
    
    // Clock
    const elapsedTime = clock.getElapsedTime()
    const deltaTime =  elapsedTime - previousTime
    // console.log("elapsedTime", elapsedTime)
    
    if(parameters.start == 1) {
        phy.update(deltaTime)
        mesh.position.copy(phy.position)
        
        console.log("deltaTime",deltaTime)
    }
    if (phy.th == 45) {
        mesh.rotateY(phy.teta.y)
       
        if(elapsedTime <= 45) {
            mesh.rotation.z -= 0.0005
            // mesh.rotateX(phy.teta.x)
            // mesh.rotateZ(phy.teta.z)
        }
    }
  
        if (! parameters.status_camera == 0) {
            camera.position.x = mesh.position.x + 50
            camera.position.y = mesh.position.y + 50
            camera.position.z = mesh.position.z + 50
            
            // floor.position.x = mesh.position.x
        }
               
        
  
console.log('mesh.position', mesh.position)

    // Update objects
    // Update controls
    controls.update()

    console.log("velocity ", phy.velocity)
    // Render
    renderer.render(scene , camera)

    window.requestAnimationFrame(tick)
    previousTime = elapsedTime
    if( mesh.position.y <= sphere.position.y+5.3) { 
        scene.add( pointLight );
        
    }
    if( mesh.position.y <= sphere.position.y+10004) {
        if(cube.position.z < 100) {
            cube.position.z += elapsedTime /100
            cube.position.y += elapsedTime 
            cube2.position.z -= elapsedTime /100
            cube2.position.x += elapsedTime 
            // camera.position.y = 15
            cylinder.rotateZ(elapsedTime / 100)
            cylinder.position.z -= elapsedTime 
            cylinder.position.y -= elapsedTime 
            cone.position.x -= elapsedTime 
        }
    }
        
}

tick()