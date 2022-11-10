import React, { useCallback, useState } from 'react';
import { IPaginationProps } from './types';
import './style.css';

const Pagination: React.FC<IPaginationProps> = ({ pages, onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    onChange(page);
  };

  const decreasePage = useCallback(() => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    onChange(prevPage);
  }, [currentPage, onChange]);

  const increasePage = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    onChange(nextPage);
  }, [currentPage, onChange]);

  if (pages < 1) return null;

  return (
    <div className='pagination__container'>
      <button
        className='pagination__index'
        onClick={decreasePage}
        disabled={currentPage === 1}
      >
        <i className='bi bi-chevron-left'></i>
      </button>
      {Array.from(Array(pages)).map((_, index) => (
        <button
          className={`pagination__index ${
            index + 1 === currentPage ? 'pagination__index-active' : ''
          }`}
          key={index + 1}
          onClick={() => handleChangePage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className='pagination__index'
        onClick={increasePage}
        disabled={currentPage === pages}
      >
        <i className='bi bi-chevron-right'></i>
      </button>
    </div>
  );
};

export default Pagination;
