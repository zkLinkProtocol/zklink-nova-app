import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'

// import Home from './pages/Home'
import Toast from './components/Toast'
// const Home = lazy(() => import('@/pages/Home'))
const Airdrop = lazy(() => import('@/pages/Airdrop'))
const Dashboard = lazy(() => import('@/pages/Airdrop/Dashboard'))
const AirdropBridge = lazy(() => import('@/pages/Airdrop/Bridge'))
const Leaderboard = lazy(() => import('@/pages/Leaderboard'))
const About = lazy(() => import('@/pages/About'))
// const Bridge = lazy(() => import('@/pages/Bridge'))

export default function App() {
    return (
        <main className='main dark text-foreground bg-background header'>
            <BrowserRouter>
                <Header />

                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to='/aagregation-parade' />}
                    />
                    <Route
                        path='/aagregation-parade'
                        element={
                            <Suspense fallback=''>
                                <Airdrop />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/aagregation-parade/dashboard'
                        element={
                            <Suspense fallback=''>
                                <Dashboard />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/aagregation-parade/bridge'
                        element={
                            <Suspense fallback=''>
                                <AirdropBridge />
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

                    <Route
                        path='/about'
                        element={
                            <Suspense fallback=''>
                                <About />
                            </Suspense>
                        }
                    />
                </Routes>
                <Toast />
            </BrowserRouter>
        </main>
    )
}
