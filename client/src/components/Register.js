import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../assets/avatar.png';
import styles from '../styles/Username.module.css';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/Validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';


export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: 'panya123@gmail.com',
      username: 'godu123',
      password: 'panya@13'

    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: 'Creating..',
        success: <b>Welcome, You have registered Successfully..!</b>,
        error: <b>There's some error, check the details properly..</b>
      });

      registerPromise.then(function () { navigate('/') });
    }
  })

  /**we need to support file handler by own */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "35%", height: "100%" }}>
          <div className="title flex flex-col items-center">
            <h3 className="text-4xl font-bold">Register</h3>
            <span className="py-2 text-1xl w-3/2 text-center text-gray-500">
              Join With Us to Explore More...</span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile" >
                <img src={file || Avatar} alt="avatar" className={styles.profile_img} />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password*' />
              <button type="submit" className={styles.btn}>Register Me</button>
            </div>
            <div className="text-center py-4">
              <span className='text-gray-500'>Already Register ? <Link to="/" className="text-red-500">Login Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
