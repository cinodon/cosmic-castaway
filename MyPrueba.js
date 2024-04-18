import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyPrueba extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Shape
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    this.mat.side = THREE.DoubleSide;

    //Base
    var cilG = new THREE.CylinderGeometry(0.2, .2, 0.05);
    cilG.translate(0.1, 0.025, 0);
    var base = new THREE.Mesh(cilG, this.mat);

    var brazoG = new THREE.BoxGeometry(.5, .05, .05);
    brazoG.translate(0.225, 0, 0);
    
    this.brazo1 = new THREE.Mesh(brazoG, this.mat);
    this.brazo1.position.y = .05/2 + 0.05;
    this.brazo1.rotation.z = this.guiControls.rotB1;
    
    this.brazo2 = new THREE.Mesh(brazoG, this.mat);
    
    this.brazo2.position.x = this.brazo1.position.x + 0.5; 
    
    var cono = new THREE.ConeGeometry(0.05, 0.25);
    this.lamp
    
    this.brazo2.add(this.lamp);
    this.brazo1.add(this.brazo2);

    this.add(base,  this.brazo1);
  }
  
  

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      rotB1: 0.0,
      rotB2: 0.0,
      rotB3: 0.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.rotB1 = 0.0;
        this.guiControls.rotB2 = 0.0;
        this.guiControls.rotB3 = 0.0;
        
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
    folder.add (this.guiControls, 'rotB1', 0, Math.PI/2, 0.01).name ('Rot1 : ').listen();
    folder.add (this.guiControls, 'rotB2', -Math.PI/2, 0, -0.01).name ('Rot2: ').listen();
    folder.add (this.guiControls, 'rotB3', 0, Math.PI/2, 0.01).name ('Rot3 : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI*2, 0.01).name ('Rotación Z : ').listen();
    
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
    this.brazo1.rotation.z = this.guiControls.rotB1;
    this.brazo2.rotation.z = this.guiControls.rotB2;
    

  }
}

export { MyPrueba };
