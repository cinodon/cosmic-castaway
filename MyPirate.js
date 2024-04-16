import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js' 
import { MyShip } from './MyShip.js';

class MyPirate extends MyShip {
  constructor(gui,titleGui) {
    super(gui, titleGui, );
    
    //Material

    // Crear un material que use esa textura
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;

    // Ya podemos construir el Mesh
    var mesh = this.createPirate();

    // Y añadirlo como hijo del Object3D (el this)
    this.add (mesh);
    
  }
  
  createPirate()
  {
    var pirate = new THREE.Object3D();
    var head = this.createHead();
    var body = this.createBody();
    var armR = this.createArm();
    var armL = this.createArm();
    var legR = this.createArm();
    var legL = this.createArm();


    //Transformaciones
    head.position.y = 1.2;

    //Brazos
    armR.position.x = -0.6;
    armR.rotateX(-Math.PI/4);
    armR.rotateZ(Math.PI/8);
    armL.position.x = 0.6;
    armL.rotateX(-Math.PI/4);
    armL.rotateZ(-Math.PI/8);

    //Piernas
    legR.rotateX(-Math.PI/2);
    legR.position.x = -0.3;
    legR.position.y = 0.1;
    legL.rotateX(-Math.PI/2);
    legL.position.x = 0.3;
    legL.position.y = 0.1;
    legR.scale.set(1, 1.5, 1);
    legL.scale.set(1, 1.5, 1);

    pirate.add(head, body, armR, armL, legR, legL);
    pirate.scale.set(0.8, 0.8, 0.8);
    pirate.position.y = 0.3;
    pirate.position.z = -1;
    return pirate;

  }

  createHead()
  {
    var head = new THREE.Object3D();
    var sphG = new THREE.SphereGeometry(0.25, 6, 8);
    var tetG = new THREE.ConeGeometry(0.3, 0.5, 3);
    var face = new THREE.Mesh(sphG, this.mat);
    face.position.y = 0.4
    var mouth = new THREE.Mesh(tetG, this.mat);
    mouth.position.y = 0.25;
    mouth.position.z = 0.15;

    head.add(face, mouth);
    return head;
  }

  createArm()
  {
    var arm = new THREE.Object3D();

    //Hombro
    var spG = new THREE.SphereGeometry(0.1);
    var cilG = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    var cilG2 = new THREE.CylinderGeometry(0.05, 0.1, 0.05);
    var cilG3 = new THREE.CylinderGeometry(0.1, 0.1, 0.6);
    var spM = new THREE.Mesh(spG, this.mat);
    var cilM = new THREE.Mesh(cilG, this.mat);
    var cilM2 = new THREE.Mesh(cilG2, this.mat);
    var cilM3 = new THREE.Mesh(cilG3, this.mat);
    cilM.position.y = -0.2;
    cilM2.position.y = -0.3;
    cilM3.position.y = -0.625;

    arm.add(spM, cilM, cilM2, cilM3);
    arm.position.y = 0.925;
    
    return arm;
  }

  createBody()
  {
    var body = new THREE.Object3D();
    var geomBox = new THREE.BoxGeometry(1, 0.6, 0.3);
    var gCil = new THREE.CylinderGeometry(0.05, 0.1, 1.2);
    var boxTop = new THREE.Mesh(geomBox, this.mat);
    var boxBot = new THREE.Mesh(geomBox, this.mat);
    var cil = new THREE.Mesh(gCil, this.mat);
    boxBot.scale.set(0.4, 0.2/0.6, 1);
    boxBot.position.y = -0.7;

    body.add(boxTop, cil, boxBot);
    body.position.y = 0.8;
    return body;
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
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
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

export { MyPirate };
