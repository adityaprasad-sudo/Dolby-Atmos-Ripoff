import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
document.getElementById('github').addEventListener('click', function(){
    window.open('https://github.com/adityaprasad-sudo/Dolby-Atmos-Ripoff', '_blank')
})
function mix(){
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    audio.suspend()
    const resaudio = new ResonanceAudio(audio)
    resaudio.output.connect(audio.destination)
    let room = {
        width: 200,
        height: 200,
        depth: 200
    }
    window.mixer ={
        ready: false,
        gains: {},
        orbs: {},
        volumes: {},
        muted: {}
    }
    let roommat = {
        left: 'wood-panel',
      right: 'wood-panel',
      front: 'wood-panel',
      back: 'wood-panel',
      down: 'wood-panel',
      up: 'wood-ceiling',
    }
    resaudio.setRoomProperties(room, roommat)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050110)
    scene.fog = new THREE.FogExp2(0x050110, 0.02)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0,0,10)
    const renderguy = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderguy.setSize(window.innerWidth, window.innerHeight)
    renderguy.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderguy.toneMapping = THREE.ACESFilmicToneMapping
    renderguy.toneMappingExposure = 1.1
    renderguy.outputColorSpace = THREE.SRGBColorSpace
    document.getElementById('cancont').appendChild(renderguy.domElement)
    const pmrem = new THREE.PMREMGenerator(renderguy)
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture
    pmrem.dispose()
    const bloomlayer = new THREE.Layers(1)
    bloomlayer.set(1)
    const darkmat = new THREE.MeshBasicMaterial({color: 'black'})
    const matcache = {}
    function darken(obj){
        if((obj.isMesh || obj.isPoints) && bloomlayer.test(obj.layers) === false){
            matcache[obj.uuid] = obj.material
            obj.material = darkmat
        }
    }
    function undark(obj){
        if(matcache[obj.uuid]){
            obj.material = matcache[obj.uuid]
            delete matcache[obj.uuid]
        }
    }
    const rendersc = new RenderPass(scene, camera)
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.4, 0.85)
    const shinecomposer = new EffectComposer(renderguy)
    shinecomposer.addPass(rendersc)
    shinecomposer.addPass(bloom)
    const output = new OutputPass()
    shinecomposer.addPass(output)
    const controls = new OrbitControls(camera, renderguy.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    // ai generated mix pass below //
    const mixsha = new ShaderPass(new THREE.ShaderMaterial({
    uniforms: {
        baseTexture: {value: null}, 
        bloomTexture: {value: shinecomposer.renderTarget2.texture}
    },
    vertexShader: `varying vec2 vuv; void main(){ vuv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vuv; void main(){ gl_FragColor = texture2D(baseTexture, vuv) + vec4(1.0) * texture2D(bloomTexture, vuv); }`,
    defines: {}
  }), 'baseTexture'
)
    // ai generated mix pass above //
    mixsha.needsSwap = true
    const composer = new EffectComposer(renderguy)
    composer.addPass(rendersc)
    composer.addPass(mixsha)
    composer.addPass(output)
    const aurageo = new THREE.SphereGeometry(2.5,64,64);
    const orig = []
    const pos = aurageo.attributes.position
    const v = new THREE.Vector3()
    for(let i = 0; i < pos.count; i++){
        v.fromBufferAttribute(pos,i)
        orig.push(v.clone())
    }
    aurageo.userData = {orig}
    const auramat = new THREE.MeshPhysicalMaterial({
        color: 0x5c33ff, emissive: 0x1a0055, emissiveIntensity: 0.5,
        transmission: 1.0, opacity: 0.2,
        metalness: 0.1, roughness: 0.1,
        ior: 1.5, thickness: 0.1, side: THREE.DoubleSide,
        transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending
    })
    const auramesh = new THREE.Mesh(aurageo, auramat)
    auramesh.layers.enable(1);
    scene.add(auramesh)
    const skinmat = new THREE.PointsMaterial({
        color: 0xccaaff, size: 0.03,
        transparent:true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false
    })
    const skinmesh = new THREE.Points(aurageo, skinmat)
    skinmesh.scale.set(1.01, 1.01, 1.01);
    skinmesh.layers.enable(1)
    const blobgrp = new THREE.Group();
    blobgrp.add(auramesh)
    blobgrp.add(skinmesh)
    const headgrp = new THREE.Group()
    const headmat = new THREE.MeshPhysicalMaterial({color: 0xc9befa, roughness: 0.3, metalness: 0.8})
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,32), headmat)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.2,  0.4,32), headmat)
    const lear = new THREE.Mesh(new THREE.SphereGeometry(0.1,16,16),headmat)
    lear.position.set(-0.4,0.4,0)
    head.position.y = 0.5
    neck.position.y = 0
    const rear = new THREE.Mesh(new THREE.SphereGeometry(0.1,16,16),headmat)
    rear.position.set(0.4,0.4,0)
    headgrp.add(head,neck,lear,rear)
    scene.add(headgrp)
    scene.add(blobgrp)
    const dust = new THREE.BufferGeometry()
    const posi = new Float32Array(1500 * 3)
    for(let i = 0; i< 1500 *3; i++){
        posi[i] = (Math.random() -0.5) * 50
    }
    dust.setAttribute('position', new THREE.BufferAttribute(posi, 3))
    const dustmat = new THREE.PointsMaterial({color: 0x9b93ff,transparent:true, size: 0.1, opacity: 0.4, blending: THREE.AdditiveBlending})
   const dustmesh = new THREE.Points(dust, dustmat)
   scene.add(dustmesh)


   const pointli = new THREE.PointLight(0xffffff, 2, 100)
   pointli.position.set(5,5,5)
   scene.add(pointli)
   const hemi = new THREE.HemisphereLight(0x8888ff, 0x120022, 1.1)
   scene.add(hemi)
   const pinkypromise = []
   const stems = [
    { name: 'vocals', color: 0xffffff, path: './music/rightvocal.mp3', angle: 0, speed: 0.015, move: 'behind' },
      { name: 'guitar', color: 0x6aff9d, path: './music/rightguitar.mp3', angle: Math.PI * 2 / 5,speed: 0.02, move: 'tele' },
      { name: 'piano', color: 0x5ce1ff, path: './music/piano.wav', angle: Math.PI * 4 / 5, speed: 0.01,move: 'clap' },
      { name: 'drums', color: 0xff2f92, path: './music/rightdrum.mp3', angle: Math.PI * 6 / 5 , speed: 0.01,    move: 'atom'},
      { name: 'other', color: 0xffe45c, path: './music/other.wav', angle: Math.PI * 8 / 5 , speed: 0.008,    move: 'infinity'},
   ]
   const soundcheck ={}
   window.mixer.gains = {}
   window.mixer.orbs = {}
   window.mixer.volumes = {}
   window.mixer.muted = {}
   window.mixer.speed = {}
   window.mixer.ready = false
   const insname = ['vocals', 'drums', 'bass', 'other', 'guitar', 'paino']
   insname.forEach(n =>{
    window.mixer.volumes[n] = 100
    window.mixer.muted[n] = false
    window.mixer.speed[n] = 100
   })
   const bas = audio.createGain()
   bas.connect(audio.destination)
   const analyzebas = audio.createAnalyser()
   analyzebas.fftSize = 64
   bas.connect(analyzebas)
   soundcheck['bass'] = analyzebas
   window.mixer.gains['bass'] = bas
   const loadbas = fetch('./music/bass.mp3')
   .then(res => res.arrayBuffer())
   .then(buf => audio.decodeAudioData(buf))
   .then(decoded => {
    const source = audio.createBufferSource()
    source.buffer = decoded
    source.loop = true
    source.connect(bas)
    source.start(0)
   }).catch(e => console.warn(`Could not load bass bruhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh`))
   pinkypromise.push(loadbas)
   const stemorbs = []
   stems.forEach((stem) => {
       const orbgeo = new THREE.SphereGeometry(0.3,32,32)
       const orbmat = new THREE.MeshBasicMaterial({color: stem.color})
       const orb = new THREE.Mesh(orbgeo, orbmat)
       orb.layers.enable(1)
       orb.userData = { angle: stem.angle, radius: 4, speed: stem.speed, name: stem.name, move: stem.move, intime: performance.now() * 0.001}
       scene.add(orb)
       const orli = new THREE.PointLight(stem.color, 2, 10)
       orb.add(orli)
       const resour = resaudio.createSource()
       resour.setMinDistance(2)
       resour.setMaxDistance(50)
       resour.setRolloff('linear')
       orb.userData.resour = resour
       const gain = audio.createGain()
       gain.connect(resour.input)
       const analyze = audio.createAnalyser()
       analyze.fftSize = 64
       gain.connect(analyze)
       soundcheck[stem.name] = analyze
       window.mixer.gains[stem.name] = gain
       window.mixer.orbs[stem.name] = orb
       const loadtsk = fetch(stem.path)
       .then(res => res.arrayBuffer())
       .then(buf => audio.decodeAudioData(buf))
       .then(decoded => {
        const source = audio.createBufferSource()
        source.buffer = decoded
        source.loop = true
        source.connect(gain)
        source.start(0)
       }).catch(e => console.warn(`Could not load ${stem.name} bruhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh`))
       pinkypromise.push(loadtsk)
       stemorbs.push(orb)
   
})
Promise.all(pinkypromise).then(() => {
    audio.resume()
    console.log("Audio perfectly synced and unfrozen!!")
})
function getavg(analyze){
    const data = new Uint8Array(analyze.frequencyBinCount)
    analyze.getByteFrequencyData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) {
        sum += data[i]
    }
    return sum / data.length
}
window.mixer.ready = true
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderguy.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
    shinecomposer.setSize(window.innerWidth, window.innerHeight)
})

   
function animate() {
                requestAnimationFrame(animate);
                controls.update();
                blobgrp.rotation.y += 0.01;
                blobgrp.rotation.z+= 0.01;
                dustmesh.rotation.y+= 0.01
                let timothy = 0
                let active = 0
                const orti = performance.now() * 0.001
                stemorbs.forEach((orb) => {
                    const ud = orb.userData
                    const speedui = (window.mixer.speed[ud.name] ?? 100) / 100
                    ud.angle += ud.speed * speedui 
                    ud.intime += speedui* 0.016
                    const orti = ud.intime
                    switch(ud.move){
                        case 'circle':
                            orb.position.x = Math.cos(ud.angle) * ud.radius
                            orb.position.z = Math.sin(ud.angle) * ud.radius
                            orb.position.y = Math.sin(ud.angle*2)*0.5 
                            break;
                        case 'infinity':
                            orb.position.x = Math.sin(ud.angle) * ud.radius
                            orb.position.z = Math.sin(ud.angle) * Math.cos(ud.angle) * ud.radius
                            orb.position.y = Math.sin(ud.angle*1.5)*1.5
                            break;
                        case 'overhead':
                            orb.position.x = Math.cos(ud.angle) * (ud.radius*1.2)
                            orb.position.z = Math.sin(ud.angle) * (ud.radius*1.2)
                            orb.position.y = 4 + Math.sin(ud.angle) * 0.5
                            break;
                        case 'hoverfront':
                            orb.position.x = Math.sin(ud.angle * 0.5) *2
                            orb.position.z = -5
                            orb.position.y = 1 + Math.sin(ud.angle*2)*0.5 
                            break;
                        case 'atom':{
                            const sped = ud.angle *6
                         const tilt = ud.angle * 0.4
                            orb.position.x = Math.cos(sped) * Math.cos(tilt) * ud.radius
                         orb.position.z = Math.sin(sped) * ud.radius
                        orb.position.y = Math.cos(sped) * Math.sin(tilt) * ud.radius 
                            break;}
                        case 'behind':{
                          orb.position.x = 0
                            orb.position.z = 4
                         orb.position.y = 0
                            break;}
                        case 'clap':{
                            orb.position.x = Math.sin(ud.angle *8) *0.4
                         orb.position.z = -3
                        orb.position.y = 0.5
                        break;
                        }
                        case 'tele':{
                          const snap = Math.sign(Math.sin(ud.angle *2))
                        orb.position.x = snap*5
                            orb.position.z=0
                         orb.position.y = 1
                            break;}   
                    }
                    orb.userData.resour.setPosition(orb.position.x, orb.position.y, orb.position.z)
                    const analyzer = soundcheck[orb.userData.name]
                    if(analyzer){
                        const volume = getavg(analyzer)
                        orb.scale.setScalar(1+(volume/256) * 1.5)
                        active++
                        timothy += volume
                    }
                })
                if(soundcheck['bass']){
                    const basvol = getavg(soundcheck['bass'])
                    timothy += basvol
                    active++
                }
                const aurapos = new THREE.Vector3()
                auramesh.getWorldPosition(aurapos)
                resaudio.setListenerPosition(aurapos.x, aurapos.y, aurapos.z)
                const t = performance.now() * 0.0015
                const position = auramesh.geometry.attributes.position
                const original = auramesh.geometry.userData.orig
                const avg = active > 0 ? (timothy/active)/256 : 0
                const dynamic = 0.05 + (avg * 0.2)
                for(let i = 0; i < position.count; i++){
                 const orig = original[i]
                   const noise = Math.sin(orig.x * 1.2 +t) * Math.cos(orig.y * 1.2 +t) * Math.sin(orig.z * 1.2 +t) * dynamic
                  position.setXYZ(i, orig.x + (orig.x * noise), orig.y + (orig.y * noise), orig.z + (orig.z * noise))
                }
                position.needsUpdate = true
                auramesh.geometry.computeVertexNormals()
                blobgrp.scale.setScalar(1+(avg*0.8))
                auramesh.material.emissiveIntensity=0.5+(avg*4)
                scene.traverse(darken)
                shinecomposer.render()
                scene.traverse(undark);
                composer.render()
            }
            animate();
}
const upbtn = document.getElementById('uploadbtn')
const playbtn = document.getElementById('playbtn')
const stat = document.getElementById('status')
const fileinpu = document.getElementById('audioinput')
const namefi = document.getElementById('filedis')
const dropdown = document.getElementById('dropdown')
const fileinpuid = document.getElementById('filedis')
upbtn.disabled = true
upbtn.style.opacity ="0.3"
upbtn.style.cursor = "not-allowed"
fileinpu.addEventListener('change', (e)     =>{
    if(e.target.files.length > 0 ){
        const file = e.target.files[0].name
        const text = namefi.querySelectorAll('span')[1]
        text.innerText = file
        upbtn.disabled = false
        upbtn.style.opacity ="1"
        upbtn.style.cursor = "pointer"
        stat.innerHTML = 'Select a track'
        dropdown.style.opacity = "0.3"
        dropdown.disabled = true
        dropdown.style.cursor = "not-allowed"
    }
})
dropdown.addEventListener('change', () => {
    if(dropdown.value !== '0'){
        fileinpu.disabled = true
        fileinpuid.style.opacity ="0.3"
        fileinpuid.disabled = true
        fileinpuid.style.cursor = "not-allowed"
        upbtn.disabled = false
        upbtn.style.opacity ="1"
        upbtn.style.cursor = "pointer"
        stat.innerHTML = 'Select a track'
    }else{
        fileinpu.disabled = false
        fileinpuid.style.opacity ="1"
        fileinpuid.disabled = false
        fileinpuid.style.cursor = "pointer"
    }
})
upbtn.addEventListener('click', () => {

    if(fileinpu.files.length === 0 && dropdown.value === '0'){
        stat.innerHTML = 'Select a track'
    }else{
        stat.innerHTML = 'Loading'
        upbtn.disabled = true
        upbtn.style.opacity ="0.3"
        upbtn.style.cursor = "not-allowed"
        fileinpu.disabled = true
        fileinpuid.disabled = true
        setTimeout(() => {
            stat.innerText = "stems ready"
            upbtn.style.display = "none"
            playbtn.style.display = "inline-flex"
            fileinpu.disabled = true
            fileinpuid.disabled = true
            dropdown.disabled = true
            dropdown.style.cursor = "not-allowed"
            dropdown.style.opacity = "0.3"
        }, 2000);

    }
})
playbtn.addEventListener('click', (e) =>{
    e.target.innerText = 'Loading'
    e.target.disabled = true
    const mainel = document.querySelector('.main')
    const bgel = document.querySelector('.bg')
    mainel.style.transition = "opacity 1s ease-in-out"
    bgel.style.transition = "opacity 1s ease-in-out"
    mainel.style.opacity = "0"
    bgel.style.opacity = "0"
    setTimeout(() => {
        mainel.style.display = "none"
        bgel.style.display = "none"
        mix()
    }, 1000);

})
