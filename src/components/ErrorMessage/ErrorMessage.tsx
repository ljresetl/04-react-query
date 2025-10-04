import React from 'react'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <p className={styles.text}>
      {message || 'There was an error, please try again...'}
    </p>
  )
}

export default ErrorMessage
