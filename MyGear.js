import * as THREE from '../libs/three.module.js'
 
class MyGear extends THREE.Object3D {
  constructor(gui,titleGui, geomTubo, angle, pos) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    //Tubo - Obtener información del tubo
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    var teethCount = 10; // Cantidad de dientes en el engranaje
    var toothAngle = Math.PI * 2 / teethCount;
    var outerRadius = 10;
    var innerRadius = 7;
    var toothDepth = 2;
    
    var gearShape = new THREE.Shape();
    
    // Iniciar el trazado del shape
    gearShape.moveTo(outerRadius, 0);
    
    // Dibujar los dientes del engranaje
    for (let i = 0; i < teethCount; i++) {
        // Calcular los ángulos para el inicio y fin del diente
        var angleStart = i * toothAngle;
        var angleEnd = angleStart + toothAngle / 2;
    
        // Punto de inicio del diente
        var startX = outerRadius * Math.cos(angleStart);
        var startY = outerRadius * Math.sin(angleStart);
    
        // Punto medio superior del diente
        var midX = innerRadius * Math.cos(angleEnd);
        var midY = innerRadius * Math.sin(angleEnd);
    
        // Punto final del diente
        var endX = outerRadius * Math.cos(angleEnd);
        var endY = outerRadius * Math.sin(angleEnd);
    
        // Dibujar el diente
        gearShape.lineTo(startX, startY);
        gearShape.quadraticCurveTo(midX, midY, endX, endY);
    
        // Punto de inicio del diente siguiente
        var nextStartX = outerRadius * Math.cos(angleStart + toothAngle);
        var nextStartY = outerRadius * Math.sin(angleStart + toothAngle);
    
        // Mover al punto de inicio del próximo diente
        gearShape.moveTo(nextStartX, nextStartY);
    }
    
    // Crear el agujero en el centro del engranaje
    var holeRadius = 3;
    var holeShape = new THREE.Path();
    holeShape.moveTo(0, holeRadius);
    holeShape.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    gearShape.holes.push(holeShape);
    
    // Extruir el shape para crear la geometría del engranaje
    var extrudeSettings = {
        steps: 1,
        depth: toothDepth,
        bevelEnabled: false
    };
    
    //var gearGeometry = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
    var gearGeometry = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
    //Material
    this.mat = new THREE.MeshNormalMaterial();
    this.mat.flatShading = true;
    this.mat.needsUpdate = true;
    this.mesh = new THREE.Mesh(gearGeometry, this.mat);
    var over = 10;
    this.mesh.scale.set(0.1, 0.1, 0.1);
    this.mesh.position.y = this.radio + over
    this.mesh.userData = this;
    this.groundPos = this.radio + 1.25;
    this.gravSpd = -0.2; //Gravity
    this.obj = new THREE.Object3D();
    this.obj.add(this.mesh);

    //Rotación
    this.nodoRot = new THREE.Object3D();
    this.nodoRot.add(this.obj);
    this.nodoRot.rotation.z = angle;

    //Posición
    this.nodoPosTubo = new THREE.Object3D();
    this.nodoPosTubo.add(this.nodoRot);

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
  
  collision(ship)
  {
    ship.heal();
    this.remove(this.nodoPosTubo);
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
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI*2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI*2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI*2, 0.01).name ('Rotación Z : ').listen();
    
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
    if (this.mesh.position.y > this.groundPos) this.mesh.position.y += this.gravSpd;
    this.mesh.rotation.y += 0.05; 
  }
}

export { MyGear };
