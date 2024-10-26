import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: './migrations',
    icon: './catalogue.ico'
  },
  rebuildConfig: {},
  makers: [{
    name: '@electron-forge/maker-squirrel', // pour Windows
    config: {
      name: 'Catalogue',
      icon: './catalogue.ico',
      setupIcon: './catalogue.ico',  // Icône pour le fichier d'installation
    },
  }, new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  publishers:[
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "Lunotte",
          "name": "product-manager"
        }
      }
    }
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      "devContentSecurityPolicy":  [
        "default-src 'self';",
        "font-src 'self' https://fonts.gstatic.com data:;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "connect-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data:;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
      ].join(' '),
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/entrypoints/index.html',
            js: './src/entrypoints/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/bridge/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
