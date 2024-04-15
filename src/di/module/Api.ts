import { container , delay} from 'tsyringe';
import { AppDependencies } from '@di/types';
import {
    ApiClient,
} from '@core/api';

export function registerApiClientDependencies() {
    // Api-client with Jwt Bearer Authorization
    container.register(AppDependencies.RemoteClient, {
        useClass: delay(()=>ApiClient),
    });

}