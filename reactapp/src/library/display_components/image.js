import React from 'react';

export default function Image(props) {
    return (
        <img
            className={props.className}
            style={{ ...props.style, ...props.css }}
            src={props.src}
            onClick={props.onClick}
            onLoad={props.onLoad}
            alt={props.alt || 'image'}
        />
    );
}
