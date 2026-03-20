import { THREE } from 'expo-three';
import { Texture } from 'three';

export interface LabelItem {
  sphere: API.SphereDto;
  texture: Texture;
  needMarquee: boolean;
  width: number;
  height: number;
}
export interface LabelSpriteItem {
  smallBall: THREE.Mesh;
  sprite?: THREE.Sprite;
  spriteMaterial?: THREE.SpriteMaterial;
  labelItem?: LabelItem;
}
