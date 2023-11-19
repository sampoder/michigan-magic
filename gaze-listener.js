AFRAME.registerComponent('gaze-listener', {
    schema: {
      threshold: {type: 'number', default: 5} // Set a threshold for gaze detection
    },
  
    init: function() {
      this.cameraEl = document.querySelector('a-camera') || document.querySelector('a-scene').camera.el;
      this.isPlaying = false;
      this.originalMaterial = this.el.getObject3D('mesh').material;
      this.createGlowMaterial();
    },
  
    tick: function() {
      if (!this.cameraEl) {
        return;
      }
  
      let cameraPosition = new THREE.Vector3();
      this.cameraEl.object3D.getWorldPosition(cameraPosition);
  
      let spherePosition = new THREE.Vector3();
      this.el.object3D.getWorldPosition(spherePosition);
  
      if (this.isLookingAt(cameraPosition, spherePosition)) {
        if (!this.isPlaying) {
          this.startAudioAndGlow();
        }
      } else {
        if (this.isPlaying) {
          this.stopAudioAndRemoveGlow();
        }
      }
    },
  
    isLookingAt: function(cameraPosition, spherePosition) {
      let direction = new THREE.Vector3();
      this.cameraEl.object3D.getWorldDirection(direction);
      direction.add(cameraPosition);
      let distance = direction.distanceTo(spherePosition);
      return distance < this.data.threshold;
    },
  
    startAudioAndGlow: function() {
      // Start playing audio
      let sound = document.querySelector('#audio');
      sound.play();
      this.el.getObject3D('mesh').material = this.glowMaterial;
      this.isPlaying = true;
    },
  
    stopAudioAndRemoveGlow: function() {
      let sound = document.querySelector('#audio');
      sound.pause();
      this.el.getObject3D('mesh').material = this.originalMaterial;
      this.isPlaying = false;
    },
  
    createGlowMaterial: function() {
      // Here, you need to define your glow shader
      // For now, we're using a basic material for demonstration
      this.glowMaterial = new THREE.MeshBasicMaterial({color: 0xff0000}); // Replace with your shader material
    }
  });
  