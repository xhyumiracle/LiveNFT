'use strict';

/* global THREE */
// import {create,getJSON} from "./pyramid.js";

    // import {create} from "./pyramid.js";

import { default as pyramid } from './pyramid.js';
import { default as box } from './box.js';
import { default as rabbit } from './rabbit-test.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

  const sceneElements = [];
  function addScene(elem, fn) {
    sceneElements.push({elem, fn});
  }


  function makeScene() {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5*100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera.position.set(0, 1, 2);
    camera.position.set(10, 5, 10);
    camera.lookAt(0, 0, 0);

    // {
    //   const color = 0xFFFFFF;
    //   const intensity = 1;
    //   const light = new THREE.DirectionalLight(color, intensity);
    //   light.position.set(-1, 2, 4);
    //   scene.add(light);
    // }
    {
      var globalLight = new THREE.AmbientLight(0xffffff, .8);
      var shadowLight = new THREE.DirectionalLight(0xffffff, .4);
      shadowLight.position.set(-8, 8, 8);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -40;
      shadowLight.shadow.camera.right = 40;
      shadowLight.shadow.camera.top = 40;
      shadowLight.shadow.camera.bottom = -40;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;
      shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
      scene.add(globalLight);
      scene.add(shadowLight);
    }

    return {scene, camera};
  }

  {
    const elem = document.querySelector('#box');
    const {scene, camera} = makeScene();

    const mesh = box.create();

    scene.add(mesh);
    // addScene(elem, box.fn);
    addScene(elem, (time, rect, delta) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      mesh.rotation.y = time * .1;
      renderer.render(scene, camera);
    });
  }

  {
    const elem = document.querySelector('#pyramid');
    const {scene, camera} = makeScene();
   

    const obj = pyramid.create()
    obj.mesh.position.set(0,0,0);
    scene.add(obj.mesh)
    addScene(elem, (time, rect, delta) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      obj.fn(time, rect, delta);
      renderer.render(scene, camera);
    });
  }


  {
    const elem = document.querySelector('#rabbit');
    const {scene, camera} = makeScene();
    const obj = rabbit.create()
    obj.mesh.position.set(0,0,0)
    scene.add(obj.mesh);
    addScene(elem, (time, rect, delta) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      obj.fn(time, rect, delta);
      renderer.render(scene, camera);
    });
  }


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {

    // var container = document.getElementById('rabbit');
    // var HEIGHT = container.height
    // var WIDTH = container.width;
      // renderer.setSize(HEIGHT, WIDTH, false);

      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  var clock = new THREE.Clock();
  const clearColor = new THREE.Color('#000');
  function render(time) {
    time *= 0.001
    var delta = clock.getDelta();;

    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.setClearColor(clearColor, 0);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    const transform = `translateY(${window.scrollY}px)`;
    renderer.domElement.style.transform = transform;

    for (const {elem, fn} of sceneElements) {
      // get the viewport relative position opf this element
      const rect = elem.getBoundingClientRect();
      const {left, right, top, bottom, width, height} = rect;

      const isOffscreen =
          bottom < 0 ||
          top > renderer.domElement.clientHeight ||
          right < 0 ||
          left > renderer.domElement.clientWidth;

      if (!isOffscreen) {
        const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
        var _s=1
        var _v=1
        renderer.setScissor(left, positiveYUpBottom, width*_s, height*_s);
        renderer.setViewport(left, positiveYUpBottom, width*_v, height*_v);

        fn(time, rect, delta); //use delta
      }
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();