import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router";

export const Header = () => {
    const navigate = useNavigate()
    const [showDrop, setShowDrop] = useState(false)
    const [dropCategory, setDropCategory] = useState("")

    const [pageData, setPageData] = useState({
        categories: [],
        pages: [{name: "", category: "", route: ""}]
    })

    useEffect(() => {
        fetch("http://localhost:8000/v1/get-pages",
            {method: "GET",
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'application/json'
                }
            }).then(res => res.json()).then(data => setPageData(data))
    }, [setPageData])

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <h1 style={{paddingLeft: "1.5rem", paddingRight: "2rem"}}>BGCNW Marlins</h1>
                {pageData.categories.map(catName => {return (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "0 1.5rem", borderRadius: "0.5rem", backgroundColor: dropCategory === catName ? "#626262": "#2d2d2d"}}
                         onMouseEnter={() => { setShowDrop(true); setDropCategory(catName) }}>
                        <h3>{catName}</h3>
                    </div>
                )})}
            </div>
            {showDrop &&
            <div style={{display: "flex", flexDirection: "row", backgroundColor: "#626262", borderRadius: "0.5rem"}}
                 onMouseLeave={() => { setShowDrop(false); setDropCategory("") }}>
                {pageData.pages.filter(page => page.category === dropCategory).map(page => {return (
                    <h4 style={{marginLeft: "2rem", marginRight: "2rem"}} onClick={() => navigate(page.route)}>{page.name}</h4>
                )})}
            </div>
            }
        </div>
    )
}