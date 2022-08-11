function create(){
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({color: 'red'});
    const mesh = new THREE.Mesh(geometry, material);
    
      mesh.scale.set(2,2,2);;
return mesh
}

var fn=(time, rect) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      mesh.rotation.y = time * .1;
      renderer.render(scene, camera);
    }

export default {create, fn}

    