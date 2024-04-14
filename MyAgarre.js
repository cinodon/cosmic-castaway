import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyAgarre extends THREE.Object3D {
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

    var mesh = this.createFront();

    this.add(mesh)
  }
  
  createFront()
  {
    var box_sub_g = new THREE.BoxGeometry(3, 3, 7);
    var box = new THREE.Mesh(box_sub_g, this.mat);

    var geom = new THREE.CapsuleGeometry(0.25, 1, 10, 20);
    var glass = new THREE.ConeGeometry(1, 1, 20, 1, true);
    var fl = new THREE.Mesh(geom, this.mat);
    var ff_punta = new THREE.Mesh(geom, this.mat); 
    var fr = new THREE.Mesh(geom, this.mat);
    var ff = new THREE.Mesh(geom, this.mat);

    //Rotacion
    glass.rotateX(Math.PI/2);
    fl.rotateX(Math.PI/2);  
    fr.rotateX(Math.PI/2);
    ff.rotateX(Math.PI/2);
    ff_punta.rotateX(Math.PI/2);

    //Escalado
    glass.scale.set(0.5, 1, 0.5);
    ff.scale.set(3, 1.5, 1);
    ff_punta.scale.set(3, 5, 1);

    //Traslación
    fl.position.x = -0.5;
    fr.position.x = 0.5;
    ff.position.z = 0.25;
    box.position.z = 1;



    //CSG para la punta
    var csg = new CSG();
    csg.subtract([ff_punta, box])
    
    var punta = csg.toMesh();
    punta.rotateX(Math.PI);
    punta.position.z = -1.5;
    
    var front = new THREE.Object3D();
    
    //Redondeamos la zona del asiento restando una esfera
    var spg = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI);
    var sp = new THREE.Mesh(spg, this.mat);
    sp.position.z = -0.75;

    var csg2 = new CSG();
    csg2.union([fl, fr]);
    csg2.union([ff]);
    csg2.subtract([sp]);
    
    var ft = csg2.toMesh();

    front.add(ft, punta);
    front.rotateY(Math.PI);
    front.position.y = 0.25; 

    return front;
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

export { MyAgarre };
