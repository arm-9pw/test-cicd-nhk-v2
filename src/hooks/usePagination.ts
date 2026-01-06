type UsePaginationProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSizePerPage: React.Dispatch<React.SetStateAction<number>>
}

const usePagination = ({ setPage, setSizePerPage }: UsePaginationProps) => {
  const handleNextPage = () => {
    setPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    setPage((prev) => prev - 1)
  }

  const handleSizeChange = (newSize: number) => {
    setSizePerPage(newSize)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return {
    handleNextPage,
    handlePrevPage,
    handleSizeChange,
    handlePageChange,
  }
}

export default usePagination
