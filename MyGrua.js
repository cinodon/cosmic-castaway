import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyGrua extends THREE.Object3D {
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
    var brazoG = new THREE.BoxGeometry(2, 0.5, 0.5);
    brazoG.translate(0.9, 0, 0);
    var plumaG = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    plumaG.translate(0, -0.3/2, 0);

    this.brazoM = new THREE.Mesh(brazoG, this.mat);
    
    this.plumaM = new THREE.Mesh(plumaG, this.mat);
    this.plumaM.position.y = -0.25;
    this.brazoM.add(this.plumaM);
    
    this.add(this.brazoM);
  }
  
  

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      armS : 0.0,
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
    folder.add (this.guiControls, 'armS', 0.0, 2.0, 0.01).name ('Brazos : ').listen();
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
    this.brazoM.rotation.y = this.guiControls.rotH;
    this.plumaM.position.x = this.guiControls.armS;
    

  }
}

export { MyGrua };
