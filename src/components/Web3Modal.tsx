import {
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
    useWeb3ModalTheme
  } from '@web3modal/wagmi/react'

export default function Web3Modal() {
    // 4. Use modal hook
    const modal = useWeb3Modal()
    const state = useWeb3ModalState()
    const { themeMode, themeVariables, setThemeMode } = useWeb3ModalTheme()
    const events = useWeb3ModalEvents()

    return (
        <div>
            <w3m-button />
            <w3m-network-button />
            <w3m-connect-button />
            <w3m-account-button />

            <button onClick={() => modal.open()}>Connect Wallet</button>
            <button onClick={() => modal.open({ view: 'Networks' })}>Choose Network</button>
            <button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}>Toggle Theme Mode</button>
            <pre>{JSON.stringify(state, null, 2)}</pre>
            <pre>{JSON.stringify({ themeMode, themeVariables }, null, 2)}</pre>
            <pre>{JSON.stringify(events, null, 2)}</pre>
        </div>
    )
}
