import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './MovieModal.module.css'
import type { Movie } from '../../types/movie'

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // забороняємо скрол тіла

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow // відновлюємо скрол
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const content = (
    <div className={styles.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} aria-label="Close modal" type="button" onClick={onClose}>
          &times;
        </button>

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className={styles.image}
        />

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>
  )

  const modalRoot = document.getElementById('modal-root')
  return modalRoot ? createPortal(content, modalRoot) : null
}

export default MovieModal
