import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MyBox } from './MyBox.js';

class MyBoxHelix extends MyBox {
  constructor(gui,titleGui, geomTubo, angle, pos) {
    super(gui, titleGui, geomTubo, angle, pos); // Llama al constructor de la clase padre con los mismos parámetros
    // Aquí no es necesario llamar a this.createGUI(gui, titleGui) ya que se hereda de MyBox
    
    //Animaciones
    var ANIMS = 2;
    this.anim = Math.floor(Math.random() * ANIMS);
    this.angle = 0;
    this.rotSpd = 0.005;
    this.rotSpdY = 0.01;


    // Resto del constructor
    //Shape
    //var geom = new THREE.CapsuleGeometry(0.25, 1, 10, 20);




    this.helix = this.createHelix();
    this.helix.userData = this;
    //this.helix.scale.set(3, 3, 3);
    var over = 10;
    this.box.position.y = this.radio + over;
    if (this.anim == 1) this.box.position.x = 10;
    this.box.add(this.helix);
    

    if (this.anim == 1)
    {
      this.nodoRotY = new THREE.Object3D();
      this.nodoRot.remove(this.box);
      this.nodoRotY.add(this.box);
      this.nodoRot.add(this.nodoRotY);
    }

  }
  
  createHelix() 
  {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/rusty-metal.jpg');
    var helix_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, metalness: 0.5 });
    var helix = new THREE.Object3D();

    //Partes
    var cil = new THREE.CylinderGeometry(1, 1, 1);
    var c1 = new THREE.Mesh(cil, helix_mat);
    var c2 = new THREE.Mesh(cil, helix_mat);
    //Escalado
    c1.scale.set(0.05, 1, 0.05);
    c2.scale.set(0.1, 0.5, 0.1);
    
    //Ajuste de posiciones
    c1.position.y = 0.8;
    c2.position.y = 1 + 0.5;

    c1.userData = this;
    c2.userData = this;
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
    var blade1 = new THREE.Mesh(blade_g, helix_mat);
    var blade2 = new THREE.Mesh(blade_g, helix_mat);
    blade1.rotateX(Math.PI/2);
    blade1.rotateY(Math.PI/24);
    blade2.rotateX(3*Math.PI/2);
    blade2.rotateY(Math.PI/24);
    blade1.position.y = 1.5;
    blade2.position.y = 1.49;
    blade1.position.z = 0.1;
    blade2.position.z = -0.1;

    blade1.userData = this;
    blade2.userData = this;

    helix.add(c1, c2, blade1, blade2);
    helix.userData = this;
    return helix;
  }

  animationHelix()
  {
    //Giro de la hélice
    this.helix.rotation.y += 0.1;
    
    //Añadir flotar
  }

  shot(ship, scene)
  {
    var value = Math.floor(Math.random() * ship.WEAPONS);
    ship.changeWeapon(value);

    //Romper caja
    this.box.remove(this.helix);
    if (this.anim == 1) this.nodoRot.remove(this.nodoRotY); else this.nodoRot.remove(this.box);

    //Recuperar vida
    ship.heal();

    scene.remove(this);
  }

  animObj()
  {
    switch(this.anim)
    {
      case 0:
        this.angle += this.rotSpd;
        if (this.angle > 2*Math.PI) this.angle = 0;
        this.nodoRot.rotation.z = this.angle;
      break;

      case 1:
        this.angle += this.rotSpdY;
        if (this.angle > 2*Math.PI) this.angle = 0;
        this.nodoRotY.rotation.y = this.angle;

      break;

      case 2:

      break;
    }    
  }

  update()
  {
    super.update();


    this.animationHelix();
    this.animObj();
    //this.pos += this.speed;
    //if ((this.pos > this.POS_MAX) || (this.pos < this.POS_MIN)) this.speed = -this.speed;
    //this.position.y = this.pos;
  }
}


export { MyBoxHelix };
