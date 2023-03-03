import React from 'react';
import './button.css';

export const Button = ({ text, onClick: event }) => {
    return (
        <div>
            <button className="button-31" onClick={event}>{text}</button>
        </div>
    )
}