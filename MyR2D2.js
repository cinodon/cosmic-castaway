import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyR2D2 extends THREE.Object3D {
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

    //Geometria
    var headG = new THREE.CylinderGeometry(0.1, 0.2, 0.2);
    headG.translate(0, 0.1, 0);
    
    var bodyG =  new THREE.CylinderGeometry(0.2, 0.2, 0.5);
    bodyG.translate(0, -0.25+0.0625, 0);
    
    var armG = new THREE.BoxGeometry(0.1, 0.7, 0.2);
    armG.translate(0, 0.35, 0);

    this.armRM = new THREE.Mesh(armG, this.mat);
    this.armRM.position.set(0.05+0.2, 0, 0);

    this.armLM = new THREE.Mesh(armG, this.mat);
    this.armLM.position.set(-(0.2+0.05), 0, 0);

    this.bodyM = new THREE.Mesh(bodyG, this.mat);
    
    this.bodyM.position.y = 0.5-0.0625+0.2; //0.7

    this.headM = new THREE.Mesh(headG, this.mat);
    this.headM.position.y = 0.0625;
    this.bodyM.add(this.headM);

    
    this.add(this.armLM, this.armRM, this.bodyM);
  }
  
  

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      armS : 1.0,
      rotB : 0.0,
      rotH : 0.0,

      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.rotB = 0.0;
        this.guiControls.armS = 1.0;
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
    folder.add (this.guiControls, 'armS', 1.0, 2.0, 0.01).name ('Brazos : ').listen();
    folder.add (this.guiControls, 'rotB', -Math.PI/4, Math.PI/4, 0.01).name ('Cuerpo : ').listen();
    folder.add (this.guiControls, 'rotH', 0, 2*Math.PI, 0.01).name ('Cabeza : ').listen();

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
    this.armLM.scale.y = this.guiControls.armS;
    this.armRM.scale.y = this.guiControls.armS;
    this.bodyM.position.y = 0.5-0.0625+0.2 + (0.7*this.guiControls.armS - 0.7);
    this.bodyM.rotation.x = this.guiControls.rotB;
    this.headM.rotation.y = this.guiControls.rotH;
    

  }
}

export { MyR2D2 };
