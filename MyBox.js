import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MyShip } from './MyShip.js';

class MyBox extends THREE.Object3D {
  constructor(gui,titleGui, geomTubo, angle, pos) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Propiedades
    this.dmg = 5;

    //Tubo - Obtener información del tubo
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    //Shape
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/rusty-metal.jpg');
    this.mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });
    /*this.mat = new THREE.MeshStandardMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    this.mat.side = THREE.DoubleSide;
    this.mat.color = 0x3D3D3D;*/


    this.box = this.createBox(); //;this.createBox();
    this.userData.shot = this.shot.bind(this);
    this.box.position.y = this.radio;
    this.box.scale.set(3, 3, 3);

    //Rotación
    this.nodoRot = new THREE.Object3D();
    this.nodoRot.add(this.box);

    //Posición
    this.nodoPosTubo = new THREE.Object3D();
    this.nodoPosTubo.add(this.nodoRot);

    //Colocar rotación
    this.nodoRot.rotation.z = angle

    //Posicionar
    var posTmp = this.path.getPointAt (pos);
    this.nodoPosTubo.position.copy(posTmp);

    //Orientación
    var tangente = this.path.getTangentAt(pos);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(pos * this.segmentos);
    this.nodoPosTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosTubo.lookAt (posTmp);

    this.add(this.nodoPosTubo);
  }
  
  createBox()
  {
    var box = new THREE.Object3D();
    
    //Crear caja base
    var cube_geom = new THREE.BoxGeometry(1, 1, 1);
    var cube = new THREE.Mesh(cube_geom, this.mat);
    var c1 = new THREE.Mesh(cube_geom, this.mat);
    var c2 = new THREE.Mesh(cube_geom, this.mat);
    var c3 = new THREE.Mesh(cube_geom, this.mat);
    var c4 = new THREE.Mesh(cube_geom, this.mat);
    c1.scale.set(0.5, 1, 0.5);
    c2.scale.set(0.5, 0.5, 1);
    c3.scale.set(1, 0.5, 0.5);
    c4.scale.set(0.75, 0.75, 0.75);
    c1.userData = this;
    c2.userData = this;
    c3.userData = this;
    c4.userData = this;
  


    var csub = new CSG();
    csub.union([c1,c2,c3]);
    var csubm = csub.toMesh();

    var csg_f = new CSG();
    csg_f.subtract([cube, csubm]);
    csg_f.union([c4]);
    var mesh = csg_f.toMesh();
    mesh.position.y = 0.5;
    mesh.userData = this;
    box.add(mesh);
    return box;
  }

  shot(ship)
  {
    var value = Math.floor(Math.random() * ship.WEAPONS);
    ship.changeWeapon(value);

    //Romper caja
    this.nodoRot.remove(this.box);
  }

  collision(collider, snd)
  {
    if (collider instanceof MyShip)
    {
      this.shot(collider);
      collider.hit(this.dmg);
    }
    else
    {
      //Colisión con disparo
      this.shot(collider.ship);
      collider.destroy();
    }
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    //var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    /*folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI*2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');*/
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { MyBox };
