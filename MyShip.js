import * as THREE from '../libs/three.module.js' 
import { CSG } from '../libs/CSG-v2.js' 
import * as TWEEN from '../libs/tween.esm.js' 

class MyShip extends THREE.Object3D {
  constructor(gui,titleGui, geomTubo) {
    super();
    
    // Creación del GUI
    this.createGUI(gui,titleGui);
    
    //Estadísticas
    this.VIDA_MAX = 100;
    this.vida = this.VIDA_MAX;
    this.mineral = 0;   //Equivalente a puntos
    this.invulnerable = false;

    this.partPos = []; //Objeto para almacenar Obj3D importantes para castear rayos

    //Propiedades de movimiento
    this.initMovementProperties(geomTubo);

    //Armas
    //----------------------------------------------------------
    this.initWeapons();
    //----------------------------------------------------------


    // Ya podemos construir el Mesh -- Nodo del personaje + traslación Y - posicionamiento
    var over = 1;
    this.ship = this.createShip();
    this.ship.add(this.megaR, this.laserC, this.tripleL); //Añadimos armas
    this.ship.position.y = this.radio + over;
    this.partPos.push(this.ship);
    
    //HIT PROPERTIES
    this.initHitProperties();

    //Nodo - Rotación - Movimiento lateral
    this.nodoRot = new THREE.Object3D();
    this.nodoRot.add(this.ship);

    //Nodo Orientación Tubo
    this.nodoPosOrientTubo = new THREE.Object3D();
    this.nodoPosOrientTubo.add(this.nodoRot);

    //Añadir
    this.add(this.nodoPosOrientTubo); 
  }
  
  //Inicializar Propiedades
//----------------------------------------------------------------------
  initMovementProperties(geomTubo)
  {
    //Para controlar espacio, tiempo y velocidad
    this.t = 0; //Posición longitudinal - 0 origen
    var timeTotal = 60; //Tiempo total del circuito en segundos
    this.spd = 1/timeTotal; //Velocidad
    this.MIN_SPD =  this.spd/2;
    //---------------------------------------------------------

    this.inc_spd = this.spd * 0.1; //Incremento de velocidad
    this.rotationSpeed = 0.03; //Velocidad de rotación
    this.angle = 0; // Rotación de la nave en la superficie del tubo
    this.on = 1;  //Hacer que la nave se detenga completamente
    //---------------------------------------------------------

    //Reloj
    this.clock = new THREE.Clock();
    this.clock.start();

    //Tubo - Obtener información del tubo
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;
  }

  initWeapons()
  {
    var megaRP1 = this.createMegaRocket();
    megaRP1.rotation.y = 3*Math.PI/2;
    megaRP1.position.set(0.9, 1.05, -1.75);

    var megaRP2 = this.createMegaRocket();
    megaRP2.rotation.y = 3*Math.PI/2;
    megaRP2.position.set(-0.9, 1.05, -1.75);

    this.megaR = new THREE.Object3D();
    this.megaR.add(megaRP1, megaRP2);

    var laserCP1 = this.createLaserCanon();
    laserCP1.rotation.y = 3*Math.PI/2;
    laserCP1.position.set(0.9, 1.05, -1.75);

    var laserCP2 = this.createLaserCanon();
    laserCP2.rotation.y = 3*Math.PI/2;
    laserCP2.position.set(-0.9, 1.05, -1.75);

    this.laserC = new THREE.Object3D();
    this.laserC.add(laserCP1, laserCP2);

    var tripleLP1 = this.createTripleLaser();
    tripleLP1.rotation.y = 3*Math.PI/2;
    tripleLP1.position.set(0.9, 1.05, -1.75);

    var tripleLP2 = this.createTripleLaser();
    tripleLP2.rotation.y = 3*Math.PI/2;
    tripleLP2.position.set(-0.9, 1.05, -1.75);

    this.tripleL = new THREE.Object3D();
    this.tripleL.add(tripleLP1, tripleLP2);

    //Propiedades iniciales de las armas
    this.WEAPONS = 3;
    this.megaR.visible = false;
    this.tripleL.visible = false;
  }

  initHitProperties()
  {
    this.basePos = this.ship.position.y;
    this.hitPos = this.ship.position.y + 2;
    this.hitSpd = 0.5;
    this.hitRpt = 0;
    this.HITREPS_TOTAL = 6;
    this.color_val = 0;
    this.color_inc = 1/6;
  }
//----------------------------------------------------------------------
  //Creación de geometría
//----------------------------------------------------------------------
  createShip()
  {
    var ship = new THREE.Object3D();
    var over = 1; //Distancia a la que vuela de la superficie del tubo

    //Trozos
    //Parte de atrás
    var back = this.createBack();
    back.rotateY(Math.PI);
    back.position.z = -2;
    //back.position.y = this.radio + over;
    


    //Asiento
    var seat = this.createSeat();
    seat.rotateY(Math.PI);
    //seat.position.y = this.radio + over;

    //Parte frontal
    var front = this.createFront();
    front.rotateY(Math.PI);
    //front.position.y = this.radio + over;


    //Transformaciones
    //back.position.z = 2;
    ship.add(back, front, seat);
    return ship;
  }

  createBack()
  {
    var back = new THREE.Object3D();
    var back_w = 5;
    //Materiales
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/rusty-metal.jpg');
    var rusty_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });
    texture = textureLoader.load('../imgs/red-metal.jpeg');
    var red_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });
    

    //Parte trasera
    //--------------------------------------------------------------------------------
    var shape = new THREE.Shape();
    var x = 0; 
    var y = 0;
    shape.lineTo(x + 0.1, y + 0.3);
    shape.moveTo(x + 0.1, y + 0.3);
    shape.quadraticCurveTo(x + 2.4, y + 2, x + 4.9, y + 0.3);
    shape.moveTo(x + 4.9, y + 0.3);
    shape.lineTo(x + 5, y);

    //Propiedades
    var extrudeSettings = {
      depth: 1, // Profundidad de la extrusión
      bevelEnabled: true // Desactivar el biselado para mantener la forma original
    };

    var geomBack = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Ya podemos construir el Mesh
    var partBack = new THREE.Mesh (geomBack, red_mat);
    //Ajuste de ejes
    partBack.position.x = -2.5;
    partBack.position.z = -0.75;
    //--------------------------------------------------------------------------------
    //Propulsores
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
    var prop1 = new THREE.Mesh( geom, rusty_mat ) ;
    var prop2 = new THREE.Mesh( geom, rusty_mat ) ;
    //Rotarlos
    prop1.rotateX(Math.PI/2);
    prop2.rotateX(Math.PI/2);
    
    //Posicionarlos
    prop1.position.x = 2.5;
    prop2.position.x = -2.5;
    prop1.position.z = -2.8;
    prop2.position.z = -2.8;
    prop1.position.y = 0.15;
    prop2.position.y = 0.15;
    //--------------------------------------------------------------------------------
    //Propulsores traseros
    var propb_g = new THREE.TorusGeometry(0.5, 0.15, 4, 32, Math.PI*2);
    var propb = new THREE.Mesh(propb_g, rusty_mat);
    var propb2 = new THREE.Mesh(propb_g, rusty_mat);
    var propb3 = new THREE.Mesh(propb_g, rusty_mat);
    var propb4 = new THREE.Mesh(propb_g, rusty_mat);
    //Posición
    propb2.position.x = back_w/4;
    propb3.position.x = -back_w/4;

    propb.position.y = prop1.position.y + 0.4;
    propb2.position.y = prop1.position.y + 0.4;
    propb3.position.y = prop1.position.y + 0.4;
    propb4.position.y = prop1.position.y + 0.4;

    propb.position.z = 0.5;
    propb2.position.z = 0.5;
    propb3.position.z = 0.5;
    propb4.position.z = 0.5;
    //Escalado
    propb2.scale.set(0.5, 0.5, 1);
    propb3.scale.set(0.5, 0.5, 1);
    propb4.scale.set(0.5, 0.5, 1);

    this.partPos.push(prop1, prop2);
    back.add(propb, propb2, propb3, propb4);
    back.add(partBack);
    back.add(prop1);
    back.add(prop2);
    back.scale.set(0.8, 0.8, 0.8);
    back.position.y = 0.21;
    
    return back;
  }

  createFront()
  {
    //Materials
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/red-metal.jpeg');
    var red_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });
    var texture = textureLoader.load('../imgs/weapon-tex.jpg');
    var metal_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });

    //Material
    var mat = new THREE.MeshStandardMaterial();
    var box_sub_g = new THREE.BoxGeometry(3, 3, 7);
    var box = new THREE.Mesh(box_sub_g, mat);

    var cil = new THREE.CylinderGeometry(0, 1, 1, 20, 1, false);
    var glass_mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffCC, // Color del cristal
      transparent: true, // Hacer el material transparente
      opacity: 0.5, // Nivel de transparencia (0 = completamente transparente, 1 = completamente opaco)
      roughness: 0.1, // Rugosidad del cristal (0 = completamente liso, 1 = muy rugoso)
      metalness: 0.5, // Metalidad del cristal (0 = no metálico, 1 = completamente metálico)
      clearcoat: 1, // Capa transparente adicional para dar brillo al cristal
      clearcoatRoughness: 0.1, // Rugosidad de la capa transparente
      transmission: 0.9, // Transmitancia del material (0 = totalmente opaco, 1 = totalmente transparente)
      ior: 1.5, // Índice de refracción del cristal
      side: THREE.DoubleSide
    });


    var geom = new THREE.CapsuleGeometry(0.25, 1, 10, 20);
    
    var glass = new THREE.Mesh(cil, glass_mat);
    var fl = new THREE.Mesh(geom, metal_mat);
    var ff_punta = new THREE.Mesh(geom, red_mat); 
    var fr = new THREE.Mesh(geom, metal_mat);
    var ff = new THREE.Mesh(geom, metal_mat);

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
    glass.position.z = 0.3;
    glass.position.y = 0.2;
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
    //Material
    var mat = new THREE.MeshStandardMaterial();
    var spg = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI);
    var sp = new THREE.Mesh(spg, mat);
    var cil = new THREE.CylinderGeometry(0.75, 0.75, 2, 32, 16, false);
    var sp2 = new THREE.Mesh(cil, glass_mat);
    
    //Ajustamos la posición
    sp.position.z = -0.75;
    sp2.position.z = -0.75;
    sp2.position.y = 0.2;

    //Alejar de Eje Y
    sp2.position.x += 5; 
    sp2.position.z += 5;
    glass.position.z += 5;
    glass.position.x += 5;

    var csg3 = new CSG();
    csg3.subtract([glass, sp2]);
    var ft_gl = csg3.toMesh();
    ft_gl.position.z -= 5;
    ft_gl.position.x -= 5;

    var csg2 = new CSG();
    csg2.union([fl, fr]);
    csg2.union([ff]);
    csg2.subtract([sp]);
    
    var ft = csg2.toMesh();

    front.add(ft, punta, ft_gl);
    front.rotateY(Math.PI);
    front.position.y = 0.25; 

    return front;
  }

  createSeat()
  {
    //Objeto final
    var seat = new THREE.Object3D();

    //Material
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/black_leather.jpeg');
    var seat_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });
    var texture = textureLoader.load('../imgs/rusty-metal.jpg');
    var plate_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true, metalness: 0.5 });


    //Partes
    //Placa de sujección
    var box_h = 0.1;
    var bgeom = new THREE.BoxGeometry(1,1,1);
    var box = new THREE.Mesh(bgeom, plate_mat);

    //Transformaciones a la placa
    box.scale.set(1, 0.1, 1.9);
    box.position.y = 0.1;
    box.position.z = 1;

    //Asiento
    var shape = new THREE.Shape();
    var swm = 0.05; //Ancho máximo con bultos
    var sw = swm - 0.02; //Ancho máximo sin bultos
    var sh = 0.72;
    var sl = swm + sh;
    var x = 0;
    var y = 0;
    shape.lineTo(sl, 0);
    shape.moveTo(sl, 0);
    shape.quadraticCurveTo(sl-sh/6, swm, sl-sh/3, sw);
    shape.moveTo(sl-sh/3, sw);
    shape.quadraticCurveTo(sl-sh/3-sh/6, swm, sl-2*sh/3, sw);
    shape.moveTo(sl-2*sh/3, sw);
    shape.quadraticCurveTo(sl-2*sh/3-sh/6, swm, sl-3*sh/3, sw);
    shape.moveTo(sl-3*sh/3, sw);
    shape.quadraticCurveTo(x + 2*swm, y + sh/3 + sh/6, x + sw, y + sh/3);
    shape.moveTo(x + sw, y + sh/3);
    shape.quadraticCurveTo(x + 2*swm, y + sh/3 + sh/6, x + sw, y + 2*sh/3);
    shape.moveTo(x + swm, y + 2*sh/3);
    shape.quadraticCurveTo(x + 2*swm, y + 2*sh/3 + sh/6, 0, y + 3*sh/3);
    

    //Propiedades
    var seat_width = 0.7;
    var extrudeSettings = {
      depth: seat_width, // Profundidad de la extrusión
      bevelEnabled: true // Desactivar el biselado para mantener la forma original
    };

    var seat_g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var seat_part = new THREE.Mesh (seat_g, seat_mat);
    seat_part.rotateY(Math.PI/2);
    seat_part.position.x = -seat_width/2;
    seat_part.position.z = 2 - 0.8 - 0.025;
    seat_part.position.y = box.position.y + box_h;
    

    //Añadir partes
    seat.add(seat_part, box);
    return seat;
  }

  //Creación de armas
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

  createMegaRocket()
  {
    var canon = new THREE.Object3D();
    //Material
    //----------------------------------------
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/black_leather.jpeg');
    var mango_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true });

    texture = textureLoader.load('../imgs/bright-metal.jpeg');
    var part_mat = new THREE.MeshStandardMaterial({
      map: texture,                    // Utiliza la textura cargada
      flatShading: false,              // No usar sombreado plano para obtener transiciones de color suaves
      metalness: 0.5,
      roughness: 0.2,
      color: 0xE09437,
      emissive: 0xFEAE4E,
      emissiveIntensity: 1,   
      needsUpdate: true   
  });

    texture = textureLoader.load('../imgs/weapon-tex.jpg');
    var culata_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true});
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

  createLaserCanon()
  {
    var canon = new THREE.Object3D();

    //Material
    //----------------------------------------
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../imgs/black_leather.jpeg');
    var mango_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true });

    texture = textureLoader.load('../imgs/bright-metal.jpeg');
    var part_mat = new THREE.MeshStandardMaterial({
      map: texture,                    // Utiliza la textura cargada
      flatShading: false,              // No usar sombreado plano para obtener transiciones de color suaves
      metalness: 0.5,
      roughness: 0.2,
      color: 0x4CA6D1,
      emissive: 0xABFFF5,
      emissiveIntensity: 1,   
      needsUpdate: true   
  });

    texture = textureLoader.load('../imgs/weapon-tex.jpg');
    var culata_mat = new THREE.MeshStandardMaterial({ map: texture, flatShading: false, needsUpdate: true});
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
    var shape = new THREE.Shape();
    shape.lineTo(0.02, 0);
    shape.moveTo(0.02, 0);
    shape.lineTo(0.06, 0.033);
    shape.moveTo(0.06, 0.033);
    shape.lineTo(0.06, 0.067);
    shape.moveTo(0.06, 0.067);
    shape.lineTo(0.02, 0.1);
    shape.moveTo(0.02, 0.1);
    shape.lineTo(0.06, 0.133);
    shape.moveTo(0.06, 0.133);
    shape.lineTo(0.06, 0.167);
    shape.moveTo(0.06, 0.167);
    shape.lineTo(0.02, 0.2);
    shape.moveTo(0.02, 0.2);
    shape.lineTo(0.06, 0.233);
    shape.moveTo(0.06, 0.233);
    shape.lineTo(0.06, 0.267);
    shape.moveTo(0.06, 0.267);
    shape.lineTo(0.02, 0.3);
    shape.moveTo(0.02, 0.3);
    shape.lineTo(0, 0.3);
    shape.moveTo(0, 0.3);
    shape.lineTo(0.06, 0.3);
    shape.moveTo(0.06, 0.3);
    shape.lineTo(0.075, 0.35);
    shape.moveTo(0.075, 0.35);
    shape.lineTo(0.06, 0.4);
    shape.moveTo(0.06, 0.4);
    shape.lineTo(0.05, 0.4);
    shape.moveTo(0.05, 0.4);
    shape.lineTo(0.02, 0.3);
    shape.moveTo(0.02, 0.3);
    shape.lineTo(0, 0.3);
    shape.moveTo(0, 0.3);
    var canonG = new THREE.LatheGeometry(shape.getPoints(), 20, 0, 2*Math.PI);


    //---------------------------------
    


    //Crear mesh
    var mangoM = new THREE.Mesh(mangoG, mango_mat) ;
    var culataM = new THREE.Mesh(culataG, culata_mat) ;
    var canonM = new THREE.Mesh(canonG, part_mat) ;


    //Posicionar
    mangoM.position.x = -0.05;
    mangoM.position.z = -0.025;

    culataM.position.x = -0.05;
    culataM.position.z = -0.05;
    culataM.position.y = 0.15;

    canonM.rotateZ(3*Math.PI/2);
    canonM.position.y = 0.225;
    canonM.position.x = 0.35;



    canon.add(mangoM, culataM, canonM);
    return canon;
  }
//----------------------------------------------------------------------

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      //vida: this.VIDA_MAX,
      //sizeX : 1.0,
      /*sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,

      visible : true,*/
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        //this.guiControls.vida = this.VIDA_MAX;
        //this.guiControls.sizeX = 1.0;
        /*this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;

        this.guiControls.visible = true;*/

      }
    } 
    
    // Se crea una sección para los controles de la caja
    //var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    //folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    /*folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();*/
  }
  
  setShipVisible(value)
  {
    this.mesh.visible = value;
  }

  actualizarPosicion()
  {
    //Colocar el personaje
    var posTmp = this.path.getPointAt (this.t);
    this.nodoPosOrientTubo.position.copy(posTmp);

    //Orientación
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt (posTmp);
  }

  actualizarRotacion(dir)
  {
    //Rotar
    this.angle += dir* this.rotationSpeed;

    //Ajuste
    if (this.angle > 2*Math.PI) this.angle = 0;
    if (this.angle < 0) this.angle = 2*Math.PI; 
  }

  //Método para debug
  detenerNave()
  {
    this.on *= -1;
    console.log(this.on);  
  }

  changeWeapon(value)
  {
    console.log("NUEVO ARMA");
    switch(value)
    {
      case 0:
        this.laserC.visible = true;
        this.megaR.visible = false;
        this.tripleL.visible = false;
      break;

      case 1:
        this.laserC.visible = false;
        this.megaR.visible = true;
        this.tripleL.visible = false;        
      break;

      case 2:
        this.laserC.visible = false;
        this.megaR.visible = false;
        this.tripleL.visible = true;        
      break;
    }
  }
  
  getCrystal()
  {
    this.mineral++;
    console.log("MINERAL: ", this.mineral);
  }

  hit(value)
  {
    //Si es vulnerable 
    if (this.invulnerable == false)
    {
      if (this.spd > this.MIN_SPD) this.spd = this.spd - 2*this.inc_spd;
      this.vida -= value;
      console.log("DAÑO - VIDA:", this.vida);

      //Llamar animación de daño
      this.invulnerable = true;
    }
  }

  heal()
  {
    if (this.vida < this.VIDA_MAX) this.vida += 5;
    this.spd = this.spd + this.inc_spd
    console.log("ARMAZON REPARADO > ", this.vida);
  }

  hitAnim()
  {
    this.ship.position.y += this.hitSpd;
    if ((this.ship.position.y > this.hitPos) || (this.ship.position.y <= this.basePos))
    {
      this.hitSpd *= -1;
      this.hitRpt++;
    }

    if (this.hitRpt == this.HITREPS_TOTAL)
    {
      this.invulnerable = false;
      this.hitRpt = 0;
      this.ship.position.y = this.basePos;
      this.spd = this.spd + this.inc_spd; //Recupera un poco la velocidad anterior
    }
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    var time = this.clock.getDelta(); 
    if (this.on == 1) this.t += this.spd * time;
    if (this.t >= 1) 
    {
      //Reiniciar posicion
      this.t = 0;

      //Aumentar velocidad un %10
      this.spd += this.inc_spd;
    }
    this.actualizarPosicion();
    //this.angle += this.rotationSpeed;
    this.nodoRot.rotation.z = this.angle;

    //Animación de recibir daño
    if (this.invulnerable == true) this.hitAnim();
  }
}

export { MyShip };
