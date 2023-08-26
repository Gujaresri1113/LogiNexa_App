import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../assets/avatar.png';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/Validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook.js';
import { updateUser } from '../helper/helper';

export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch()
  

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''

    },
    enableReinitialize : true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading : 'Updating...',
        success : <b>Update Successfully...!</b>,
        error : <b>Something's gonna not updating..</b>
      })
    }
  })

  /**we need to support file handler by own */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "35%", height: "100%" }}>
          <div className="title flex flex-col items-center">
            <h3 className="text-3xl font-bold">Profile</h3>
            <span className="py-2 text-1xl w-3/2 text-center text-gray-500">
              You can now view & Update the details...</span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile" >
                <img src={apiData?.profile || file || Avatar} alt="avatar" className={`${styles.profile_img} ${extend.profile_img}`} />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-2">
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstname')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='First Name' />
                <input {...formik.getFieldProps('lastname')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Last Name' />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile' />
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email' />
              </div>
              <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address' />
              <button type="submit" className={styles.btn}>Update</button>
            </div>
            <div className="text-center py-2">
              <span className='text-gray-500'>Come Back Later ? <Link to="/" className="text-red-500">Logout</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
