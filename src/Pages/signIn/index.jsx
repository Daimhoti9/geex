import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {
    EyeInvisibleFilled,
    EyeFilled
} from '@ant-design/icons';
import '../../App.css'
import axios from "axios"
import {toast} from "react-toastify";


const Signin = () => {

    useEffect(() => {
        sessionStorage.clear();
    }, [])

    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const handleInputChange = (event) => {
        event.persist()
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}))
    }

    const handleSubmit = () => {
        if (inputs.email === "" || inputs.password === "") {
            toast.warn('Please fill in all the fields.');
            return;
        }

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
            email: inputs.email,
            password: inputs.password
        })
            .then((response) => {
                if (response.data.error) {
                    toast.warn(response.data.error);
                } else {
                    console.log(response.data)
                    sessionStorage.setItem('logged', 'true');
                    sessionStorage.setItem('user', response.data.email);
                    sessionStorage.setItem('role', response.data.role);
                    sessionStorage.setItem('token', response.data.token);
                    if(response.data.role == 'admin') {
                        navigate('/home');
                    } else {
                        navigate('/recruters');
                    }
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || "An error occurred during login.";
                toast.error(errorMessage);
            });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    };

    return (
        <div className='flex justify-center items-center min-h-screen min-w-[100vw]'>
                <div className='bg-opacity-50 rounded-lg scroll-hidden'
                     >
                    <form
                        className="shadow-lg scroll-hidden"
                        onSubmit={handleFormSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            padding: "20px",
                            alignSelf: 'center',
                            borderRadius: "10px",
                        }}>
                        <h1 className="mb-5 text-3xl font-bold">Sign in</h1>
                        <div className="fieldbox">
                            <label htmlFor="email" style={{fontSize: '14px'}}>Your Email</label>
                            <input name="email" id="email" value={inputs.email} onChange={handleInputChange}
                                   placeholder="User Name" className="text-black signin-email"/>
                        </div>
                        <div className="fieldbox">
                            <label htmlFor="password" style={{fontSize: '14px', textAlign: 'left'}}>Your
                                Password</label>
                            <input type={passwordShown ? 'text' : 'password'} name="password" id="password"
                                   value={inputs.password}
                                   onChange={handleInputChange}
                                   placeholder="Password" className="text-black signin-input"/>
                            <span
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '65%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer'
                                }}
                            >
                        {passwordShown ? <EyeInvisibleFilled/> : <EyeFilled/>}
                      </span>
                        </div>
                        {/* <span className="text-xs text-gray-500 underline cursor-pointer" onClick={() => navigate('/signup')}>make an account!</span> */}
                        {/*<div>*/}
                        {/*    <Link style={{fontSize: '10px'}} to="/signup">Don't have an account? Sign up</Link>*/}
                        {/*</div>*/}
                        <button type='submit' className="signin-btn !bg-[#d8b573]">Sign in</button>
                        {/*<Link style={{fontSize: '10px', textAlign: 'center'}} onClick={() => setShowReset(true)}>Forgot*/}
                        {/*    Password?</Link>*/}
                    </form>
                </div>
        </div>
    );
}

export default Signin