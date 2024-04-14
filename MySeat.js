import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MySeat extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Shape
    //var geom = new THREE.CapsuleGeometry(0.25, 1, 10, 20);
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;

    var mesh = this.createSeat();

    this.add(mesh)
  }
  
  createSeat()
  {
    //Objeto final
    var seat = new THREE.Object3D();

    //Partes
    //Placa de sujección
    var bgeom = new THREE.BoxGeometry(1,1,1);
    var box = new THREE.Mesh(bgeom, this.mat);

    //Transformaciones a la placa
    box.scale.set(1, 0.1, 1.9);
    box.position.y = 0.1;
    box.position.z = 1;

    //Asiento
    var shape = new THREE.Shape();
    var swm = 0.05;
    var sw = swm - 0.02;
    var sh = 0.72;
    var x = 0;
    var y = 0;
    shape.lineTo(sw, 0);
    shape.moveTo(sw, 0);
    shape.quadraticCurveTo(x + 2*swm, y + sh/3 + sh/6, x + sw, y + sh/3);
    shape.moveTo(x + sw, y + sh/3);
    shape.quadraticCurveTo(x + 2*swm, y + sh/3 + sh/6, x + sw, y + 2*sh/3);
    shape.moveTo(x + swm, y + 2*sh/3);
    shape.quadraticCurveTo(x + 2*swm, y + 2*sh/3 + sh/6, 0, y + 3*sh/3);
    

    //Propiedades
    var extrudeSettings = {
      depth: 0.7, // Profundidad de la extrusión
      bevelEnabled: true // Desactivar el biselado para mantener la forma original
    };

    var seat_g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var seat_part = new THREE.Mesh (seat_g, this.mat);
    seat_part.rotateY(3*Math.PI/2);
    seat_part.position.x = -0.35;
    

    //Añadir partes
    seat.add(seat_part, box);
    return seat;
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

export { MySeat };
