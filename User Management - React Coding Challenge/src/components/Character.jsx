// import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getAllData } from "../store/action/characterAction";

function Character() {

    const dispatch = useDispatch();
    const characters = useSelector(state => state.characters.characters);
    const totalPages = useSelector(state => state.characters.totalPages); //read from store
    // const [characters, setCharacters] = useState([])
    // const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0) 
    const [arry, setArry] = useState([])

    const size = 20
    let count = 0

    useEffect(() => {
        dispatch(getAllData(currentPage)); //when currentpage change useeffect executes
    },[currentPage]);

   
    return (
        <div>
            <h2>Rick And Morty Characters</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Species</th>
                        <th>Origin Name</th>
                        <th>Location Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        characters.map((c, index) => (
                            <tr key={index}>
                                <td>{(index + 1) + (currentPage * size)}</td>
                                <td>{c.name}</td>
                                <td>{c.status}</td>
                                <td>{c.species}</td>
                                <td>{c.origin.name}</td>
                                <td>{c.location.name}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <button className="page-link" disabled={currentPage === 0}
                            onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    </li>
                    {
                        <li className="page-item">
                            <button className="page-link">{currentPage + 1} </button>
                        </li>
                       
                    }
                    <li className="page-item">
                        <button className="page-link" disabled={ currentPage === (totalPages - 1)}
                            onClick={() => setCurrentPage(currentPage + 1)}> Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Character