import * as React from 'react'
import './UserSearchGrid.css'
import {useAuthNavContext} from '../../Contexts/authNav'
import ReactPaginate from 'react-paginate'
import UserSearchCard from '../UserSearchCard/UserSearchCard'
import Loading from '../Loading/Loading'

export default function UserSearchGrid({usersList, pageIsLoading}) {

    //get searchWord from the authNavContext
    const {searchWord, transition, setTransition} = useAuthNavContext()

  //Number of items per page
  const itemsPerPage = 4;

  const [currentItems, setCurrentItems] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);


    // useEffect for the pagination feature
  React.useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(usersList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(usersList.length / itemsPerPage));
    // window.scrollTo({top: 0});
    setTransition(transition+1)
  }, [itemOffset, itemsPerPage,usersList]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % usersList.length;
    setItemOffset(newOffset);

    setTransition(transition+1)

    // function to scroll to the top of the page
    const scrollToTop = () => {
      window.scrollTo({top: 0, behavior: 'auto'});
    }

    scrollToTop()
  };
  
  const [selected, setSelected] = React.useState("none")
   
  return (
    <div className='results-container'>

        {pageIsLoading
        ?
        <Loading />
        :
        usersList.length === 0
        ? 
          <div className="no-result">
            <h3> Couldn't Find Any User Matching <br /> <p>{`${searchWord}`}?</p></h3>
          </div> 
        :
          <></>
        }
        <div className="results-grid">
            {currentItems.map((people, idx) => {
                return(
                    <UserSearchCard even={(idx+1+transition)  % 2 === 0} people={people} key={idx}/>
                )
            })}

            {/* pagination component in react */}
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="< prev"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageClassName='page-number'
              previousLinkClassName='page-next'
              nextLinkClassName='page-next'
              activeLinkClassName='page-current'
              activeClassName='page-current-border'
            />
        </div>
    </div>
  )
}

