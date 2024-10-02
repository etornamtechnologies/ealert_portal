import { Layout } from 'app/layout/layout.types';
import { AppStore } from 'app/shared/localstorage-helper';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Theme = 'default' | string;

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig
{
    layout: Layout;
    scheme: Scheme;
    theme: Theme;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 */
const defaultScheme : Scheme = 'light';
const userScheme = <Scheme>AppStore.get('scheme') ?? defaultScheme;
export const appConfig: AppConfig = {
    layout: 'futuristic',
    scheme: userScheme,
    theme : 'default'
};
