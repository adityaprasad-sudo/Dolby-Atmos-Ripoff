# WELCOME TO DOLBY ATMOS RIPOFF!!!!

I made this prject since i wanted dolby atmos and wanted to adjust the instruments and thier movement in realtime.

This isnt like a full repilica of dolby atmos but i tried my best to make the audio and experience top notch.

## What Did I use?
- **THREE.JS** (Core the 3d canvas depends on this)_(I love THREE JS)
- Python
- Fast API
- **Demucs** (Used to separate the upload or demo musics[pre separated using demucs] to split them into stems(different instruments))
- **Resonance By Google** ( Without this i Cant replicate dolby atmos)
- HTML, CSS 

## Description

If my code doesnt confuse you the idk what does the variable naming and the indentation is so messy but hey what am i here for lets get to explaining.

I cant explain everything here but i am happy to help if you dm me on slack or open a new discussion

**1.**  how do i initialiaze my own backend link
    ```
    const apiurl = "put your backend link here"
    ```
    put this on the top of the script


**2.**  How to adjust the default room dimensions, materials?

    ```
    let room = {
        width: 200, adjust this to adjust width
        height: 200, adjust this to adjust height
        depth: 200 adjust this to adjust depth
    }
    let roommat = { adjust these to adjust the materials of the walls
        left: 'wood-panel',
      right: 'wood-panel',
      front: 'wood-panel',
      back: 'wood-panel',
      down: 'wood-panel',
      up: 'wood-ceiling',
    }
    ```

list of materials are:-
```
"transparent", 
"acoustic-ceiling-tiles", 
"brick-bare", 
"brick-painted",
"concrete-block-coarse", 
"concrete-block-painted", 
"curtain-heavy", 
"fiber-glass-insulation",
"glass-thin", 
"glass-thick", 
"grass", 
"linoleum-on-concrete",
"marble", 
"metal", 
"parquet-on-concrete", 
"plaster-rough",
"plaster-smooth", 
"plywood-panel", 
"polished-concrete-or-tile", 
"plaster-smooth",
"water-or-ice-surface", 
"wood-ceiling", 
"wood-panel", 
"uniform"
```

**3.** How does the webapp handle mobile devices?

Since Mobile devices are limited by hardware therefore a smooth playback is imposible using anit aliashing and high resolutions expect if its a flagship mobile to counter that we use:-

```
    const mobile = window.innerWidth < 768;
    const renderguy = new THREE.WebGLRenderer({
        antialias: !mobile, 
        alpha: true
    })
    renderguy.setSize(window.innerWidth, window.innerHeight)
    renderguy.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 2))
    renderguy.toneMapping = THREE.ACESFilmicToneMapping
    renderguy.toneMappingExposure = 1.1
    renderguy.outputColorSpace = THREE.SRGBColorSpace
```
**4.** How to adjust the radius or material of the orbs

```   
        const aurageo = new THREE.SphereGeometry(2.5,64,64) adjust this to adjust the radius
        const auramat = new THREE.MeshPhysicalMaterial({ you can adjust these to adjust the shinniness or reflectiveness or anything
        color: 0x5c33ff, emissive: 0x1a0055, emissiveIntensity: 0.5,
        transmission: 1.0, opacity: 0.2,
        metalness: 0.1, roughness: 0.1,
        ior: 1.5, thickness: 0.1, side: THREE.DoubleSide,
        transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending
        })
```
if you wanna use a 3d model of an orb use the RGLBLoader.js library from three js to load them into the scene

**5.** How to adjust the demo musics and thier default movement
for example you wanna edit the movement and file paths speed for demo1 heres what you need to do 

```
if(demo === 'demo1'){
     vomove = 'behind' //adjust these to define the moovement of the specific orbs
     guimove = 'tele'
     paimove = 'fountain'
     drummove = 'atom'
     othmove = 'overhead'
     drumspd = 0.02 // these variables controls the speed
     guispd = 0.05
     othspd = 0.04
      vocal = './music/rightvocal.mp3' // these variables is used to map the music stems for that specific demo
      guitat = './music/rightguitar.mp3'
      paino = './music/piano.wav'
      drum = './music/rightdrum.mp3'
      oth = './music/other.wav'
      }
```
also donot touch unless you wanna edit the defaults for the uploaded music file the below is the mapping for the uploaded music file from the user
```
else if(window.backstems){
       vocal = apiurl + window.backstems.vocals
       guitat = apiurl + window.backstems.guitar
       paino = apiurl + window.backstems.piano
       drum = apiurl + window.backstems.drums
       oth = apiurl + window.backstems.other
       vomove = 'behind'; // you can adjust these defaults here
       vospd = 0.03
       drummove = 'atom'
       drumspd = 0.02
       guimove = 'infinity'
        guispd = 0.01
       othmove = 'fountain'
        othspd = 0.01
       paimove = 'overhead'
        paispd = 0.05
   }
```
**NOTE** If you adding more demos or adjusting demos you would also need to adjust the file paths for the bass stem adjsut these for the bass stem
```
let basspath = ''
   if(window.backstems) //this is for the backend {basspath = apiurl + window.backstems.bass}
   else if(demo === 'demo1'){
    basspath = './music/bass.wav'//adjust these for the demos
   }
```
**6.** How can i add more movements ?
to add more movements you can add more cases to the switch case i have made to adjust the movements 
```
switch(ud.move){ // these are the movements i made but you can add more if you want to 
                        case 'circle':
                            orb.position.x = Math.cos(ud.angle) * ud.radius
                            orb.position.z = Math.sin(ud.angle) * ud.radius
                            orb.position.y = Math.sin(ud.angle*2)*0.5 
                            break;}
```
**NOTE** *If you do add more movements dont forget to link them in the html* 

**7.** how do i adjust the quick presets ?
to adjust the quick presets you can adjust these if else statements but do know you need good knowledge about how different materials react to sounds
```
if (val === 'room1'){
    document.getElementById('width').value = 10;
    document.getElementById('height').value = 10;
    document.getElementById('depth').value = 100;
    ['leftwall', 'rightwall', 'frontwall', 'backwall'].forEach(id => document.getElementById(id).value = "19") // adjust these for the wall materials
    document.getElementById('ceil').value = "2"; // adjust these for the ceiling material
    document.getElementById('floor').value = "19"; // adjust for the floor material
} else if (val === 'room2'){
    document.getElementById('width').value = 50;
    document.getElementById('height').value = 20;
    document.getElementById('depth').value = 50;
    ['leftwall', 'rightwall', 'backwall'].forEach(id => document.getElementById(id).value = "7");
    document.getElementById('frontwall').value = "1";
    document.getElementById('ceil').value = "2";
    document.getElementById('floor').value = "7"
} else if(val === 'room3') { 
    document.getElementById('width').value = 15;
    document.getElementById('height').value = 10;
    document.getElementById('depth').value = 20;
    ['leftwall', 'rightwall', 'frontwall', 'backwall'].forEach(id => document.getElementById(id).value = "23");
    document.getElementById('ceil').value = "2";
    document.getElementById('floor').value = "15";
}
```
*You Can add more quick presets but be sure to link them between html and javascript*

**8.** *If you wanna adjust the ui you can go through the test folder that contains all the ui elements that i used before comitting them to the main index file*

## AI Usage

I did use AI to make special shader and mix passes to make the user experience more friendly and good also used it ocassionaly to fix bugs 
I did also use in line sugestions by Windsurf to code faster.

The parts code where i used ai 

**1.** The custom mix shader used in the central glowing and reactive orb 
```
this shader is generated by ai
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
```

**2.** Used ai to make custom movements and then tweaked them to make them actually good and exactly as i wanted the movements to be
```
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
                            orb.position.z = 2.5
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
                         case 'fountain': {
                            orb.position.x = Math.cos(ud.angle * 2) * 2.5; 
                            orb.position.z = Math.sin(ud.angle * 2) * 2.5; 
                            orb.position.y = 0.5 + Math.abs(Math.sin(ud.angle * 4)) * 5; 
                            break;
                        } 
                    }
```
**3.** Used ai to generate Proper materials for the walls and floor as i dont have real life experience working with different sound materials
```
if (val === 'room1'){
    document.getElementById('width').value = 10;
    document.getElementById('height').value = 10;
    document.getElementById('depth').value = 100;
    ['leftwall', 'rightwall', 'frontwall', 'backwall'].forEach(id => document.getElementById(id).value = "19")
    document.getElementById('ceil').value = "2";
    document.getElementById('floor').value = "19";
} else if (val === 'room2'){
    document.getElementById('width').value = 50;
    document.getElementById('height').value = 20;
    document.getElementById('depth').value = 50;
    ['leftwall', 'rightwall', 'backwall'].forEach(id => document.getElementById(id).value = "7");
    document.getElementById('frontwall').value = "1";
    document.getElementById('ceil').value = "2";
    document.getElementById('floor').value = "7"
} else if(val === 'room3') { 
    document.getElementById('width').value = 15;
    document.getElementById('height').value = 10;
    document.getElementById('depth').value = 20;
    ['leftwall', 'rightwall', 'frontwall', 'backwall'].forEach(id => document.getElementById(id).value = "23");
    document.getElementById('ceil').value = "2";
    document.getElementById('floor').value = "15";
}
```
**4.** Used Ai to generate this material list that resonance provides as i genuinly cant find it anywhere in thier documentation
```
const mat = {
    "1": "transparent", "2": "acoustic-ceiling-tiles", "3": "brick-bare", "4": "brick-painted",
    "5": "concrete-block-coarse", "6": "concrete-block-painted", "7": "curtain-heavy", "8": "fiber-glass-insulation",
    "9": "glass-thin", "10": "glass-thick", "11": "grass", "12": "linoleum-on-concrete",
    "13": "marble", "14": "metal", "15": "parquet-on-concrete", "16": "plaster-rough",
    "17": "plaster-smooth", "18": "plywood-panel", "19": "polished-concrete-or-tile", "20": "plaster-smooth",
    "21": "water-or-ice-surface", "22": "wood-ceiling", "23": "wood-panel", "24": "uniform"
}
```
**5.** Ocassionaly used ai to genrate inspiration for the frontend ui but the code is mine all html and css javascript is 20-30% ai as i did use in-line suggestions and ai bug fixers to fix bugs and stuff.

**6.** Also the backend is 40% AI as i used it generate docker  code and some parts of the python code and then linked them to javascript.


## Motivation

I really wanna visit singapore.

## Important

The progress bar of the music isnt reactive since i would have to rewrite the whole engine because if i did that i can scrubbing and make the whole shi lag and crash especially in lower end devices

## To Reviwers

Thank you Guys for giving your precious time to review this project i hope you did like it 

## Backend 

Heres the link where the whole backend is hosted
https://huggingface.co/spaces/AmbitiousPotato/Spectra

## Authors

ME

## Flowchart
![flowchart](https://github.com/adityaprasad-sudo/Dolby-Atmos-Ripoff/blob/main/images/flowchart.png?raw=true)

# THANK YOU FOR READING

