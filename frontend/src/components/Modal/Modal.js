import React from 'react';

import "./Modal.css";

const Modal = (props) => (
    <div className="modal">
        <header className="modal__header">
            <h1>{props.title}</h1>
        </header>
        <section className="modal__content">
            {props.children}
        </section>
        <footer className="modal__actions">
            <button className="btn" onClick={props.handleModalClose}>Close</button>
        </footer>
    </div>
);
export default Modal;