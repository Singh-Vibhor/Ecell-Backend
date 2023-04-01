import React from 'react'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

const Posts = () => {
    const [posts, setPosts] = useState([{}]);
    const [users, setUsers] = useState([{}]);
    const [editState, setEditState] = useState(-1);

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

    const [form, setForm] = useState({
        name: "",
        description: "",
        User: Cookies.get('id'),
    });

    const [form2, setForm2] = useState({
        name: "",
        description: "",
    });

    const [searchResult, setSearchResult] = useState("");

    function handle(e) {
        const n = { ...form };
        n[e.target.name] = e.target.value;
        setForm(n);
    }

    
    

    function handle1(e) {
        setSearchResult(e.target.value);
    }

    function handle2(e) {
        const n = { ...form2 };
        n[e.target.name] = e.target.value;
        setForm2(n);
    }

    async function createPost() {
        await fetch('http://127.0.0.1:8000/createPost/', {
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
                    alert("Post Created successfully.");
                    window.location.href = '/posts'
                }
                else alert("Failed to Create Post");
            });
    }

    async function deletePost(id) {
        let url = 'http://127.0.0.1:8000/deletePost/'
        url += `${id}`
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response === 0) {
                    alert("Post Deleted successfully.");
                    window.location.href = '/posts'
                }
                else alert("Failed to Delete Post");
            });
    }

    async function editPost(id) {
        let url = 'http://127.0.0.1:8000/updatePost/'
        let post = {
            name: form2.name,
            description: form2.description,
            id: id
        }
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post)
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response === 0) {
                    alert("Post Edited successfully.");
                    window.location.href = '/posts'
                }
                else alert("Failed to Edit Post");
            });
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
            <Link to='/'>Log Out</Link>
            <div>
                <h1>Create Post</h1>
                <input required type="text" name="name" placeholder="Name Of Post" onChange={(e) => handle(e)} />
                <input required type="text" name="description" placeholder="Description" onChange={(e) => handle(e)} />
                <input type="button" value="Create Post" onClick={createPost} />
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
                        {post.User == Cookies.get('id') ?
                            <>
                                <input type="button" value="Delete Post" onClick={() => { deletePost(post.id) }} />
                                <input type="button" value="Edit Post" onClick={() => setEditState(post.id)} />
                                {editState == post.id ? <>
                                    <input required type="text" name="name" onChange={(e) => handle2(e)} />
                                    <input required type="text" name="description" onChange={(e) => handle2(e)} />

                                    <input type="button" value="Done" onClick={() => editPost(post.id)} />
                                    <input type="button" value="Cancel" onClick={() => setEditState(-1)} />
                                </> : <></>}
                            </>
                            : <></>}
                    </>
                ))}
            </div>

        </div>
    )
}

export default Posts
