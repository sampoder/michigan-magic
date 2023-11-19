AFRAME.registerComponent('modify-emissive', {
    init: function() {
      // 'this.el' refers to the entity this component is attached to.
      var modelEntity = this.el;
      
      // Use 'modelEntity.getObject3D()' to access the Three.js object.
      var modelObject = modelEntity.getObject3D('mesh');
      
      // You can now modify the emissiveIntensity or other properties of the modelObject's materials.
      if (modelObject) {
        modelObject.traverse(function(child) {
          if (child.isMesh) {
            child.material.emissiveIntensity = 100;
          }
        });
      }
    }
  });
  