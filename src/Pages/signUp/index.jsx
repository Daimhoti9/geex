import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {
    EyeInvisibleFilled,
    EyeFilled
} from '@ant-design/icons';
import axios from 'axios';
import {toast} from "react-toastify";
import '../../App.css'


export const Signup = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        role: ""
    });
    const [otp, setOTP] = useState("");

    const [showOTP, setShowOTP] = useState(false);


    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };


    const handleSubmit = async () => {
        console.log('here')
        if (inputs.email === "" || inputs.password === "" || inputs.role === "") {
            toast.warn('Please fill in all the fields!');
            return;
        }

        try {
            // toast.info('Sending OTP to email...'); // This is equivalent to 'pending' state

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/registration`, {
                email: inputs.email,
                password: inputs.password,
                role: inputs.role
            });

            // setShowOTP(true);
            // toast.success(response.data.message);

            toast.success('Sign Up Successful');
            navigate('/login')

        } catch (error) {
            toast.error(
                error.response?.data?.error || 'Failed to send OTP. Try again.'
            );
        }
    };


    const handleOTPSubmit = () => {

        if (otp === "") {
            toast.warn('Fill the OTP field');
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/user/verifyOTP`, {
            email: inputs.email,
            otp: otp
        })
            .then((response) => {
                if (response.data.error) {
                    toast.error(response.data.error);
                } else {
                    toast.success('Sign Up Successful');
                    navigate('/'); // This navigates to the home page after successful sign up
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
                toast.error(errorMessage);
            });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit();
    };


    return (
        <div className=' bg-opacity-50 flex justify-center items-center min-h-screen rounded-lg'>

            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div
                    className="shadow-lg"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "20px",
                        alignSelf: 'center',
                        borderRadius: "10px",
                    }}
                >
                    {showOTP ? (
                        <>
                            <h1 style={{textAlign: 'center'}}>Verify OTP</h1>
                            <div className="fieldbox">
                                <label htmlFor="otp" style={{fontSize: "12px"}}>
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    placeholder="OTP"
                                    className="signin-input text-black"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <button className="otp-back-btn" onClick={() => setShowOTP(false)}>
                                    {" "}
                                    &lt;{" "}
                                </button>
                                <button className="otp-btn" onClick={handleOTPSubmit}>
                                    Verify OTP
                                </button>
                            </div>
                        </>
                    ) : (
                        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                            <h1 className="text-2xl font-bold mb-2">Sign up</h1>
                            <div className="fieldbox">
                                <label htmlFor="email" style={{fontSize: "12px"}}>
                                    Your Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={inputs.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="signin-input text-black"
                                />
                            </div>
                            <div className="fieldbox">
                                <label htmlFor="password" style={{fontSize: "12px"}}>
                                    Your Password
                                </label>
                                <input
                                    type={passwordShown ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    value={inputs.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className="signin-input text-black"
                                />
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
                            <div className="fieldbox">
                                <label htmlFor="password" style={{fontSize: "12px"}}>
                                    Role
                                </label>
                                <select className="signin-input text-black" name="role" id="role"
                                        value={inputs.role}
                                        onChange={handleInputChange}>
                                    <option value="">Select Role</option>
                                    <option value="basic">Basic</option>
                                    <option value="premium">Premium</option>
                                    <option value="admin">Super Admin</option>
                                </select>
                            </div>
                            <div>
                            <Link style={{fontSize: "10px"}} to="/login">
                                    Already have an account? Sign in
                                </Link>
                            </div>
                            <button className="signin-btn !bg-[#d8b573]" onClick={handleSubmit}>
                                Sign up
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
