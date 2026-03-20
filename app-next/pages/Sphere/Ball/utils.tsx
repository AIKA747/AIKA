import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import { TextureLoader, THREE } from 'expo-three';
import Canvas from 'react-native-canvas';

import { LabelItem, LabelSpriteItem } from './types';

export function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40 + 10);
  const lightness = Math.floor(Math.random() * 40 + 40);

  const rgb = hslToRgb(hue, saturation, lightness);

  return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
}

export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * 创建半透明球体
 */
export function createSphereMesh({ scene }: { scene: THREE.Scene }) {
  // 创建半透明球体
  const sphereGeometry = new THREE.SphereGeometry(4.85, 16, 16);
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x000000) },
      opacity: { value: 0.0 },
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
    fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        void main() {
            float alpha = opacity * smoothstep(0.5, 1.0, vNormal.z);
            gl_FragColor = vec4(color, alpha);
        }
      `,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);
  return sphere;
}

/**
 * 添加灯光
 */
export function createLight({ scene }: { scene: THREE.Scene }) {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
}

export function createTextBall({
  scene,
  sphere,
  labelList,
}: {
  scene: THREE.Scene;
  sphere: THREE.Mesh;
  labelList: LabelItem[];
}) {
  // 创建小球体和标签数组
  const smallBallGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const smallBalls: THREE.Mesh[] = [];
  const labelSprites: LabelSpriteItem[] = [];

  const radius = 5;
  const numPoints = Math.max(60, labelList.length);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);

    const theta = (2 * Math.PI * i) / goldenRatio;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    const smallBallMaterial = new THREE.MeshBasicMaterial({
      color: getRandomBrightColor(),
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide,
    });
    const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);
    smallBall.position.set(x * radius, y * radius, z * radius);
    sphere.add(smallBall);
    smallBalls.push(smallBall);

    labelSprites.push({
      smallBall,
    });
  }

  for (let i = 0; i < labelList.length; i++) {
    // 球多标签少，随机挑选
    const randomIndex = Math.floor(Math.random() * labelSprites.length);
    const labelSpriteItem = labelSprites[randomIndex];
    if (labelSpriteItem && labelSpriteItem.labelItem) {
      i--;
      continue;
    }
    const labelItem = labelList[i];

    const spriteMaterial = new THREE.SpriteMaterial({
      // color: 0x00ff00,
      map: labelItem.texture,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      blending: THREE.NormalBlending,
    });
    spriteMaterial.opacity = 1;
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, (labelItem.height / labelItem.width) * 2, 10);
    scene.add(sprite);

    labelSpriteItem.labelItem = labelItem;
    labelSpriteItem.sprite = sprite;
    labelSpriteItem.spriteMaterial = spriteMaterial;
  }
  return { smallBalls, labelSprites };
}

export function getRandomNickname() {
  const adjectives = ['Cool', 'Crazy', 'Mysterious', 'Happy', 'Silly', 'Brave', 'Smart', 'Swift', 'Fierce', 'Gentle'];
  const nouns = ['Tiger', 'Lion', 'Dragon', 'Wizard', 'Ninja', 'Pirate', 'Hero', 'Ghost', 'Phantom', 'Knight'];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  const nickname = `${randomAdjective} ${randomNoun}`;

  if (nickname.length < 2) {
    return getRandomNickname();
  } else if (nickname.length > 22) {
    return nickname.slice(0, 22);
  }

  return nickname;
}

export async function createTexture(canvas: Canvas, sphereList: API.SphereDto[]) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const labelList: LabelItem[] = [];
  for (let i = 0; i < sphereList.length; i++) {
    const sphereIem = sphereList[i];
    const text = sphereIem.collectionName;
    // const text = 'ABCDEFGH';
    const fontSize = 28;
    const fontFace = 'PingFang SC, Microsoft YaHei, Noto Sans, Arial, sans-serif';
    const textColor = '#A07BED';
    // const textColor = 'red';
    const backgroundColor = 'rgba(0,0,0,0)';
    // const backgroundColor = 'rgba(0,0,0)';

    const maxWidth = 160;

    ctx.font = `${fontSize}px ${fontFace}`;
    const textMetrics = await ctx.measureText(text);
    const textWidth = Math.ceil(textMetrics.width);
    const textHeight = fontSize * 1.2;

    const needMarquee = textWidth > maxWidth;

    let canvasWidth = maxWidth;
    if (needMarquee) {
      canvasWidth = textWidth + 60;
    }

    canvas.width = canvasWidth;
    canvas.height = textHeight;

    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.textAlign = needMarquee ? 'left' : 'center';
    ctx.textBaseline = 'middle';

    if (needMarquee) {
      ctx.fillText(text, 0, canvas.height / 2);
    } else {
      ctx.fillText(text, maxWidth / 2, canvas.height / 2);
    }

    // 获取 Canvas 的图像数据，这里假设 toDataURL 方法可用
    const dataUrl = await canvas.toDataURL('image/png');
    // 去除 base64 编码的头部
    const base64Data = dataUrl.replace('data:image/png;base64,', '');

    const key = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
    // 定义文件路径
    const filePath = `${FileSystem.documentDirectory}/${key}.2.png`;
    if ((await FileSystem.getInfoAsync(filePath)).exists) {
      await FileSystem.deleteAsync(filePath);
    }
    // 使用 Expo File System 保存文件
    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // console.log('Image saved successfully at', filePath);

    const loader = new TextureLoader();
    const texture = loader.load(filePath);

    // await FileSystem.deleteAsync(filePath);

    texture.needsUpdate = true;
    if (needMarquee) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.x = maxWidth / canvas.width;
    } else {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    labelList.push({
      sphere: sphereIem,
      texture,
      needMarquee,
      width: canvasWidth,
      height: textHeight,
    });
  }
  // console.log(
  //   'labelList',
  //   labelList.map((x) => {
  //     return {
  //       width: x.width,
  //       height: x.height,
  //     };
  //   }),
  // );

  return labelList;
}
