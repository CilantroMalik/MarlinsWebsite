import React, {useEffect, useState} from 'react'
import { Route, Routes } from 'react-router-dom';
import { Home } from './Home'
import { PageCreator } from "./PageCreator";
import { ContentPage } from './ContentPage'

function Router(): JSX.Element {

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
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/pageCreator" element={<PageCreator />}/>
            {pageData.pages.map(page => { return (
                <Route key={page.name} path={page.route} element={<ContentPage pageName={page.name} />} />
            )})}
        </Routes>
    )
}

export default Router