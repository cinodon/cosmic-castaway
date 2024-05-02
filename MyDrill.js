import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyDrill extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Shape
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;

    var l = 0.25;
    var rl = 0.025;
    var s = 0.15;
    var jw = rl*2 + 0.005;
    var jr = 0.05;
    var cr = 0.1;
    var ch = 0.5; 
    var cilLG = new THREE.CylinderGeometry(rl, rl, l);
    var cilSG = new THREE.CylinderGeometry(rl, rl, s);
    var cilJ = new THREE.CylinderGeometry(jr, jr, jw);
    var conoG = new THREE.ConeGeometry(cr, ch);
    cilLG.translate(0, l/2, 0);
    cilSG.translate(0, s/2, 0);
    cilJ.rotateX(Math.PI/2);
    conoG.translate(0, ch/2, 0)


    var c0 = new THREE.Mesh(cilSG, this.mat);
    var c1 = new THREE.Mesh(cilLG, this.mat);
    var c2 = new THREE.Mesh(cilLG, this.mat);
    this.cone = new THREE.Mesh(conoG, this.mat);
    this.cj0 = new THREE.Mesh(cilJ, this.mat);
    this.cj1 = new THREE.Mesh(cilJ, this.mat);

    
    c0.add(this.cj0);
    this.cj0.add(c1)
    this.cj0.position.y = jr + s;
    c1.position.y = jr;
    //cj0.rotateZ(Math.PI/2)
    c1.add(this.cj1);
    this.cj1.position.y = l + jr;
    this.cj1.add(c2);
    c2.position.y = jr;
    c2.add(this.cone);
    this.cone.position.y = l;
    
    //Animation
    this.animDir = 1;
    var animFrames = 100;
    this.cj0Init = -1.24;
    this.cj0End = Math.PI/2;
    this.inc0 = (this.cj0End-this.cj0Init)/animFrames;

    this.cj1Init = 2.65;
    this.cj1End = 0;
    this.inc1 = -(this.cj1Init/animFrames);

    this.cj0.rotateZ(this.cj0Init);
    this.cj1.rotateZ(this.cj1Init);

    c0.rotateY(Math.PI/2);
    this.add(c0);
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

    var csub = new CSG();
    csub.union([c1,c2,c3]);
    var csubm = csub.toMesh();

    var csg_f = new CSG();
    csg_f.subtract([cube, csubm]);
    csg_f.union([c4]);
    var mesh = csg_f.toMesh();

    box.add(mesh);
    box.position.y = 0.5;
    return box;
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.65,
      
      rotX0 : 0.0,
      rotY0 : 0.0,
      rotZ0 : -1.24,
      
      rotX1 : 0.0,
      rotY1 : 0.0,
      rotZ1 : 2.65,
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;

        this.guiControls.rotX0 = 0.0;
        this.guiControls.rotY0 = 0.0;
        this.guiControls.rotZ0 = -1.24;

        
        this.guiControls.rotX1 = 0.0;
        this.guiControls.rotY1 = 0.0;
        this.guiControls.rotZ1 = 2.65;
        
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI*2, 0.01).name ('Rotación Z : ').listen();
    folder.add (this.guiControls, 'rotX0', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY0', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ0', -1.24, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    folder.add (this.guiControls, 'rotX1', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY1', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ1', 0.0, 2.65, 0.01).name ('Rotación Z : ').listen();
    //-1.24
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  anim()
  {
    this.cj0.rotation.z += this.inc0*this.animDir;
    this.cj1.rotation.z += this.inc1*this.animDir;

    if ((this.cj1.rotation.z <= this.cj1End) || (this.cj1.rotation.z >= this.cj1Init)) this.animDir *= -1;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.rotation.set (this.guiControls.rotX, this.guiControls.rotY, this.guiControls.rotZ);
    //this.cj0.rotation.set(this.guiControls.rotX0, this.guiControls.rotY0, this.guiControls.rotZ0);
    //this.cj1.rotation.set(this.guiControls.rotX1, this.guiControls.rotY1, this.guiControls.rotZ1);
    this.cone.rotation.y += 0.1;
    this.anim();


  }
}

export { MyDrill };
