import React, {useState} from 'react'
import ReactQuill from "react-quill";
import './theme.css'

export const PageCreator = () => {
    const [category, setCategory] = useState("")
    const [name, setName] = useState("")
    const [route, setRoute] = useState("")
    const [gridConfig, setGridConfig] = useState(["1"])
    const [gridHeights, setGridHeights] = useState(["10rem"])
    const [gridContentType, setGridContentType] = useState([["Select..."]])
    const [gridContent, setGridContent] = useState([[""]])
    const [numRows, setNumRows] = useState(1)
    const [currRow, setCurrRow] = useState(0)
    const [currRowLayout, setCurrRowLayout] = useState("")
    const [currRowHeight, setCurrRowHeight] = useState(10)
    const [currCell, setCurrCell] = useState(-1)
    const [currCellContent, setCurrCellContent] = useState("Select...")
    const [test, setTest] = useState("")

    const createPage = () => {
        fetch("http://localhost:8000/v1/add-page", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name: name,
                route: route,
                category: category
            })
        })
        setCategory("")
        setName("")
        setRoute("")
    }

    const changeNumRows = (newNum: number) => {
        if (Number.isNaN(newNum)) {
           return
        }
        setNumRows(newNum)
        if (gridConfig.length < newNum) {
            const newGridConfig = [...gridConfig]
            const newGridHeights = [...gridHeights]
            const newGridContentType = [...gridContentType]
            const newGridContent = [...gridContent]
            while (newGridConfig.length < newNum) {
                newGridConfig.push("1")
                newGridHeights.push("10rem")
                newGridContentType.push(["Select..."])
                newGridContent.push([""])
            }
            setGridConfig(newGridConfig)
            setGridHeights(newGridHeights)
            setGridContentType(newGridContentType)
            setGridContent(newGridContent)
        } else {
            const newGridConfig = [...gridConfig]
            const newGridHeights = [...gridHeights]
            const newGridContentType = [...gridContentType]
            const newGridContent = [...gridContent]
            while (newGridConfig.length > newNum) {
                newGridConfig.pop()
                newGridHeights.pop()
                newGridContentType.pop()
                newGridContent.pop()
            }
            setGridConfig(newGridConfig)
            setGridHeights(newGridHeights)
            setGridContentType(newGridContentType)
            setGridContent(newGridContent)
        }
    }

    const changeCurrRowHeight = (newHeight: number) => {
        setCurrRowHeight(newHeight)
        const newGridHeights = [...gridHeights]
        newGridHeights[currRow] = newHeight.toString() + "rem"
        setGridHeights(newGridHeights)
    }
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginLeft: "1.5rem", marginRight: "1.5rem"}}>
                <h4 style={{marginRight: "1rem"}}>Category: </h4>
                <input type="text" value={category} style={{color: "#f1f7ed"}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}/>
                <h4 style={{marginLeft: "2rem", marginRight: "1rem"}}>Page Name: </h4>
                <input type="text" value={name} style={{color: "#f1f7ed"}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                <h4 style={{marginLeft: "2rem", marginRight: "1rem"}}>Page URL: </h4>
                <input type="text" value={route} style={{color: "#f1f7ed"}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoute(e.target.value)}/>
                <button style={{marginLeft: "2rem"}} onClick={createPage}>Create</button>
            </div>
            <hr style={{width: "95%", marginTop: "1rem", marginBottom: "1rem"}}/>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <h5 style={{marginRight: "1.5rem"}}>Number of Rows: </h5>
                <input style={{width: "3rem", marginRight: "2.5rem", color: "#f1f7ed"}} type="number" value={numRows} onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeNumRows(parseInt(e.target.value))}/>
                <h5 style={{marginRight: "1.5rem"}}>Current Row Layout: </h5>
                <select style={{width: "10rem"}} className="muted-button" name="currentRowLayout" id="currentRowLayout" value={currRowLayout} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeCurrRowLayout(e.target.value)}>
                    <option value="1">1</option>
                    <option value="1-1">1-1</option>
                    <option value="1-1-1">1-1-1</option>
                    <option value="1-2">1-2</option>
                    <option value="2-1">2-1</option>
                    <option value="1-1-1-1">1-1-1-1</option>
                    <option value="2-1-1">2-1-1</option>
                    <option value="1-2-1">1-2-1</option>
                    <option value="1-1-2">1-1-2</option>
                    <option value="1-3">1-3</option>
                    <option value="3-1">3-1</option>
                </select>
                <h5 style={{marginLeft: "2.5rem", marginRight: "1.5rem"}}>Current Row Height: </h5>
                <input style={{width: "3rem", marginRight: "2.5rem", color: "#f1f7ed"}} type="number" value={currRowHeight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeCurrRowHeight(parseInt(e.target.value))}/>
                <h5 style={{marginLeft: "2.5rem", marginRight: "1.5rem"}}>Current Cell Content Type: </h5>
                { currCell === -1 ?
                    <h5 style={{width: "10rem", fontWeight: "700"}}>No Cell Selected</h5>
                    :
                    <select style={{width: "10rem"}} className="muted-button" name="currCellContent" id="currCellContent" value={currCellContent} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeCurrCellContent(e.target.value)}>
                        <option value="Select...">Select...</option>
                        <option value="Text">Text</option>
                        <option value="Image">Image</option>
                        <option value="Video">Video</option>
                        <option value="Blank">Blank</option>
                    </select>
                }
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                {getGrid()}
            </div>
        </div>
    )
}