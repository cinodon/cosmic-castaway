import * as THREE from '../libs/three.module.js'
 
class MyCrystal extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    

    //Material
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/mineraltex.jpg');
    this.mat = new THREE.MeshPhysicalMaterial({
      color: 0x4AF8FF, // Color del cristal
      transparent: false, // Hacer el material transparente
      opacity: 0.5, // Nivel de transparencia (0 = completamente transparente, 1 = completamente opaco)
      roughness: 0.7, // Rugosidad del cristal (0 = completamente liso, 1 = muy rugoso)
      metalness: 0.4, // Metalidad del cristal (0 = no metálico, 1 = completamente metálico)
      clearcoat: 1, // Capa transparente adicional para dar brillo al cristal
      clearcoatRoughness: 0.1, // Rugosidad de la capa transparente
      transmission: 0.9, // Transmitancia del material (0 = totalmente opaco, 1 = totalmente transparente)
      ior: 1.5,
      map: texture
    });
    var mesh = this.createCrystal();

    this.add (mesh);
  }
  
  createCrystal()
  {
    //
    var crystal = new THREE.Object3D();

    //Geometria
    var geom = new THREE.ConeGeometry(1, 1, 3, 1);
    var m1 = new THREE.Mesh(geom, this.mat);
    var m2 = new THREE.Mesh(geom, this.mat);
    m2.rotateX(Math.PI);
    m2.position.y = -0.5;

    crystal.add(m1, m2);
    crystal.scale.set(0.25, 0.25, 0.25);
    crystal.position.y = 0.25;
    return crystal;
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
    this.rotation.y += 0.01;
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { MyCrystal };
