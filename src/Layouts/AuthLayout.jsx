import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import authImg from '../assets/authImg.png'


const AuthLayout = () => {
    return (
        <div className="p-12 bg-black min-h-screen max-w-7xl">
            <div>
                <Link to="/" className="text-3xl font-bold">
                    <span className="text-primary">PROP</span><span className="text-secondary">EASE</span>
                </Link>
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <img
                    src={authImg}
                    className="max-w-sm"/>
                </div>
                <div className='flex-1'>
                 <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;