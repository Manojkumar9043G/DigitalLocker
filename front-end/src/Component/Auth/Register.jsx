import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({background}){

    const natived = useNavigate();
    const [error,SetError] = useState('');

    const [form ,setFrom] = useState({
        name: "",
        email: "",
        password: ""
    });

    function userInputs(e){
        const name = e.target.name;
        const value = e.target.value;

        setFrom((user)=>{
            return {
                ...user,
                [name]: value
            };
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch('https://digitallocker.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
            // ✅ Registration successful
            natived('/'); // Navigate to home
            } else {
            // ❌ Registration failed with message
            SetError(data.msg || 'Registration failed');
            }
        } catch (err) {
            // ❌ Server didn't return JSON / Fetch failed (e.g., CORS or network error)
            SetError('Something went wrong. Please try again later.');
            console.error('Registration error:', err);
        }
}


    return(
        <>  
            <form onSubmit={handleSubmit} method="post">
                <div className="login-container" style={{
                    backgroundImage: `url(${background})`,
                    width: '100vw',
                    height: '100vh',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="login-box">
                        <h2>Create the account</h2>
                        <div className="input">
                            <label htmlFor="">UserName</label>
                            <input type="text" name="name" id="" placeholder="enter your Full Name" onChange={userInputs}/>
                        </div>
                        <div className="input">
                            <label htmlFor="">Email</label>
                            <input type="text" name="email" id="" placeholder="enter your email" onChange={userInputs}/>
                            <div className="exist">{error}</div>
                        </div>
                        <div className="input">
                            <label htmlFor="">Password</label>
                            <input type="password" name="password" id="" placeholder="enter your password" onChange={userInputs}/>
                        </div>
                        <button>Create Account</button>
                        <div className="login">
                            <p>Already have an account? <a href="/">Login</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Register;