import { useState,useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
 
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadStories();
  }, [page]);

  const loadStories = async () => {
    const response = await axios.get(`http://localhost:3000/api/stories/newest?page=${page}&limit=${limit}`);
    setStories(response.data);
    setLoading(false)
  };

  const search = async () => {
    if (searchQuery.trim()) {
      const response = await axios.get(`http://localhost:3000/api/stories/search?query=${searchQuery}`);
      setStories(response.data);
    } else {
      loadStories();
     
    }
  };
 

  return (
    <>
       <div className="container">
      <h1 className='d-flex align-items-center justify-content-center p-3 '>Newest Stories</h1>

      <div className='d-flex justify-content-end' >
        <div className='search-container'>
        <i className="ri-search-eye-line search-icon p-1 mt-1"></i>
        <input className=' round ps-4' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stories..." />
        </div>
      <button className='round-button' onClick={search}>Search</button>
      </div>
      {loading ? (
        <div className='text-black d-flex justify-content-center mt-5'> <h2>Loading...</h2></div>
      ) : (
     <div className='row mt-4 gap-3'>
      {stories.map((story) => (
        <div className='col-lg-4 col-md-4 col-sm-12 card rounded-3' key={story.id}>
          <div className=''>
          <h5>{story.title}</h5>
          {story.url && <a href={story.url} target="_blank" rel="noopener noreferrer">Read more</a>}
          </div>
           
          </div>
        ))}
     </div>
      )}
      <div className="mt-4 d-flex justify-content-end gap-1">
        <button className='btn btn-primary' disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button className='btn btn-primary' onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
    </>
  )
}

export default App
