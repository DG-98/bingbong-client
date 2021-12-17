import React from 'react'
import { useState, useEffect} from 'react'
import App from '../../App'
import uuid from 'uuid'
export default function Profile(props) {
// `use strict`;
     //states
    const [profile, setProfile] = useState(null)
    const [edit, setEdit] = useState(false)
    const [createProfile, setCreateProfile] = useState({
        username: '',
        owner: props.user._id
    })

    useEffect(()=>{
        props.getAllProfile()
        console.log("did props reset down here?" , props.curProfile)
        console.log(props.curProfile.length)
    }, [])


    const handleInputChange = (e) => {
        setCreateProfile({...createProfile, [e.target.name]: e.target.value})
    }

    const deleteVideo = (e) => {
        e.preventDefault()
        fetch(`http://localhost:8000/videos/${e.target.id}`, {
            method: "DELETE",
                headers: {
                           "Content-Type": "application/json",
                           "Authorization": `Bearer ${props.user.token}`
                         },
            })
            .then(() => props.getAllVideos()) 
            .catch(error => console.error())
        // console.log("delete Video target", e.target.value
        }

    const deleteComment = (e) => {
        e.preventDefault()
        fetch(`http://localhost:800/comments/${e.target.id}`, {
            method: "DELETE",
                headers: {
                           "Content-Type": "application/json",
                           "Authorization": `Bearer ${props.user.token}`
                         },
            })
            .then(() => props.getAllComments())
            .catch(error => console.error)
    }

    let userComments = props.allComments.map((uCom)=>{

        let filterFilter = uCom.comments.filter((uCom)=>{
            console.log(uCom)
        // const obj = uCom
        // const {0} = obj
        // console.log(obj)
        return props.user.email === uCom.username
        })
        console.log("this is usercom:", filterFilter)
        return filterFilter
    })

    // console.log("this usercom outside", userComments[0][0].commentText)
    // let UserComMap = userComments.map((comment)=>{
    //     <li>{comment.commentText}</li>
    // })

    // findbyusername findbytext in backend
    // db.comments.find({
    //     "username" : req.body.username,
    //     "commentText" : req.body.commentText,
    // })

    // db.comments.deleteOne({uuid: req.body.uuid})


    let userComMap = userComments[0].map((comment)=>{
        console.log("usermap comment", comment)
        console.log(comment._id)
        return <div>
                {comment.commentText}
                <form 
                id= {comment._id}
                onSubmit= {deleteComment}>
                    <button
                        type= "submit"
                        value= "Submit"
                        >
                        Delete
                    </button>
                </form>
               </div>
    }) 












    console.log('profile all videos', props.allVideos)
    const handleSubmit = (e) => {
        e.preventDefault() 
        // let jsonPayload = {
        //     username: createProfile.username,
        //     owner: createProfile.owner
        // }
        console.log(typeof(jsonPayload))
        fetch('http://localhost:8000/users',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.user.token}`
            },
            body: JSON.stringify({
                profile: {
                username: createProfile.username,
                owner: createProfile.owner
                }
            })

        })
        .then(()=>{
            setCreateProfile({
                username: '',
                owner: props.user._id
            })
            props.getAllProfile()
        }) 
        .catch((error)=>{
            console.log("oh..you fucked up lmao", error)
        })
    }

    let userVideos = props.allVideos.filter((uVideo)=>{
        return props.user._id === uVideo.owner })
        console.log( 'user videos', userVideos)


    let userMap = userVideos.map((video)=>{
        return <div>
                {video.title}
                <form 
                id= {video._id}
                onSubmit= {deleteVideo}>
                    <button
                        type= "submit"
                        value= "Submit"
                        >
                        Delete
                    </button>
                </form>
               </div>
    }) 
    let renderform

    if (props.curProfile.length === 0) {
        // if there is no curprofile && edit is false then there must not be a profile at all

        const errmsg = "The number should be 0"
            console.assert(props.curProfile.length === 0, {length: props.curProfile.length, errmsg: errmsg})
            console.log("this is length before htiting the decision tree:", props.curProfile.length)
            return renderform = (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Set Your Username: </label>
                        <input type="text" name="username" id="username" onChange={handleInputChange} value={createProfile.username} />
                        <input type="submit" value="Submit" />
                    </form>

                </div>
            )
        } else if (props.curProfile.length === 1 && edit === true) {
            // if there is a curprof and edit is true then edit
            return renderform = (
                <div>
                    Want to edit...
                    <button> Edit </button>
                </div>
            )
        } else if (props.curProfile.length === 1 && edit === false) {
            // if there is a curprof and edit is false then they just want display...
            console.log("This is username:", props.curProfile[0].username)
            return renderform = (
                <div>
                    Current UserName: 
                    <h1>{props.curProfile[0].username}</h1>
                    {userMap}
                    {userComMap}

                </div>
            )
        } else {
            const errmsg = "The number should be 1"
            const errmsg2 = "The number should be false"
            console.assert(props.curProfile.length === 1, {length: props.curProfile.length, errmsg: errmsg})
            console.assert(edit === false, {edit: edit, errmsg: errmsg2})
            return null
        }        

    }