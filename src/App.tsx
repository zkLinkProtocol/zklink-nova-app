import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'

const Airdrop = lazy(() => import('@/pages/Airdrop'))
const Dashboard = lazy(() => import('@/pages/Airdrop/Dashboard'))
const Bridge = lazy(() => import('@/pages/Airdrop/Bridge'))
const Leaderboard = lazy(() => import('@/pages/Leaderboard'))

export default function App() {
    return (
        <main className='dark text-foreground bg-background'>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to='/airdrop' />}
                    />
                    <Route
                        path='/airdrop'
                        element={
                            <Suspense fallback=''>
                                <Airdrop />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/airdrop/dashboard'
                        element={
                            <Suspense fallback=''>
                                <Dashboard />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/airdrop/bridge'
                        element={
                            <Suspense fallback=''>
                                <Bridge />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/leaderboard'
                        element={
                            <Suspense fallback=''>
                                <Leaderboard />
                            </Suspense>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </main>
    )
}
