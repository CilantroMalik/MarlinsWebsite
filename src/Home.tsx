import React from 'react'
import {Header} from "./Header";
import {useNavigate} from "react-router";

export const Home = () => {
    const navigate = useNavigate()

    return (
        <div>
            <Header />
            <button style={{marginLeft: "1.5rem"}} onClick={() => navigate("/pageCreator")}>Go to Page Creator</button>
        </div>
    )
}