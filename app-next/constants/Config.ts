export enum ConfigType {
  DEV = 'DEV',
  PROD = 'PROD',
}
interface Config {
  api: string;
  mqtt: {
    host: string;
  };
}
const config: Record<ConfigType, Config> = {
  PROD: {
    api: 'https://aisa-api.aikavision.com',
    mqtt: {
      host: 'aisa-api.aikavision.com',
    },
  },
  DEV: {
    api: 'https://api-test.aikavision.com',
    mqtt: {
      host: 'api-test.aikavision.com',
    },
  },
};
export default config;

console.log('EXPO_PUBLIC_ENV', process.env.EXPO_PUBLIC_ENV);

// export let configType = (() => {
//   return (process.env.EXPO_PUBLIC_ENV as ConfigType) || ConfigType.PROD;
// })();
export let configType = ConfigType.DEV;

export function setConfigType(newConfigType: ConfigType) {
  configType = newConfigType;
}
export function getConfig(): Config {
  return config[configType];
}
