import { useRequest } from 'ahooks';
import { type ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { router } from 'expo-router';
import { Renderer, THREE } from 'expo-three';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import Canvas from 'react-native-canvas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fog, PerspectiveCamera, Scene } from 'three';

import { ThemedView } from '@/components/ThemedView';
import { AFEventKey } from '@/constants/AFEventKey';
import { getBotAppSphereAll } from '@/services/spherexin';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';

import { GL_HEIGHT, GL_WIDTH } from './constant';
import { LabelItem, LabelSpriteItem } from './types';
import { createLight, createSphereMesh, createTextBall, createTexture } from './utils';

export default function Ball() {
  const eventRef = useRef<{
    onTouchMove?: (e: GestureResponderEvent) => void;
    onTouchStart?: (e: GestureResponderEvent) => void;
    onTouchEnd?: (e: GestureResponderEvent) => void;
  }>({});

  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labelList, setLabelList] = useState<LabelItem[]>([]);
  const [canvas, setCanvas] = useState<Canvas>();
  const [gl, setGl] = useState<ExpoWebGLRenderingContext>();

  const { data: sphereList } = useRequest(async () => {
    const resp = await getBotAppSphereAll();
    return resp.data.data || [];
  });

  useEffect(() => {
    if (!sphereList || !canvas) return;
    createTexture(canvas, sphereList).then((v) => {
      if (v) {
        setLabelList(v);
      }
    });
  }, [sphereList, canvas]);

  useEffect(() => {
    let timer: number;
    async function run() {
      if (!gl) return;

      const pixelStorei = gl.pixelStorei.bind(gl);
      gl.pixelStorei = function (...args) {
        const [parameter] = args;
        switch (parameter) {
          case gl.UNPACK_FLIP_Y_WEBGL:
            return pixelStorei(...args);
        }
      };

      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const clearColor = 0x000000;
      // const lightColor = 0xffffff;

      // Create a WebGLRenderer without a DOM element
      const renderer = new Renderer({
        gl,
        clearColor,
        width,
        height,
        // antialias: true,
        // alpha: true,
      });
      renderer.setSize(width, height);

      const camera = new PerspectiveCamera(75, width / height, 0.01, 1000);

      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // 创建场景和相机
      const scene = new Scene();
      scene.fog = new Fog(clearColor, 1, 1000);
      // scene.add(new GridHelper(size, size));
      // scene.add(new AxesHelper(size));

      const sphere = createSphereMesh({ scene });
      createLight({ scene });

      const { smallBalls, labelSprites } = createTextBall({
        scene,
        sphere,
        labelList: labelList || [],
      });

      // 创建射线投射器
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // 定义自动旋转速度和轴
      const autoRotationSpeed = 0.0005;
      const autoRotationAxis = new THREE.Vector3(0, 1, 0).normalize();
      const currentAngularVelocity = autoRotationAxis.clone().multiplyScalar(autoRotationSpeed);

      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let lastDragDelta = { x: 0, y: 0 };

      const decayRate = 0.98;
      const increaseRate = 1.02;

      const getTouchPoint = (event: GestureResponderEvent) => {
        const touch = event.nativeEvent.touches[0] || event.nativeEvent.changedTouches[0];
        return {
          x: touch.pageX, // 为什么不用locationX？ 因为只用考虑偏移量不用考虑精确点
          y: touch.pageY,
        };
      };
      // 触摸事件处理
      eventRef.current.onTouchStart = (event: GestureResponderEvent) => {
        isDragging = true;
        previousMousePosition = getTouchPoint(event);
      };

      eventRef.current.onTouchMove = (event: GestureResponderEvent) => {
        event.preventDefault();
        const point = getTouchPoint(event);
        if (isDragging) {
          const deltaX = point.x - previousMousePosition.x;
          const deltaY = point.y - previousMousePosition.y;

          lastDragDelta = { x: deltaX, y: deltaY };

          const rotationFactor = 0.002;

          const angleY = deltaX * rotationFactor;
          const angleX = deltaY * rotationFactor;

          const quaternionY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY);
          const quaternionX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX);

          const deltaQuat = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);

          sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion);

          const dragRotationAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
          const dragRotationSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * rotationFactor;

          if (dragRotationAxis.length() > 0) {
            currentAngularVelocity.copy(dragRotationAxis).multiplyScalar(dragRotationSpeed);
          }

          previousMousePosition = point;
        }
      };

      eventRef.current.onTouchEnd = (event: GestureResponderEvent) => {
        if (isDragging) {
          isDragging = false;

          const deltaX = lastDragDelta.x;
          const deltaY = lastDragDelta.y;

          if (deltaX !== 0 || deltaY !== 0) {
            const newAxis = new THREE.Vector3(deltaY, deltaX, 0).normalize();
            if (newAxis.length() > 0) {
              autoRotationAxis.copy(newAxis);
            }

            const dragSpeed = currentAngularVelocity.length();
            if (dragSpeed > autoRotationSpeed) {
              // 维持当前旋转速度
            } else {
              currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
            }
          }
        }

        const touch = event.nativeEvent.touches[0] || event.nativeEvent.changedTouches[0];
        const mousePoint = {
          x: touch.locationX, //什么用locationX？ 因为需要考虑精确点
          y: touch.locationY,
        };
        mouse.x = (mousePoint.x / GL_WIDTH) * 2 - 1;
        mouse.y = -(mousePoint.y / GL_HEIGHT) * 2 + 1;
        checkIntersection();
      };

      // // 处理窗口大小调整
      // window.addEventListener('resize', () => {
      //   camera.aspect = window.innerWidth / window.innerHeight;
      //   camera.updateProjectionMatrix();
      //   renderer.setSize(window.innerWidth, window.innerHeight);
      // });

      function checkIntersection() {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(smallBalls);

        if (intersects.length > 0) {
          const intersectedBall = intersects[0].object as THREE.Mesh;
          const index = smallBalls.indexOf(intersectedBall);
          if (index !== -1) {
            const labelInfo = labelSprites[index];
            showLabelInfo(labelInfo);
          }
        }
      }

      function showLabelInfo(labelInfo: LabelSpriteItem) {
        if (!labelInfo.labelItem) {
          console.log(`点击的小球 无标签`, Date.now());
          return;
        }
        // alert(`点击的小球标签：${labelInfo.labelText}`);
        console.log(`点击的小球标签：${JSON.stringify(labelInfo.labelItem.sphere)}`, Date.now());
        sendAppsFlyerEvent(AFEventKey.AFSpherePlanetJoined);
        const { sphere } = labelInfo.labelItem;
        if (sphere.category && sphere.category !== '0') {
          router.push({
            pathname: '/main/experts/[categoryId]',
            params: {
              from: 'sphere',
              sphereId: sphere.id,
              sphereName: sphere.collectionName,
              categoryId: sphere.category,
              categoryName: sphere.categoryName,
            },
          });
        } else {
          if (sphere.type === 'TALES') {
            router.push({
              pathname: '/main/fairyTales',
              params: {
                from: 'sphere',
                sphereId: sphere.id,
                sphereName: sphere.collectionName,
              },
            });
          }
          if (sphere.type === 'EXPERT') {
            router.push({
              pathname: '/main/experts/[categoryId]',
              params: {
                from: 'sphere',
                sphereId: sphere.id,
                sphereName: sphere.collectionName,
                categoryId: '', // TODO: 后面确认一下是否有用
              },
            });
          }
          if (sphere.type === 'GAME') {
            router.push({
              pathname: '/main/games',
              params: {
                from: 'sphere',
                sphereId: sphere.id,
                sphereName: sphere.collectionName,
              },
            });
          }
          if (sphere.type === 'GROUP_CHAT') {
            router.push({
              pathname: '/main/group-chat/join',
              params: { roomId: sphere.id, from: 'sphere' },
            });
          }
        }
      }

      function update() {
        // remoteCube.rotation.z += 0.025;

        if (!isDragging) {
          const deltaQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(currentAngularVelocity.x, currentAngularVelocity.y, currentAngularVelocity.z, 'XYZ'),
          );
          sphere.quaternion.multiplyQuaternions(deltaQuat, sphere.quaternion);

          const currentSpeed = currentAngularVelocity.length();

          if (currentSpeed > autoRotationSpeed) {
            currentAngularVelocity.multiplyScalar(decayRate);

            if (currentAngularVelocity.length() < autoRotationSpeed) {
              currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
            }
          } else if (currentSpeed < autoRotationSpeed) {
            currentAngularVelocity.multiplyScalar(increaseRate);

            if (currentAngularVelocity.length() > autoRotationSpeed) {
              currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
            }
          } else {
            currentAngularVelocity.copy(autoRotationAxis).multiplyScalar(autoRotationSpeed);
          }
        }

        // 更新标签的位置和跑马灯效果
        labelSprites.forEach(({ sprite, spriteMaterial, labelItem, smallBall }) => {
          if (!labelItem || !sprite) return;
          const { texture, needMarquee } = labelItem;
          smallBall.updateMatrixWorld();
          const smallBallWorldPos = new THREE.Vector3();
          smallBall.getWorldPosition(smallBallWorldPos);

          const upOffset = new THREE.Vector3(0, 0.3, 0);

          sprite.position.copy(smallBallWorldPos).add(upOffset);

          if (needMarquee) {
            texture.offset.x += 0.002;
            if (texture.offset.x > 1) {
              texture.offset.x = 0;
            }
          }
        });
      }

      // Setup an animation loop
      const render = () => {
        if (isLoading) {
          setIsLoading(false);
        }

        timer = requestAnimationFrame(render);
        update();
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    }
    run();
    return () => {
      clearInterval(timer);
    };
  }, [gl, labelList, insets, isLoading]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    setGl(gl);
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ThemedView
        style={{
          width: GL_WIDTH,
          height: GL_HEIGHT,
          backgroundColor: 'transparent',
        }}
        onTouchStart={(e) => {
          eventRef.current.onTouchStart?.(e);
        }}
        onTouchMove={(e) => {
          eventRef.current.onTouchMove?.(e);
        }}
        onTouchEnd={(e) => {
          eventRef.current.onTouchEnd?.(e);
        }}>
        <GLView
          style={{
            width: GL_WIDTH,
            height: GL_HEIGHT,
          }}
          onContextCreate={onContextCreate}
        />
      </ThemedView>
      {/* {isLoading && <LoadingView />} */}
      <Canvas
        style={{
          height: 1,
          width: 1,
        }}
        ref={(_canvas: Canvas) => {
          setCanvas(_canvas);
        }}
      />
    </ThemedView>
  );
}
