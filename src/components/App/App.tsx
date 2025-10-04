import React, { useState, useEffect } from 'react' 
// Імпортуємо React та хуки useState і useEffect

import { useQuery } from '@tanstack/react-query' 
// Імпортуємо хук useQuery для запитів до бекенду з React Query

import ReactPaginate from 'react-paginate' 
// Імпортуємо компонент пагінації

import SearchBar from '../SearchBar/SearchBar' 
// Імпорт компонента рядка пошуку

import MovieGrid from '../MovieGrid/MovieGrid' 
// Імпорт компонента для відображення сітки фільмів

import Loader from '../Loader/Loader' 
// Імпорт спінера/завантажувача

import ErrorMessage from '../ErrorMessage/ErrorMessage' 
// Імпорт компонента для відображення помилок

import MovieModal from '../MovieModal/MovieModal' 
// Імпорт модального вікна для перегляду деталей фільму

import type { Movie, MovieResponse } from '../../types/movie' 
// Імпорт типів для TypeScript

import { fetchMovies } from '../../services/movieService' 
// Імпорт сервісу для отримання фільмів з TMDB

import toast, { Toaster } from 'react-hot-toast' 
// Імпорт бібліотеки для спливаючих повідомлень

import css from './App.module.css' 
// Імпорт модульних стилів для цього компонента

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('') 
  // Стан для збереження тексту пошуку

  const [page, setPage] = useState<number>(1) 
  // Стан для поточної сторінки пагінації

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null) 
  // Стан для збереження обраного фільму (для модального вікна)

  const [prevData, setPrevData] = useState<MovieResponse>() 
  // Стан для збереження попередніх даних (щоб плавно оновлювати UI при зміні сторінки)

  const { data, isLoading, isError, isFetching, refetch } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', query, page], 
    // Унікальний ключ запиту, залежить від тексту пошуку і сторінки

    queryFn: () => fetchMovies(query, page), 
    // Функція, яка виконує запит до TMDB

    enabled: !!query, 
    // Виконуємо запит лише якщо рядок пошуку не порожній

    placeholderData: prevData, 
    // Використовуємо останні отримані дані як тимчасові (щоб UI не пустував під час refetch)
  })

  // Зберігаємо останні отримані дані для плавного переходу
  useEffect(() => {
    if (data) {
      setPrevData(data)
    }
  }, [data])

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery) 
    // Оновлюємо стан запиту

    setPage(1) 
    // При новому пошуку завжди повертаємося на першу сторінку

    if (!newQuery.trim()) { 
      // Якщо рядок порожній, показуємо toast
      toast.error('Please enter a search query.')
      return
    }

    try {
      const res = await refetch() 
      // Виконуємо запит вручну після submit

      if (!res.data || res.data.results.length === 0) {
        // Якщо результатів немає, показуємо toast
        toast.error('No movies found for your request.')
      }
    } catch {
      // При будь-якій помилці показуємо toast
      toast.error('There was an error, please try again...')
    }
  }

  const handleSelect = (movie: Movie) => setSelectedMovie(movie) 
  // Функція для відкриття модального вікна з обраним фільмом

  const handleCloseModal = () => setSelectedMovie(null) 
  // Функція для закриття модального вікна

  const totalPages = data?.total_pages || 0 
  // Загальна кількість сторінок для пагінації

  return (
    <div className={css.app}>
      <Toaster /> 
      {/* Компонент для показу toast повідомлень */}

      <SearchBar onSubmit={handleSearch} /> 
      {/* Компонент рядка пошуку */}

      {/* Пагінація зверху */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages} 
          // Кількість сторінок

          pageRangeDisplayed={5} 
          // Скільки сторінок показати посередині

          marginPagesDisplayed={1} 
          // Скільки сторінок показати з країв

          onPageChange={({ selected }) => setPage(selected + 1)} 
          // Обробник зміни сторінки

          forcePage={page - 1} 
          // Встановлюємо активну сторінку

          containerClassName={css.pagination} 
          // CSS клас контейнера

          activeClassName={css.active} 
          // CSS клас активної сторінки

          nextLabel="→" 
          // Лейбл наступної сторінки

          previousLabel="←" 
          // Лейбл попередньої сторінки
        />
      )}

      {(isLoading && !data) ? (
        <Loader /> 
        // Показуємо лоадер якщо дані ще не отримані
      ) : isError ? (
        <ErrorMessage /> 
        // Показуємо повідомлення про помилку
      ) : (
        <>
          <MovieGrid movies={data?.results || []} onSelect={handleSelect} /> 
          {/* Сітка фільмів */}

          {isFetching && !isLoading && (
            <p style={{ textAlign: 'center', color: '#555' }}>Updating...</p> 
            // Показуємо під час refetch, якщо не завантажуємо повністю
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} /> 
        // Модальне вікно з деталями фільму
      )}
    </div>
  )
}

export default App
