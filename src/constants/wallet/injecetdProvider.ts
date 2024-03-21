"use client";
// src/wallets/getInjectedConnector.ts
import { createConnector } from "wagmi";
import { injected } from "wagmi/connectors";
function getExplicitInjectedProvider(flag: boolean) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined")
    return;
  const providers = window.ethereum.providers;
  return providers
    ? providers.find((provider) => provider[flag])
    : window.ethereum[flag]
    ? window.ethereum
    : void 0;
}
function getWindowProviderNamespace(namespace: string) {
  const providerSearch = (provider, namespace2) => {
    const [property, ...path] = namespace2.split(".");
    const _provider = provider[property];
    if (_provider) {
      if (path.length === 0) return _provider;
      return providerSearch(_provider, path.join("."));
    }
  };
  if (typeof window !== "undefined") return providerSearch(window, namespace);
}
function hasInjectedProvider({
  flag,
  namespace,
}: {
  flag?: boolean;
  namespace: string;
}) {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== "undefined")
    return true;
  if (flag && typeof getExplicitInjectedProvider(flag) !== "undefined")
    return true;
  return false;
}
function getInjectedProvider({
  flag,
  namespace,
}: {
  flag: boolean;
  namespace: string;
}) {
  var _a;
  if (typeof window === "undefined") return;
  if (namespace) {
    const windowProvider = getWindowProviderNamespace(namespace);
    if (windowProvider) return windowProvider;
  }
  const providers = (_a = window.ethereum) == null ? void 0 : _a.providers;
  if (flag) {
    const provider = getExplicitInjectedProvider(flag);
    if (provider) return provider;
  }
  if (typeof providers !== "undefined" && providers.length > 0)
    return providers[0];
  return window.ethereum;
}
function createInjectedConnector(provider: any) {
  return (walletDetails: any) => {
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.rkDetails.id,
            name: walletDetails.rkDetails.name,
            provider,
          }),
        }
      : {};
    return createConnector((config) => ({
      ...injected(injectedConfig)(config),
      ...walletDetails,
    }));
  };
}
function getInjectedConnector({
  flag,
  namespace,
  target,
}: {
  flag?: boolean;
  namespace: string;
  target?: any;
}) {
  const provider = target ? target : getInjectedProvider({ flag, namespace });
  return createInjectedConnector(provider);
}

export { hasInjectedProvider, getInjectedConnector };
