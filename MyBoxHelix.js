import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MyBox } from './MyBox.js';

class MyBoxHelix extends MyBox {
  constructor(gui, titleGui) {
    super(gui, titleGui); // Llama al constructor de la clase padre con los mismos parámetros
    // Aquí no es necesario llamar a this.createGUI(gui, titleGui) ya que se hereda de MyBox
    
    // Resto del constructor
    //Shape
    //var geom = new THREE.CapsuleGeometry(0.25, 1, 10, 20);
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    this.mat.side = THREE.DoubleSide;


    this.helix = this.createHelix();

    this.pos = this.position.y;
    this.POS_MAX = this.pos + 0.5;
    this.POS_MIN = this.pos - 0.5;
    this.speed = 0.01;
    this.add(this.helix);
  }
  
  createHelix() 
  {
    var helix = new THREE.Object3D();

    //Partes
    var cil = new THREE.CylinderGeometry(1, 1, 1);
    var c1 = new THREE.Mesh(cil, this.mat);
    var c2 = new THREE.Mesh(cil, this.mat);
    //Escalado
    c1.scale.set(0.05, 1, 0.05);
    c2.scale.set(0.1, 0.5, 0.1);
    
    //Ajuste de posiciones
    c1.position.y = 0.8;
    c2.position.y = 1 + 0.5;
    //--------------------------------------------
    //Generar aspas
    var blade_s = new THREE.Shape();
    blade_s.lineTo(0.025, 0);
    blade_s.lineTo(0.025, 0.1);
    blade_s.lineTo(0.1, 0.1);
    blade_s.lineTo(0.15, 1.5);
    blade_s.lineTo(-0.15, 1.5);
    blade_s.lineTo(-0.1, 0.1);    
    blade_s.lineTo(-0.025, 0.1);
    blade_s.lineTo(-0.025, 0);

    var extrudeSettings = {
      depth: 0.01, // Profundidad de la extrusión
      bevelEnabled: false // Desactivar el biselado para mantener la forma original
    };

    var blade_g = new THREE.ExtrudeGeometry(blade_s, extrudeSettings);
    var blade1 = new THREE.Mesh(blade_g, this.mat);
    var blade2 = new THREE.Mesh(blade_g, this.mat);
    blade1.rotateX(Math.PI/2);
    blade1.rotateY(Math.PI/24);
    blade2.rotateX(3*Math.PI/2);
    blade2.rotateY(Math.PI/24);
    blade1.position.y = 1.5;
    blade2.position.y = 1.49;
    blade1.position.z = 0.1;
    blade2.position.z = -0.1;

    helix.add(c1, c2, blade1, blade2);
    return helix;
  }

  animationHelix()
  {
    //Giro de la hélice
    this.helix.rotation.y += 0.1;
    
    //Añadir flotar
  }

  update()
  {
    super.update();


    this.animationHelix();
    this.pos += this.speed;
    if ((this.pos > this.POS_MAX) || (this.pos < this.POS_MIN)) this.speed = -this.speed;
    this.position.y = this.pos;
  }
}


export { MyBoxHelix };
