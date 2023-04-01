import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const [posts, setPosts] = useState([{}]);
    const [users, setUsers] = useState([{}])

    useEffect(() => {
        getPost()
        getUser()
    }, [])

    const getPost = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/posts/')
        const data = await response.json()
        console.log(data)
        setPosts(data)
    }

    const getUser = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/users/')
        const data = await response.json()
        console.log(data)
        setUsers(data)
    }

    function checkUser(id) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) return users[i].username
        }
        return ""
    }

    const [searchResult, setSearchResult] = useState("");    

    function handle1(e) {
        setSearchResult(e.target.value);
    }

    async function searchPost(res) {
        let url = 'http://127.0.0.1:8000/posts/?q='
        url += `${res}`
        await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setPosts(response)
            });
    }


    return (
        <div>
            <div>
                <Link to='/signup'>
                    <input type="button" value="Sign Up" />
                </Link>
                <Link to='/login'>
                    <input type="button" value="Log In" />
                </Link>
            </div>
            <div>
                <h1>Search Bar</h1>
                <input required type="text" name="result" placeholder="Search Posts" onChange={(e) => handle1(e)} />
                <input type="button" value="Search" onClick={() => searchPost(searchResult)} />
            </div>
            <div>
                {posts.map((post, index) => (
                    <>
                        <h1>{post.name}</h1>
                        <p>{post.description}</p>
                        <small>By - {(checkUser(post.User))}</small>
                    </>
                ))}
            </div>

        </div>
    )
}

export default Home
