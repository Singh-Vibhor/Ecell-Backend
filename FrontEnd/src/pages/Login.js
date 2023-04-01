import { useCookies } from 'react-cookie';
import { useState } from "react";

const Login = () => {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    async function login() {
        await fetch('http://127.0.0.1:8000/login/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.response === 0) {
                    setCookie('id', response.id);
                    alert("Logged In successfully.");
                    window.location.href = "/posts"
                }
                else alert("Wrong Password or No Such User exists");
        });
    }


    const [cookie, setCookie] = useCookies();

    function handle(e) {
        const n = { ...form };
        n[e.target.name] = e.target.value;
        setForm(n);
    }


   

    return (
        <div>
            <h1>Login</h1>
            <input required type="text" name="username" placeholder="Your username" onChange={(e) => handle(e)} />
            <input required type="password" name="password" placeholder="Your Password" onChange={(e) => handle(e)} />
            <input type="button" value="Login" onClick={login} />
        </div>
    )
}

export default Login;
