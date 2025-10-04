import React from 'react'
import styles from './MovieGrid.module.css'
import type { Movie } from '../../types/movie'

interface MovieGridProps {
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (!movies || movies.length === 0) return null

  return (
    <ul className={styles.grid}>
      {movies.map(movie => (
        <li key={movie.id}>
          <div className={styles.card}>
            <img
              className={styles.image}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
              onClick={() => onSelect(movie)}
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MovieGrid
