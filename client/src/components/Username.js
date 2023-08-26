import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../assets/avatar.png';
import styles from '../styles/Username.module.css';
import {Toaster} from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/Validate';
import { useAuthStore } from '../store/store';



export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore( state => state.setUsername);


  const formik = useFormik({
    initialValues:{
      username : ''
    },
    validate: usernameValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      setUsername(values.username);
      navigate('/password')
    }
  })

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
          <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>
              <div className="title flex flex-col items-center">
                <h3 className="text-5xl font-bold">Hello Again</h3>
                <span className="py-4 text-1xl w-3/2 text-center text-gray-500">
                  Explore more by Connecting With Us..</span>
              </div>

              <form className="py-1" onSubmit={formik.handleSubmit}>
                <div className="profile flex justify-center py-4">
                  <img src={Avatar} alt="avatar" className={styles.profile_img} />
                </div>

                <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
                  <button type="submit" className={styles.btn}>Let's Go</button>
                </div>

                <div className="text-center py-4">
                  <span className='text-gray-500'>Not a Member <Link to="/register" className="text-red-500">Register Now</Link></span>
                </div>
              </form>
            </div>
          </div>
        </div>
        )
}
