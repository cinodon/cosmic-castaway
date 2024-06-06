import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
 
class MyMegaRocket extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    
    var mesh = this.createMegaRocket();

    this.add(mesh)
  }
  
  createMegaRocket()
  {
    var canon = new THREE.Object3D();
    //Material
    //----------------------------------------
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/black_leather.jpeg');
    var mango_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false});

    texture = textureLoader.load('../imgs/bright-metal.jpeg');
    var part_mat = new THREE.MeshStandardMaterial({
      map: texture,                    // Utiliza la textura cargada
      flatShading: false,              // No usar sombreado plano para obtener transiciones de color suaves
      metalness: 0.5,
      roughness: 0.2,
      color: 0xE09437,
      emissive: 0xFEAE4E 
  });

    texture = textureLoader.load('../imgs/weapon-tex.jpg');
    var culata_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false});
    //----------------------------------------

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

    //Launcher
    var shape = new THREE.Shape();
    shape.lineTo(0.01, 0);
    shape.moveTo(0.01, 0);
    shape.lineTo(0.15, 0.1);
    shape.moveTo(0.15, 0.1);
    shape.lineTo(0.15, 0.12);
    shape.moveTo(0.15, 0.12);
    shape.lineTo(0.14, 0.12);
    shape.moveTo(0.14, 0.12);
    shape.lineTo(0.14, 0.13);
    shape.moveTo(0.14, 0.13);
    shape.lineTo(0.15, 0.13);
    shape.moveTo(0.15, 0.13);
    shape.lineTo(0.15, 0.15);
    shape.moveTo(0.15, 0.15);
    shape.lineTo(0.15, 0.6);
    shape.moveTo(0.15, 0.6);
    shape.lineTo(0.2, 0.75);
    shape.moveTo(0.2, 0.75);
    shape.lineTo(0.15, 0.75);
    shape.moveTo(0.15, 0.75);
    shape.lineTo(0.05, 0.6);
    shape.moveTo(0.05, 0.6);
    shape.lineTo(0, 0.4);
    shape.moveTo(0, 0.4);
    var launcherG = new THREE.LatheGeometry(shape.getPoints(), 20, 0, 2*Math.PI);

    var torusG = new THREE.TorusGeometry(0.15, 0.05, 3);
    //---------------------------------
    


    //Crear mesh
    var mangoM = new THREE.Mesh(mangoG, mango_mat) ;
    var launcherM = new THREE.Mesh(launcherG, culata_mat);
    var partM1 = new THREE.Mesh(torusG, part_mat);
    var partM2 = new THREE.Mesh(torusG, part_mat);
    


    //Posicionar
    mangoM.position.x = -0.05;
    mangoM.position.z = -0.025;

    
    launcherM.rotateZ(3*Math.PI/2);
    launcherM.position.x = -0.3;
    launcherM.position.y = 0.25;

    partM1.rotateY(Math.PI/2);
    partM1.position.y = 0.25;
    partM1.position.x = 0.2;

    partM2.rotateY(Math.PI/2);
    partM2.position.y = 0.25;
    partM2.position.x = 0.3;

    canon.add(mangoM, launcherM, partM1, partM2);
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

export { MyMegaRocket };
