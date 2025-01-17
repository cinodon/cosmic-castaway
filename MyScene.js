
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import * as KeyCode from '../libs/keycode.esm.js'

// Clases de mi proyecto

import { MyShip} from './MyShip.js'
import { MyGear } from './MyGear.js'
import { MyBox } from './MyBox.js'
import { MyBoxHelix } from './MyBoxHelix.js'
import { MyRock } from './MyRock.js'
import { MyPirate } from './MyPirate.js'
import { MyShot } from './MyShot.js'



/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    this.initStats();
    
    //Botones
    this.key_left = false;
    this.key_right = false;


    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();

    // Crear tubo
    this.tube = this.createGround();
    this.add(this.tube);
    //this.tube 
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.axis = new THREE.AxesHelper (2);
    this.add (this.axis);
    
    
    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.

    //Nave
    this.ship = new MyShip(this.gui, "Control de la nave", this.tube.geometry);
    this.add (this.ship);

//Creación de objetos en el tubo
//------------------------------------------------------------------------------------
    this.pickables = [];
    this.collisions = [];
    this.shots = [];
    //Rocas
    var nrocks = 40;
    this.rock = [];
    for(let i = 0; i < nrocks; i++)
    {
      var angMin = 0;
      var angMax = 2*Math.PI;
      var a = Math.random() * (angMax - angMin) + angMin;
      var p = (1/(nrocks)*i);
      var r = new MyRock(this.gui, "Roca " + i, false, this.tube.geometry, a, p)      
      this.rock.push(r);
      this.add(this.rock[i]);
      this.collisions.push(this.rock[i]);
    }

    //Cristales
    var ncrystals = 30;
    this.crystal = [];
    for(let i = 0; i < ncrystals; i++)
    {
      var angMin = 0;
      var angMax = 2*Math.PI;
      var a = Math.random() * (angMax - angMin) + angMin;
      var p = (1/(ncrystals)*i);
      var r = new MyRock(this.gui, "Cristal " + i, true, this.tube.geometry, a, p)      
      this.crystal.push(r);
      this.add(this.crystal[i]);
      this.pickables.push(this.crystal[i]);
      this.collisions.push(this.crystal[i]);
    }
    
    //Cajas
    var nboxes = 20;
    this.box = [];
    for(let i = 0; i < nboxes; i++)
    {
      var angMin = 0;
      var angMax = 2*Math.PI;
      var a = Math.random() * (angMax - angMin) + angMin;
      var p = (1/(nboxes)*i);
      var r = new MyBox(this.gui, "Box" + i, this.tube.geometry, a, p)      
      this.box.push(r);
      this.add(this.box[i]);
      this.pickables.push(this.box[i]);
      this.collisions.push(this.box[i]);
    }

    //Chatarra
    var ngears = 12;
    this.gear = [];
    for(let i = 0; i < ngears; i++)
    {
      var angMin = 0;
      var angMax = 2*Math.PI;
      var a = Math.random() * (angMax - angMin) + angMin;
      var p = (1/(ngears)*i);
      var r = new MyGear(this.gui, "Gear" + i, this.tube.geometry, a, p)      
      this.gear.push(r);
      this.add(this.gear[i]);
      this.collisions.push(this.gear[i]);
    }

    //Objetos voladores
    var nhboxes = 20;
    this.hbox = [];
    for(let i = 0; i < nhboxes; i++)
    {
      var angMin = 0;
      var angMax = 2*Math.PI;
      var a = Math.random() * (angMax - angMin) + angMin;
      var p = (1/(nhboxes)*i);
      var r = new MyBoxHelix(this.gui, "Box" + i, this.tube.geometry, a, p)      
      this.hbox.push(r);
      this.add(this.hbox[i]);
      this.pickables.push(this.hbox[i]);
      this.collisions.push(this.hbox[i]);
    }


//-----------------------------------------------------------------

    //INTERACCION
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    var distance = 4;
    this.collisionRay = new THREE.Raycaster(new THREE. Vector3 ( ) , new THREE. Vector3 (0 ,0 ,1) , 0 , distance);
    
   

    // Propiedades cámaras
    this.currentCam = 1;

    this.createCamera();
    //Creacion de la cámara la del player
    this.createPlayerCamera();

    this.listener = new THREE.AudioListener();
    this.playerCam.add(this.listener);
    this.audioLoader = new THREE.AudioLoader();
    this.shotSnd0 = new THREE.Audio(this.listener);
    this.shotSnd1 = new THREE.Audio(this.listener);
    this.rockSnd = new THREE.Audio(this.listener);

     
    this.audioLoader.load("./sounds/shot0.mp3", (buffer) => {
        this.shotSnd0.setBuffer(buffer);
        this.shotSnd0.setLoop(false); 
        this.shotSnd0.setVolume(1);
    });

    this.audioLoader.load("./sounds/shot1.mp3", (buffer) => {
      this.shotSnd1.setBuffer(buffer);
      this.shotSnd1.setLoop(false); 
      this.shotSnd1.setVolume(1);
    });

    this.audioLoader.load("./sounds/rock_break.mp3", (buffer) => {
      this.rockSnd.setBuffer(buffer);
      this.rockSnd.setLoop(false); 
      this.rockSnd.setVolume(1);
    });

    
    //Background
    var textPath = ['../imgs/space-background.jpg',
                     '../imgs/space-background.jpg',
                      '../imgs/space-background.jpg',
                      '../imgs/space-background.jpg',
                      '../imgs/space-background.jpg',
                      '../imgs/space-background.jpg'];
    var text = new THREE.CubeTextureLoader().load(textPath);
    this.background = text;
  }
  
  initStats() {
  
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;

    
    this.GENERAL = -1;
    this.PLAYER = 1;
  }
  
  createPlayerCamera() 
  {
    //Ajustar parámetros de la visión
    this.playerCam = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 200);
    this.ship.ship.add(this.playerCam);
    this.playerCam.position.set(0, 4, -6.5);
    var camLook = new THREE.Vector3();
    camLook = this.ship.ship.position;

    this.playerCam.lookAt(this.ship.ship.position);

  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Recuerda: Todas las unidades están en metros
    // También se indica dónde se coloca
    this.camera.position.set (400, 400, 400);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGround () {
    //Puntos
    var l = 200;
    var y = 10;
    var points = [
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(l, y, 0),
      new THREE.Vector3(l, l+y, 0),
      new THREE.Vector3(l, l+y, l),
      new THREE.Vector3(0, l+y, l),
      new THREE.Vector3(0, l+y, 0),
      
      new THREE.Vector3(-l, l+y, 0),
      new THREE.Vector3(-l, l+y, l),
      new THREE.Vector3(-l, y, l),
      new THREE.Vector3(0, y, l),

  ];

  //Curva
  var path = new THREE.CatmullRomCurve3(points, true);

  // El material se hará con una textura de cráteres
  var text = new THREE.TextureLoader().load('../imgs/crater.jpeg');
  text.wrapS = THREE.MirroredRepeatWrapping;
  text.wrapT = THREE.MirroredRepeatWrapping;
  text.repeat.set(10,5);
  //var nmap = new THREE.TextureLoader().load('../imgs/ground-nmap.jpg');
  var bmap = new THREE.TextureLoader().load('../imgs/stone-bmap.jpg');
  var materialGround = new THREE.MeshStandardMaterial({
    color: 0x808080, // Color gris
    roughness: 1, // Controla la aspereza de la superficie (valores entre 0 y 1)
    metalness: 0.1, // Controla la reflectividad metálica de la superficie (valores entre 0 y 1)
    map: text,
    //normalMap: nmap,
    //normalScale: (3,3),
    bumpMap: bmap,
    bumpScale: 3,

});

  /*var materialGround = new THREE.MeshStandardMaterial({
    transparent: true, // Hace que el material sea transparente
    opacity: 0.5, // Ajusta la opacidad del material
    color: 0xffffff, // Color del material (blanco)
    metalness: 0.1, // Ajusta el nivel de metalización
    roughness: 0.1, // Ajusta la rugosidad de la superficie
    transmission: 0.9, // Ajusta la transmisión de luz a través del material (cristalino)
    transparent: true, // Hace que el material sea transparente
    opacity: 0.7 // Ajusta la opacidad del material (0 es completamente transparente, 1 es completamente opaco)
});*/
  
  //Propiedades del tubo
  var tubularSegments = 200;
  var radius = 20;
  var rSegments = 30;


  // Crear el tubo usando TubeGeometry
  var tubeGeometry = new THREE.TubeGeometry(path, tubularSegments, radius, rSegments, true);
  var tubeMesh = new THREE.Mesh(tubeGeometry, materialGround);

  return tubeMesh;
  }

  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower : 500.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity : 0.5,   
      axisOnOff : true
    }
/*
    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    */
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    //Luces añadidas
    var solarText = new THREE.TextureLoader().load('../imgs/solar-text.jpg');
    var sphG = new THREE.SphereGeometry(20);
    var sphM0 = new THREE.MeshBasicMaterial({
      map:solarText
    });
    
    var sun0 = new THREE.Mesh(sphG, sphM0);
    var sun0_light = new THREE.PointLight(0xFF7416)
    sun0_light.power = 200000;
    sun0_light.add(sun0);
    sun0_light.position.set(0, 100, 100);
    this.add(sun0_light);

    var sphM1 = new THREE.MeshBasicMaterial({
      map:solarText,
      color: 0x5FFFEC
    });

    var sun1 = new THREE.Mesh(sphG, sphM1);
    var sun1_light = new THREE.PointLight(0x5FFF6D)
    sun1_light.power = 200000;
    sun1_light.add(sun1);
    sun1_light.position.set(200, 100, 200);
    this.add(sun1_light);

    var sphM2 = new THREE.MeshBasicMaterial({
      map:solarText,
      color: 0xF701FF
    });

    var sun2 = new THREE.Mesh(sphG, sphM2);
    var sun2_light = new THREE.PointLight(0xF701FF);
    sun2_light.power = 200000;
    sun2_light.add(sun2);
    sun2_light.position.set(-200, 100, 0);
    this.add(sun2_light);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x1A133C), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    if (this.currentCam == 1) return this.playerCam; else return this.camera;
  }
  
  changeCam()
  {
    this.currentCam *= -1;
     //Llamar al cambio de ventana por si se ha modificado el tamaño
     this.onWindowResize()
  }

  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onKeyDown(event)
  {

    var x = event.which || event.key;

    if (x == KeyCode.KEY_RIGHT || String.fromCharCode(x) == "D") this.key_right = true;
    if (x == KeyCode.KEY_LEFT || String.fromCharCode(x) == "A") this.key_left = true;

  }

  onKeyUp(event)
  {
    var x = event.which || event.key;

    if (x == KeyCode.KEY_RIGHT || String.fromCharCode(x) == "D") this.key_right = false;
    if (x == KeyCode.KEY_LEFT || String.fromCharCode(x) == "A") this.key_left = false;
    
  }

  onKeyPress(event)
  {
    var x = event.which || event.key;

    //Para cambiar la cámara
    if (x == KeyCode.KEY_SPACE) this.changeCam();
    
  }

  onMouseDown(event)
  {
    var x = event.which;
    //Se pulsa el izquierdo
    if (x == 1)
    {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

      this.raycaster.setFromCamera(this.mouse, this.getCamera());

      var pickedObjects = this.raycaster.intersectObjects(this.pickables);
      if (pickedObjects.length > 0)
      {
        var picked = pickedObjects[0].object;
        if (picked.userData)
        {

          picked.userData.shot(this.ship, this);
        }  
      }
    }

    //Disparo de la nave - Botón derecho
    if (x == 3)
    {
      //Creamos el objeto disparo
      var shot = new MyShot(this.gui, "Disparo "+ this.ship.t, this.tube.geometry, this.ship.angle, this.ship.t, this.ship.spd, this.ship);
      
      // Reproducir sonido de disparo
      if ((this.ship.currentWeapon == 0) || (this.ship.currentWeapon == 2))
      {
        if (this.shotSnd0.isPlaying) {
          this.shotSnd0.stop(); 
        }
        this.shotSnd0.play();
      }
      else if (this.ship.currentWeapon == 1)
      {
        if (this.shotSnd1.isPlaying) {
          this.shotSnd1.stop(); 
        }
        this.shotSnd1.play();        
      }

      //Si es el Mega Rocket
      if (this.ship.currentWeapon == 1)
      {
        shot.shot.scale.set(2, 2, 4);
      }

      this.shots.push(shot);
      this.add(shot);

      //Si es triple laser creamos 2 más
      if (this.ship.currentWeapon == 2)  
      {
        var shot = new MyShot(this.gui, "Disparo 2"+ this.ship.t, this.tube.geometry, this.ship.angle, this.ship.t, this.ship.spd, this.ship);
        shot.shot.position.x = shot.shot.position.x - 1;
        this.shots.push(shot);
        this.add(shot);
        
        var shot = new MyShot(this.gui, "Disparo 3"+ this.ship.t, this.tube.geometry, this.ship.angle, this.ship.t, this.ship.spd, this.ship);
        shot.shot.position.x = shot.shot.position.x + 1;
        this.shots.push(shot);
        this.add(shot);    
      }
    }
  }

  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    //this.setCameraAspect (window.innerWidth / window.innerHeight);
    var camara = this.getCamera();
    var ratio = window.innerWidth / window.innerHeight;
    camara.aspect = ratio;
    camara.updateProjectionMatrix();

    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  checkCollision()
  {
    var rayos = 5;
    var pos = new THREE.Vector3();
    var dir = new THREE.Vector3();

    this.collisionRay.set(pos, dir);
    for (let i = 0; i < rayos; i++)
    {
      //Determinar posición y dirección
      if (i < 3)
      {
        this.ship.partPos[i].getWorldPosition(pos);
        this.ship.ship.getWorldDirection(dir);

        //En el caso de los propulsores
        if (i > 1)
        {
          pos.z += 3.36; //Propulsor size --> considerar cambiar a constante
          //Aplicar rotación
          let x = dir.x;
          dir.x = dir.z;
          dir.z = x;
        }
      }
      else
      {
        //Parto de la posición
        this.ship.ship.getWorldPosition(pos);
        this.ship.ship.getWorldDirection(dir);

        if (i == 3) pos.x -= 1.5; 
        if (i == 4) pos.x += 1.5;
      }
      

      //Establecer rayo
      this.collisionRay.set(pos, dir);

      //Comprobar colisión
      var colisiones = this.collisionRay.intersectObjects(this.collisions, true);
      if (colisiones.length > 0)
      {
        var closest = colisiones[0].object;
        if (closest.userData)
        {
          closest.userData.collision(this.ship, this.rockSnd);
          break;
        }
      }
    }

  }

  shotCollision()
  {
    var pos = new THREE.Vector3();
    var dir = new THREE.Vector3();
    this.collisionRay.set(pos, dir);
    
    for (let i = 0; i < this.shots.length; i++)
    {
      this.shots[i].shot.getWorldPosition(pos);
      this.shots[i].shot.getWorldDirection(dir);
      
      //Establecer rayo
      this.collisionRay.set(pos, dir);

      var colisiones = this.collisionRay.intersectObjects(this.collisions, true);
      if (colisiones.length > 0)
      {
        var closest = colisiones[0].object;
        if (closest.userData)
        {
          closest.userData.collision(this.shots[i], this.rockSnd);
          break;
        }
      }
    }
  }

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    //console.log(this.camera.position.x, " ", this.camera.position.y, " ", this.camera.position.z,)
    // Se actualiza el resto del modelo
    //Nave
    if (this.key_left == true) this.ship.actualizarRotacion(-1);
    if (this.key_right == true) this.ship.actualizarRotacion(1);
    this.ship.update();
    //this.box.update();

    //Actualizar rocas
    for(let i = 0; i < this.rock.length; i++)
    {
      this.rock[i].update();
    }

    for(let i = 0; i < this.crystal.length; i++)
    {
      this.crystal[i].update();
    }

    //Cajas
    for(let i = 0; i < this.hbox.length; i++)
    {
      this.box[i].update();
    }

    //Actualizar cajas hélice
    for(let i = 0; i < this.hbox.length; i++)
    {
      this.hbox[i].update();
    }

    for(let i = 0; i < this.gear.length; i++)
    {
      this.gear[i].update();
    }

    let shotsRemoved = [];
    for(let i = 0; i < this.shots.length; i++)
    {
      this.shots[i].update();
      if (this.shots[i].totalD >= this.shots[i].end)
      {
        shotsRemoved.push(this.shots[i]);
      }
    }

    // Removemos los objetos a eliminar de la escena y del array
    for (let i = 0; i < shotsRemoved.length; i++) {
      this.remove(shotsRemoved[i]);
      let index = this.shots.indexOf(shotsRemoved[i]);
      if (index !== -1) {
          this.shots.splice(index, 1);
      }
    }

    //Colisiones
    this.checkCollision();
    
    //Comprobar colisiones de los disparos
    this.shotCollision();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());
    document.getElementById("Mineral").innerHTML = "<h2>"+"Mineral: "+this.ship.mineral + "</h2>"
    let health = document.getElementById("health");
    health.value = (this.ship.vida/this.ship.VIDA_MAX)*100;
    
    //Game over
    if (this.ship.vida <= 0)
    {
      window.location.href = '../game_over.html';
    }  

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());

  //Listeners de controles
  window.addEventListener ("keydown", (event) => scene.onKeyDown(event));
  window.addEventListener ("keyup", (event) => scene.onKeyUp(event));
  window.addEventListener ("keypress", (event) => scene.onKeyPress(event));

  window.addEventListener ("mousedown", (event) => scene.onMouseDown(event));


  // Que no se nos olvide, la primera visualización.
  scene.update();
});
