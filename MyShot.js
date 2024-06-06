import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyShot extends THREE.Object3D {
  constructor(gui,titleGui, geomTubo, angle, pos, spd, ship) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Propiedades
    this.ship = ship;
    switch(this.ship.currentWeapon)
    {
      case 0:
        this.dmg = 1;
      break;

      case 1:
        this.dmg = 2.5;
      break;

      case 2:
        this.dmg = 0.75;
      break;
    }


    //Tubo - Obtener información del tubo
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    //Propiedades del movimiento
    //Para controlar espacio, tiempo y velocidad
    this.t = pos; //Posición longitudinal - 0 origen
    this.totalD = pos;
    this.end = pos + 0.1;
    this.destroyed = false;
    var timeTotal = 25; //Tiempo total del circuito en segundos
    this.spd = spd*2; //Velocidad
    //---------------------------------------------------------
    //Reloj
    this.clock = new THREE.Clock();
    this.clock.start();

    //Material y mesh
    var over = 1;
    var mat = new THREE.MeshStandardMaterial();
    mat.color.setHex(0x00F8FC);
    mat.emissive.set(0xB7FAFC);
    var geom = new THREE.SphereGeometry(0.25);
    this.shot = new THREE.Mesh(geom, mat);
    this.shot.scale.set(1, 1, 2);
    this.shot.position.set(0, this.radio+over, 0);
    this.light = new THREE.PointLight(0x01FAE5);
    this.light.power = 100;
    this.light.position.set(0, this.radio+over, 0);
    //this.light.add(this.shot);

    //Rotación
    this.nodoRot = new THREE.Object3D();
    this.nodoRot.add(this.shot);

    //Posición
    this.nodoPosTubo = new THREE.Object3D();
    this.nodoPosTubo.add(this.nodoRot);

    //Colocar rotación
    this.nodoRot.rotation.z = angle

    //Posicionar
    var posTmp = this.path.getPointAt (pos);
    this.nodoPosTubo.position.copy(posTmp);

    //Orientación
    var tangente = this.path.getTangentAt(pos);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(pos * this.segmentos);
    this.nodoPosTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosTubo.lookAt (posTmp);

    this.add(this.nodoPosTubo);
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
    
  
  }
  
  actualizarPosicion()
  {
    //Colocar la bala
    var posTmp = this.path.getPointAt (this.t);
    this.nodoPosTubo.position.copy(posTmp);

    //Orientación
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosTubo.lookAt (posTmp);  
  }

  destroy()
  {
    this.totalD = this.end;
    this.destroyed = true;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    var time = this.clock.getDelta(); 
    this.t += this.spd * time;
    if (this.destroyed == false) this.totalD += this.spd * time;
    if (this.t >= 1) 
    {
      //Destruir bala?
      this.t = 0;
    }
    this.actualizarPosicion();
  }
}

export { MyShot };
