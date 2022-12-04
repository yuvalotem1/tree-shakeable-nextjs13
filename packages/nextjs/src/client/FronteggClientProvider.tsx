import { AppHolder, initialize } from '@frontegg/js';
import { FronteggStoreProvider, useAuthActions, useAuthUserOrNull } from '@frontegg/react-hooks';
import { ContextHolder, fronteggAuthApiRoutes, RedirectOptions } from '@frontegg/rest-api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { FronteggProviderProps } from '../FronteggProvider';
import AppContext from './AppClientContext';
import NoSSR from 'react-no-ssr';

type ConnectorProps = FronteggProviderProps & {
  router: AppRouterInstance;
  appName?: string;
};
const Connector: FC<ConnectorProps> = ({ router, appName = 'default', hostedLoginBox, ...props }) => {
  const isSSR = typeof window === 'undefined';

  const baseName = props.basename ?? '';

  const onRedirectTo = useCallback((_path: string, opts?: RedirectOptions) => {
    let path = _path;
    if (path.startsWith(baseName)) {
      path = path.substring(baseName.length);
    }
    if (opts?.preserveQueryParams) {
      path = `${path}${window.location.search}`;
    }
    if (opts?.refresh && !isSSR) {
      // @ts-ignore
      window.Cypress ? router.push(path) : (window.location.href = path);
    } else {
      opts?.replace ? router.replace(path) : router.push(path);
    }
  }, []);

  const contextOptions = useMemo(
    () => ({
      baseUrl: (path: string) => {
        if (
          fronteggAuthApiRoutes.indexOf(path) !== -1 ||
          path.endsWith('/postlogin') ||
          path.endsWith('/prelogin') ||
          path === '/oauth/token'
        ) {
          return `${props.envAppUrl}/api`;
        } else {
          return props.envBaseUrl;
        }
      },
      clientId: props.envClientId,
    }),
    [props.envAppUrl, props.envBaseUrl, props.envClientId]
  );

  const app = useMemo(() => {
    try {
      return AppHolder.getInstance(appName);
    } catch (e) {
      return initialize(
        {
          ...props,
          hostedLoginBox: hostedLoginBox ?? false,
          basename: props.basename ?? baseName,
          authOptions: {
            ...props.authOptions,
            onRedirectTo,
          },
          contextOptions: {
            requestCredentials: 'include',
            ...props.contextOptions,
            ...contextOptions,
          },
          onRedirectTo,
        },
        appName
      );
    }
  }, [appName, props, hostedLoginBox, baseName, onRedirectTo, contextOptions]);
  ContextHolder.setOnRedirectTo(onRedirectTo);

  useEffect(() => {
    app.store.dispatch({
      type: 'auth/requestAuthorizeSSR',
      payload: props.session ?? { refreshToken: null, accessToken: null },
    });
  }, [app]);

  return (
    <AppContext.Provider value={app}>
      <FronteggStoreProvider {...({ ...props, app } as any)}>{props.children}</FronteggStoreProvider>
    </AppContext.Provider>
  );
};

const ExpireInListener = () => {
  const user = useAuthUserOrNull();
  const actions = useAuthActions();
  useEffect(() => {
    if (user && user?.expiresIn == null) {
      actions.setUser({
        ...user,
        expiresIn: Math.floor(((user as any)['exp'] * 1000 - Date.now()) / 1000),
      });
    }
  }, [actions, user]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};
export const FronteggClientProvider: FC<FronteggProviderProps> = (props) => {
  const router = useRouter();

  return (
    <NoSSR>
      <Connector {...props} router={router} framework={'nextjs'}>
        <ExpireInListener />
        {props.children}
      </Connector>
    </NoSSR>
  );
};
