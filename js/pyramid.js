class Pyramid{
  constructor() {
    this.mesh=this._createmesh()
  }
  fn(time, rect, delta){
    this.mesh.rotation.y = time * 1;
  }
  _createmesh(){

      const radius = .8;
      const widthSegments = 4;
      const heightSegments = 2;
      const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
      const material = new THREE.MeshPhongMaterial({
        color: 'blue',
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(2,2,2);;
      return mesh
  }
}
function create(){
  return new Pyramid();
}

function test1(tt){
  console.log('in test',tt)
  return 'test...........'+tt
}
export default {create}