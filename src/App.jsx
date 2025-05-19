// global styles
import './assets/styles/global.css'
import './App.scss'

import {Route, Routes, useLocation} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import {useLayoutEffect} from "react"
import Application from "./pages/application/Application.jsx";
import {antdConfig} from "./config/antd/antdConfig.js";
import {ConfigProvider} from "antd";
import Application2 from "./pages/application/Application2.jsx";
import Profile from "./pages/profile/Profile.jsx";
import AuthAdmin from "./components/auth/AuthAdmin.jsx";
import AdminEduLang from "./pages/admin/edu-lang/AdminEduLang.jsx";
import AdminHeader from "./components/admin/header/AdminHeader.jsx";
import AdminEduForm from "./pages/admin/edu-form/AdminEduForm.jsx";
import AdminLogin from "./pages/admin/login/AdminLogin.jsx";
import AdminEduDir from "./pages/admin/edu-dir/AdminEduDir.jsx";
import AdminFeed from "./pages/admin/feed/AdminFeed.jsx";
import Auth from "./components/auth/Auth.jsx";


const Wrapper = ({ children }) => {
    const location = useLocation()
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0)
    }, [location.pathname])
    return children
}

function App() {


    const path = window.location.pathname

    return (
    <div className={`App ${path.includes('admin') ? 'admin' : ''}`}>

        <Wrapper>
            <ConfigProvider theme={antdConfig()}>

                <Routes>

                    <Route path='/' element={<Application />} />
                    <Route path='/application' element={<Application2 />} />

                    <Route element={<Auth />}>

                        <Route path='/profile' element={<Profile />} />

                    </Route>

                </Routes>


                <AdminHeader />
                <Routes>
                    <Route element={<AuthAdmin />}>

                        <Route path='/admin/edu-form' element={<AdminEduForm />} />
                        <Route path='/admin/edu-lang' element={<AdminEduLang />} />
                        <Route path='/admin/edu-dir' element={<AdminEduDir />} />
                        <Route path='/admin/feeds' element={<AdminFeed />} />

                    </Route>

                    <Route path='/admin/login' element={<AdminLogin />} />
                </Routes>

            </ConfigProvider>
        </Wrapper>

        <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
                style: {
                    borderRadius: '30px'
                }}}
        />
    </div>
  )
}

export default App
