var loader = new THREE.GLTFLoader();
loader.load(
  'scene.gltf',
  function(gltf) {
    gltf.scene.traverse(function(child) {
      if (child.isMesh) {
        child.material.emissiveIntensity = 100;
      }
    });
    // Add the modified model to your A-Frame scene.
    // You may need to convert the Three.js object to an A-Frame entity.
  },
  undefined,
  function(e) {
    console.error(e);
  }
);
