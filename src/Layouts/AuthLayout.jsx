import React from 'react';
import { Outlet } from 'react-router';
import authImg from '../assets/authImg.png'


const AuthLayout = () => {
    return (
        <div className="p-12 bg-black min-h-screen">
            <div>
               <img
            src="https://i.ibb.co.com/ymC5YNfw/colored-logo.png"
            alt="Propease Logo"
            className="w-30 h-30"
          />
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <img
                    src={authImg}
                    className="max-w-sm"
                />
                </div>
                <div className='flex-1'>
                 <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;