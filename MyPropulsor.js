import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
 
class MyPropulsor extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Shape
    var shape = new THREE.Shape();
    var x = 0; 
    var y = 0;
    var puntaW = 0.072;
    var anchoMax = 0.36;
    var puntaH = 0.4;
    var propulsorL = 4;
    var propulsorBorde = 0.288;
    var propulsorLMax = 4.2;
    var turbinaW = 0.216;
    var bordeH = 3.6;
    shape.lineTo(x + puntaW, y);
    shape.moveTo(x + puntaW, y);
    shape.lineTo(x + anchoMax, y + puntaH);
    shape.moveTo(x + anchoMax, y + puntaH);
    shape.lineTo(anchoMax, propulsorL);
    shape.moveTo(anchoMax, propulsorL);
    shape.lineTo(propulsorBorde, propulsorL);
    shape.moveTo(propulsorBorde, propulsorL);
    shape.lineTo(propulsorBorde, bordeH);
    shape.moveTo(propulsorBorde, bordeH);
    shape.lineTo(turbinaW, bordeH);
    shape.moveTo(turbinaW, bordeH);
    shape.lineTo(turbinaW, propulsorLMax);
    shape.moveTo(turbinaW, propulsorLMax);
    shape.lineTo(x, propulsorLMax);


    var geom = new THREE.LatheGeometry(shape.getPoints(), 20, 0, 2*Math.PI);
    
    var mat = new THREE.MeshNormalMaterial();
    mat.flatShading = true;
    mat.needsUpdate = true;
    
    var mesh = new THREE.Mesh( geom, mat ) ;

    this.add(mesh)
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

export { MyPropulsor };
