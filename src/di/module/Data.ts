import { container } from 'tsyringe';
import { AppDependencies } from '@di/types';
import { LocalEncryptedCache, LocalEncryptedCacheImpl } from '@core/local';

export const registerDataModule = () => {
    // Cache
    container.register<LocalEncryptedCache>(
        AppDependencies.LocalEncryptionCache,
        {
            useClass: LocalEncryptedCacheImpl,
        },
    );
    
};
