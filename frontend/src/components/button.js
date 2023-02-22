import React, { useState } from 'react';
import './button.css';

export const Button = ({ text, onClick: event }) => {
    return (
        <div>
            <button className="button-31" role="button" onClick={event}>{text}</button>
        </div>
    )
}