import React from 'react'

const Pagination = ({totalItems, itemsPerPage, currentPage, onPageChange}) => {

  const totalPages = Math.ceil(totalItems/itemsPerPage);
  return (
    <div className='flex justify-center items-center gap-2 my-4'>
      <button
       onClick={()=>onPageChange(currentPage-1)}
       disabled={currentPage===1}
       className='px-3 py-1 bg-gray-400 rounded disabled:opacity-50'
      >
       Prev
      </button>

      <span className='text-sm text-gray-700'>
        Page {currentPage} of {totalPages}
      </span>

      <button
       onClick={()=>onPageChange(currentPage+1)}
       disabled={currentPage===totalPages}
       className='px-3 py-1 bg-gray-400 rounded disabled:opacity-50'
      >
       Next
      </button>
    </div>
  )
}

export default Pagination
