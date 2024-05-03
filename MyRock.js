import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MyCrystal } from './MyCrystal.js';
 
class MyRock extends THREE.Object3D {
  constructor(gui,titleGui, isCrystal, geomTubo, angle, pos) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    //Vida cristal
    this.hp = 1;

    //Tubo - Obtener información del tubo
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    // Crear una textura 
    var textureLoader = new THREE.TextureLoader();
    var texture, textSettings; 
    if (isCrystal == true)
    {
      texture = textureLoader.load('../imgs/mineraltex.jpg');
      textSettings = {
        color: 0x4AF8FF, // Color del cristal
        transparent: true, // Hacer el material transparente
        opacity: 0.9, // Nivel de transparencia (0 = completamente transparente, 1 = completamente opaco)
        roughness: 0.1, // Rugosidad del cristal (0 = completamente liso, 1 = muy rugoso)
        clearcoat: 1, // Capa transparente adicional para dar brillo al cristal
        clearcoatRoughness: 0.1, // Rugosidad de la capa transparente
        transmission: 0.5, // Transmitancia del material (0 = totalmente opaco, 1 = totalmente transparente)
        ior: 1.5,
        map: texture
      }
    }
    else
    {
      //var textN = new THREE.TextureLoader().load('../imgs/ground-nmap.jpg');
      var textB = new THREE.TextureLoader().load('../imgs/stone-bmap.jpg');
      var text = new THREE.TextureLoader().load('../imgs/stone-texture.jpg');
      textSettings = {
        transparent: false, // Hacer el material transparente
        opacity: 1, // Nivel de transparencia (0 = completamente transparente, 1 = completamente opaco)
        roughness: 1, // Rugosidad del cristal (0 = completamente liso, 1 = muy rugoso)
        metalness: 0.1, // Metalidad del cristal (0 = no metálico, 1 = completamente metálico)
        transmission: 0, // Transmitancia del material (0 = totalmente opaco, 1 = totalmente transparente)
        map: text,
        bumpMap: textB,
        bumpScale: 3
      }    
    } 

    this.mat = new THREE.MeshStandardMaterial(textSettings);
    this.mesh = this.createRock();
    this.crystal = this.createCrystal();
    this.crystal.visible = false;
    
    
    var max = 1.5;
    var min = 0.6;
    this.isCrystal = isCrystal;
    this.dmg = 10; //Daño que causa chocarse contra la piedra
    if (isCrystal == false)
      this.mesh.scale.set(Math.random() * (max - min) + min, Math.random() * (max - min) + min, Math.random() * (max - min) + min);
    else
      this.mesh.scale.set(0.7, 1.35, 0.67);


    
//-----------------------------------------------------------------------

    //Subir la roca r en y
    this.crystal.position.y = this.radio + 1.5;
    this.crystal.scale.set(this.crystal.scale.x*3, this.crystal.scale.y*3, this.crystal.scale.z*3)
    this.mesh.position.y = this.radio - 0.4;
    this.mesh.scale.set(this.mesh.scale.x*5, this.mesh.scale.y*5, this.mesh.scale.z*5)

    //Rotación
    this.nodoRot = new THREE.Object3D();
    this.nodoRot.add(this.mesh, this.crystal);

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

    this.add(this.nodoPosTubo)
  }
  
  createCrystal()
  {
    //Material
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/mineraltex.jpg');
    var mat = new THREE.MeshPhysicalMaterial({
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


    //
    var crystal = new THREE.Object3D();

    //Geometria
    var geom = new THREE.ConeGeometry(1, 1, 3, 1);
    var m1 = new THREE.Mesh(geom, mat);
    var m2 = new THREE.Mesh(geom, mat);
    m2.rotateX(Math.PI);
    m2.position.y = -0.5;
    m1.userData = this;
    m2.userData = this;
    crystal.add(m1, m2);
    crystal.scale.set(0.25, 0.25, 0.25);
    crystal.position.y = 0.25;
    crystal.userData = this;
    return crystal;
  }

  createRock()
  {
    var rock = new THREE.Object3D();

    //Shape
    var shape = new THREE.Shape();
    shape.lineTo(0.4, 0);
    shape.moveTo(0.4, 0);
    shape.lineTo(0.5, 0.125);
    shape.moveTo(0.5, 0.125);
    shape.lineTo(0.4, 0.45);
    shape.moveTo(0.4, 0.45);
    shape.lineTo(0.3, 0.8);
    shape.moveTo(0.3, 0.8);
    shape.lineTo(0, 1);
    shape.moveTo(0, 1);
    shape.lineTo(-0.2, 0.85);
    shape.moveTo(-0.2, 0.85);
    shape.lineTo(-0.4, 0.35);
    shape.moveTo(-0.4, 0.35);
    shape.lineTo(-0.5, 0.125);
    shape.moveTo(-0.5, 0.125);
    shape.lineTo(-0.45, 0);

    var extrudeSettings = {
      depth: 1, // Profundidad de la extrusión
      bevelEnabled: false // Desactivar el biselado para mantener la forma original
    };

    var geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var cgeom = new THREE.BoxGeometry(1,1,1);
    var mesh = new THREE.Mesh( geom, this.mat );
    var c1 = new THREE.Mesh(cgeom, this.mat);
    var c2 = new THREE.Mesh(cgeom, this.mat);
    var c3 = new THREE.Mesh(cgeom, this.mat);
    var c4 = new THREE.Mesh(cgeom, this.mat);
    var c5 = new THREE.Mesh(cgeom, this.mat);
    var c6 = new THREE.Mesh(cgeom, this.mat);

    c2.scale.set(0.56, 1.5, 0.62);
    c2.rotateX(0.52);
    c2.rotateY(0.94);
    c2.position.x = 0.49;
    c2.position.y = 0.72;
    
    c1.scale.set(0.8, 2.18, 0.56);
    c1.rotateX(0.59);
    c1.position.set(0.05, 0.39, -0.39);

    c3.scale.set(0.67, 2.12, 0.62);
    c3.rotation.set(0.38, 0.94, 2.6);
    c3.position.set(-0.39, 0, 0.05); 

    c4.scale.set(0.77, 3.38, 2.13);
    c4.rotation.set(0, 0.58, 2.74);
    c4.position.set(-0.75, 0, 0.58);

    c5.scale.set(0.45, 1, 1);
    c5.position.set(-0.39, 0.28, 0.49);

    c6.rotateX(0.87);
    c6.position.set(0, 0.83, 1.37);

    var csg1 = new CSG();
    csg1.subtract([mesh, c1]);
    csg1.subtract([c2]);
    csg1.subtract([c3]);
    csg1.subtract([c4]);
    csg1.subtract([c5]);
    csg1.subtract([c6]);
    var part = csg1.toMesh();
    part.scale.set(1.5, 1, 1);
    part.userData = this;
    rock.add(part);
    return rock;
  }

  breakCrystal()
  {
    this.nodoRot.remove(this.mesh);
    this.crystal.visible = true;
  }

  shot()
  {
    if (this.crystal.visible == false)
    {
      if (this.isCrystal == true)
      {
        
        if (this.hp <= 0)
        {
          //Romper el cristal - Efecto de golpe
          //this.mesh.material.color.set(0xff0000);
          this.breakCrystal();
        }
        else
        {
          var mesh = this.mesh.children.find(child => child instanceof THREE.Mesh);
          var textureLoader = new THREE.TextureLoader();
          var texture = textureLoader.load('../imgs/mineraltex-broken.jpg');
          var textbmap = textureLoader.load('../imgs/stone-bmap.jpg'); 
          var textSettings = {
            color: 0xB3FAFC, // Color del cristal
            transparent: true, // Hacer el material transparente
            opacity: 0.9, // Nivel de transparencia (0 = completamente transparente, 1 = completamente opaco)
            roughness: 0.2, // Rugosidad del cristal (0 = completamente liso, 1 = muy rugoso)
            metalness: 0.6, // Metalidad del cristal (0 = no metálico, 1 = completamente metálico)
            clearcoat: 1, // Capa transparente adicional para dar brillo al cristal
            clearcoatRoughness: 0.1, // Rugosidad de la capa transparente
            transmission: 0.9, // Transmitancia del material (0 = totalmente opaco, 1 = totalmente transparente)
            ior: 1.5,
            map: texture,
            bumpMap: textbmap, 
          }
          var mat = new THREE.MeshStandardMaterial(textSettings);
          mesh.material = mat;
          this.hp--;
        }
      }
    }
  }

  collision(ship)
  {
    if (this.isCrystal == true)
    {
      //No es mineral
      if (this.crystal.visible == false)
      {
        ship.hit(this.dmg);
        this.breakCrystal();
      }
      else
      {
        ship.getCrystal();
        this.nodoRot.remove(this.crystal);
      }
    }
    else
    {
      //Es una roca
      ship.hit(this.dmg);
    }
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
    /*var folder = gui.addFolder (titleGui);
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
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');*/
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    if (this.crystal.visible == true) this.crystal.rotation.y += 0.01;
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { MyRock };
