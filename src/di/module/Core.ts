import { container } from 'tsyringe';
import { AppDependencies } from '@di/types';
import { registerDataModule } from '@di/module/Data';
import { appConfig } from '@config/AppConfig';
import { registerApiClientDependencies } from './Api';
import { decode, encode } from 'base-64';

const registerDependencies = () => {
  registerDataModule();
  registerApiClientDependencies();
  registerBase64();
};

const registerCoreDependencies = () => {
  container.register<Record<string, any>>(AppDependencies.AppConfig, {
    useValue: appConfig(),
  });
};

const registerBase64 = () => {
  // this function call support jwt decoding
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

}

export { registerDependencies, registerCoreDependencies, container };