import { useState } from "react";

const SignUp = () => {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    async function SignUp() {
        await fetch('http://127.0.0.1:8000/signup/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response === 0) {
                    alert("Signed Up successfully.");
                    window.location.href = "/login"
                }
                else alert("Oops! Failed Sign Up");
        });
    }



    function handle(e) {
        const n = { ...form };
        n[e.target.name] = e.target.value;
        setForm(n);
    }


   

    return (
        <div>
            <h1>SignUp</h1>
            <input required type="text" name="username" placeholder="Your username" onChange={(e) => handle(e)} />
            <input required type="text" name="email" placeholder="Your email" onChange={(e) => handle(e)} />
            <input required type="password" name="password" placeholder="Your Password" onChange={(e) => handle(e)} />
            <input type="button" value="SignUp" onClick={SignUp} />
        </div>
    )
}

export default SignUp;
