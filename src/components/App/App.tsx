import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie, MovieResponse } from '../../types/movie'
import { fetchMovies } from '../../services/movieService'
import toast, { Toaster } from 'react-hot-toast'
import css from './App.module.css'

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [prevData, setPrevData] = useState<MovieResponse>()

  const { data, isLoading, isError, isFetching } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: prevData,
  })

  // Зберігаємо останні отримані дані для плавного переходу
  useEffect(() => {
    if (data) {
      setPrevData(data)
    }
  }, [data])

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error('Please enter a search query.')
      return
    }

    setQuery(newQuery)
    setPage(1)
  }

  // Коли дані оновилися і немає результатів
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.')
    }
  }, [data])

  const handleSelect = (movie: Movie) => setSelectedMovie(movie)
  const handleCloseModal = () => setSelectedMovie(null)

  const totalPages = data?.total_pages || 0

  return (
    <div className={css.app}>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />

      {/* Пагінація зверху */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {(isLoading && !data) ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <>
          <MovieGrid movies={data?.results || []} onSelect={handleSelect} />

          {isFetching && !isLoading && (
            <p style={{ textAlign: 'center', color: '#555' }}>Updating...</p>
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
