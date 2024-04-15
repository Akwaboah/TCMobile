import Keychain from 'react-native-keychain';
import {injectable} from 'tsyringe';

export interface LocalEncryptedCache {
  addEntry<T>(key: string, data: T): Promise<boolean>;

  getEntry<T>(): Promise<T>;

  clearEntry(): Promise<boolean>;
}

@injectable()
export class LocalEncryptedCacheImpl implements LocalEncryptedCache {
  async addEntry<T>(key: string, data: T): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to add entry:', error);
      return false;
    }
  }

  async getEntry<T>(): Promise<T> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        throw new Error('Invalid credentials');;
      }
      return JSON.parse(credentials.password);  
    } catch (error) {
      console.error('Failed to get entry:', error);
      return Promise.reject(error);
    }
  }

  async clearEntry(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword();
      return true;
    } catch (error) {
      console.error('Failed to clear entry:', error);
      return false;
    }
  }
}
