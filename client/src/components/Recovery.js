import React, { useEffect, useState } from 'react';
import styles from '../styles/Username.module.css';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { generateOTP, verifyOTP } from '../helper/helper';

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success('OTP sent to email, Kindly Check..!');
      return toast.error('Problem while generating OTP !')
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if (status === 201) {
        toast.success('Verify Successfully !')
        return navigate('/reset')
      }
    } catch (error) {
      return toast.error('Check email, OTP is wrong.. !')
    }

  }

  //handler function of resend OTP
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email !</b>,
      error: <b>Couldn't Send, Something got error</b>
    });

    sendPromise.then(OTP => {
      console.log(OTP);
    })
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h3 className="text-5xl font-bold">Be Calm While</h3>
            <span className="py-4 text-1xl w-3/2 text-center text-gray-500">
              We are fetching the details for account...</span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">

                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digits OTP sent to your email address
                </span>
                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='Enter OTP' />
              </div>

              <button type="submit" className={styles.btn}>Recover</button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className='text-gray-500'>OTP not Recieved? <button onClick={resendOTP} className="text-red-500">Resend OTP</button></span>
          </div>
        </div>
      </div>
    </div>
  )
}
