import React, { useRef } from 'react'
import styles from './SearchBar.module.css'
import toast from 'react-hot-toast'

interface SearchBarProps {
  onSubmit: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form
          ref={formRef}
          className={styles.form}
          action={async (formData: FormData) => {
            const query = (formData.get('query') as string | null)?.trim() ?? ''

            if (!query) {
              toast.error('Please enter your search query.')
              return
            }

            onSubmit(query)

            // Очищення інпуту після сабміту
            formRef.current?.reset()
          }}
        >
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  )
}

export default SearchBar
