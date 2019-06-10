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
            {props.canCancel && <button className="btn" onClick={props.handleModalCancel}>Cancel</button>}
            {props.canEditCancel && <button className="btn" onClick={props.handleEditModalCancel}>Cancel</button>}
            {props.canConfirm && <button className="btn" onClick={props.handleModalConfirm}>{props.buttonText}</button>}
            {props.canEditConfirm && <button className="btn" onClick={props.handleEditModalConfirm}>{props.buttonText}</button>}
        </footer>
    </div>
);
export default Modal;