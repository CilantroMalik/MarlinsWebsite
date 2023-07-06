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

    const changeCurrRowLayout = (newLayout: string) => {
        setCurrRowLayout(newLayout)
        const newGridConfig = [...gridConfig]
        newGridConfig[currRow] = newLayout
        setGridConfig(newGridConfig)
        const newGridContentType = [...gridContentType]
        const newGridContent = [...gridContent]
        const newNumCells = newLayout.split("-").length
        if (gridContentType[currRow].length < newNumCells) {
            while (newGridContentType[currRow].length < newNumCells) {
                newGridContentType[currRow].push("Select...")
                newGridContent[currRow].push("")
            }
        } else if (gridContentType[currRow].length > newNumCells) {
            while (newGridContentType[currRow].length > newNumCells) {
                newGridContentType[currRow].pop()
                newGridContent[currRow].pop()
            }
        }
        setGridContentType(newGridContentType)
        setGridContent(newGridContent)
    }

    const changeCurrCellContent = (newContent: string) => {
        setCurrCellContent(newContent)
        const newGridContentType = [...gridContentType]
        newGridContentType[currRow][currCell] = newContent
        setGridContentType(newGridContentType)
        const newGridContent = [...gridContent]
        newGridContent[currRow][currCell] = ""
        setGridContent(newGridContent)
    }

    const changeCurrRow = (newRow: number) => {
        if (currRow !== newRow) {
            setCurrCell(-1)
        }
        setCurrRow(newRow)
        setCurrRowLayout(gridConfig[newRow])
        setCurrRowHeight(parseInt(gridHeights[newRow].replace("rem", "")))
    }

    const changeCurrCell = (newCell: number) => {
        setCurrCell(newCell)
        setCurrCellContent(gridContentType[currRow][newCell])
    }

    const changeGridContent = (row: number, cell: number, newContent: string) => {
        const newGridContent = [...gridContent]
        newGridContent[row][cell] = newContent
    }

    const getBorder = (n: number) => {
        return currRow === n ? "0.2rem solid #8f8fcc" : "0.2rem solid #8a8a8a"
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            let fd = new FormData()
            fd.append('image', e.target.files[0])
            fetch("http://localhost:8000/v1/upload-image", {
                    method: "POST",
                    mode: 'cors',
                    headers: {'Access-Control-Allow-Origin': '*'},
                    body: fd
                }
            ).then(res => {
                refreshImages()
            })
            const newGridContent = [...gridContent]
            newGridContent[currRow][currCell] = e.target.files[0].name
            setGridContent(newGridContent)
        }
    }

    const deleteImage = () => {

    }

    const refreshImages = () => {
        
    }

    const getCellContent = (row: number, cell: number) => {
        if (gridContentType[row][cell] === "Text") {
            if (currRow === row && currCell === cell) {
                return <ReactQuill theme="snow" style={{width: "100%", height: "100%", margin: "0rem", borderRadius: "1.5rem", border: "0px", display: "flex", flexDirection: "column"}} value={gridContent[row][cell]} onChange={(value) => changeGridContent(row, cell, value)} />
            } else {
                return <div dangerouslySetInnerHTML={{__html: gridContent[row][cell]}}></div>
            }
        } else if (gridContentType[row][cell] === "Image") {
            if (currRow === row && currCell === cell) {
                return <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <h5 style={{marginLeft: "1.5rem", marginRight: "1rem"}}>Upload New Image:</h5>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)}/>
                    <button onClick={deleteImage}>Delete Uploaded Image</button>
                </div>
            } else {
                if (gridContent[row][cell] !== "") {
                    return <img style={{width: "auto", height: "100%"}} src={"http://localhost:8000/static/"+gridContent[row][cell]} alt={gridContent[row][cell]}/>
                }
                return <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><h3>No image selected</h3></div>
            }
        }
        return <div></div>
    }

    const getGrid = () => {
        return Array.from(Array(numRows).keys()).map(n => {
            const divStyle = {display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "1.5rem", width: "100%", height: gridHeights[n], backgroundColor: "#525252", border: getBorder(n)}
            switch (gridConfig[n]) {
                case "1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, flexDirection: "column", margin: "0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                    </div>)
                case "1-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                    </div>)
                case "1-1-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 2 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(2)}>{getCellContent(n, 2)}</div>
                    </div>)
                case "1-2":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "2 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                    </div>)
                case "2-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "2 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                    </div>)
                case "1-1-1-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 2 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(2)}>{getCellContent(n, 2)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 3 ? "0.4rem" : "0.2rem"}} onClick={() => changeCurrCell(3)}>{getCellContent(n, 3)}</div>
                    </div>)
                case "2-1-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "2 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 2 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(2)}>{getCellContent(n, 2)}</div>
                    </div>)
                case "1-2-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "2 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 2 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(2)}>{getCellContent(n, 2)}</div>
                    </div>)
                case "1-1-2":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 2 ? "0.4rem" : "0.2rem", flex: "2 1 0"}} onClick={() => changeCurrCell(2)}>{getCellContent(n, 2)}</div>
                    </div>)
                case "1-3":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "3 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                    </div>)
                case "3-1":
                    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}} onClick={() => changeCurrRow(n)}>
                        <div style={{...divStyle, margin: "0.5rem 0.5rem 0.5rem 2rem", borderWidth: currRow === n && currCell === 0 ? "0.4rem" : "0.2rem", flex: "3 1 0"}} onClick={() => changeCurrCell(0)}>{getCellContent(n, 0)}</div>
                        <div style={{...divStyle, margin: "0.5rem 2rem 0.5rem 0.5rem", borderWidth: currRow === n && currCell === 1 ? "0.4rem" : "0.2rem", flex: "1 1 0"}} onClick={() => changeCurrCell(1)}>{getCellContent(n, 1)}</div>
                    </div>)
                default:
                    return (<div></div>)
            }
        })
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