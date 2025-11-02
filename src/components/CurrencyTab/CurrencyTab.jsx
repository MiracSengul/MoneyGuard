import React from 'react'
import { useNavigate } from 'react-router-dom'
import css from './CurrencyTab.module.css'
import { FaDollarSign } from 'react-icons/fa'

const CurrencyTab = () => {
    const navigate = useNavigate()
    
    const handleCurrencyClick = () => {
        navigate('/currency')
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCurrencyClick()
        }
    }

    return (
        <div 
            onClick={handleCurrencyClick}
            onKeyDown={handleKeyPress}
            className={css.currencyButton}
            tabIndex={0}
            role="button"
            aria-label="View currency exchange rates"
        >
            <FaDollarSign className={css.currencyIcon} />
        </div>
    )
}

export default CurrencyTab