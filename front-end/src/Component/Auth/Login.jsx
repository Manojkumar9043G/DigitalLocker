import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ background }) {
  const navigate = useNavigate();

  const [error, setError] = useState(""); 
  const [form, setForm] = useState({    
    email: "",
    password: "",
  });

  function userInput(e) {
    const name = e.target.name;
    const value = e.target.value;

    setForm((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("https://digitallocker.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const message = await response.json();

      if (message.success) {
        const token = message.token;
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        setError(message.msg);
      }
    } catch (err) {
      setError("Server Error");
    }
  }

  return (
    <form onSubmit={handleSubmit} method="post">
      <div
        className="login-container"
        style={{
          backgroundImage: `url(${background})`,
          width: "100vw",
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="login-box">
          <h2>Login to your account</h2>
          <div className="input">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              onChange={userInput}
            />
          </div>
          <div className="input">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={userInput}
            />
          </div>
          <div className="exist">{error}</div>
          <button type="submit">Login</button>
          <div className="login">
            <p>
              Create a new account? <a href="/register">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
