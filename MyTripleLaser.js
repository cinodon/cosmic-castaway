import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
 
class MyTripleLaser extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    
    var mesh = this.createTripleLaser();

    this.add(mesh)
  }
  
  createTripleLaser()
  {
    var canon = new THREE.Object3D();
    
    //Textures
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/black_leather.jpeg');
    var mango_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true });

    texture = textureLoader.load('../imgs/weapon-tex.jpg');
    var culata_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true});


    //Creación de geometrías 
    //---------------------------------
    //Mango
    var shape = new THREE.Shape();
    shape.quadraticCurveTo(0.01, 0.025, 0.05, 0.15);
    shape.moveTo(0.05, 0.15);
    shape.lineTo(0.1, 0.15);
    shape.moveTo(0.1, 0.15);
    shape.lineTo(0.1, 0);

    //Propiedades
    var extrudeSettings = {
      depth: 0.05, // Profundidad de la extrusión
      bevelEnabled: false // Desactivar el biselado para mantener la forma original
    };

    var mangoG = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    //Culata
    var shape = new THREE.Shape();
    shape.quadraticCurveTo(0.01, 0.025, 0.05, 0.15);
    shape.moveTo(0.05, 0.15);
    shape.lineTo(0.4, 0.15);
    shape.moveTo(0.4, 0.15);
    shape.lineTo(0.4, 0);

    //Propiedades
    var extrudeSettings = {
      depth: 0.1, // Profundidad de la extrusión
      bevelEnabled: false // Desactivar el biselado para mantener la forma original
    };

    var culataG = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    //Cañon
    var cilG1 = new THREE.CylinderGeometry(0.005, 0.005, 0.4);
    var cilG2 = new THREE.CylinderGeometry(0.05, 0.05, 0.025);


    //---------------------------------
    


    //Crear mesh
    var mangoM = new THREE.Mesh(mangoG, mango_mat) ;
    var culataM = new THREE.Mesh(culataG, culata_mat) ;
    var placa1 = new THREE.Mesh(cilG2, culata_mat) ;
    var placa2 = new THREE.Mesh(cilG2, culata_mat) ;
    var canonM1 = new THREE.Mesh(cilG1, culata_mat) ;
    var canonM2 = new THREE.Mesh(cilG1, culata_mat) ;
    var canonM3 = new THREE.Mesh(cilG1, culata_mat) ;


    //Posicionar
    mangoM.position.x = -0.05;
    mangoM.position.z = -0.025;

    culataM.position.x = -0.05;
    culataM.position.z = -0.05;
    culataM.position.y = 0.15;

    placa1.rotateZ(3*Math.PI/2);
    placa1.position.y = 0.225;
    placa1.position.x = 0.36;

    placa2.rotateZ(3*Math.PI/2);
    placa2.position.y = 0.225;
    placa2.position.x = 0.5;

    canonM1.rotateZ(3*Math.PI/2);
    canonM1.position.x = 0.4;
    canonM1.position.y = 0.225+0.0375;

    canonM2.rotateZ(3*Math.PI/2);
    canonM2.position.x = 0.4;
    canonM2.position.z = 0.036;
    canonM2.position.y = 0.21;

    canonM3.rotateZ(3*Math.PI/2);
    canonM3.position.x = 0.4;
    canonM3.position.z = -0.036;
    canonM3.position.y = 0.21;

    canon.add(mangoM, culataM, canonM1, canonM2, canonM3, placa1, placa2);
    return canon;
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

export { MyTripleLaser };
