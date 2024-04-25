import * as THREE from '../libs/three.module.js'
 
class MyCrystal extends THREE.Object3D {
  constructor() {
    super();
    

    

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

    crystal.add(m1, m2);
    crystal.scale.set(0.25, 0.25, 0.25);
    crystal.position.y = 0.25;
    return crystal;
  }

 
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    this.rotation.y += 0.01;

  }
}

export { MyCrystal };
