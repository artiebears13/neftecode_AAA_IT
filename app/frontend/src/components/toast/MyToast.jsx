import React from 'react';
import { Toast } from 'react-bootstrap';

const MyToast = ({ message, show, hideToggle, variant }) => {


    return (
        <div
            style={{
                position: 'fixed',
                top: '50px', // Adjust this value according to your layout
                left: '50%', // Center the toast horizontally
                transform: 'translateX(-50%)',
                zIndex: 9999,
            }}
        >

                    <Toast onClose={() => hideToggle} show={show} delay={3000} autohide bg={variant}>

                        <Toast.Body>{message}</Toast.Body>
                        <button className="btn" style={{position: 'absolute', top: "1%", right: "1%", backgroundColor: 'transparent'}} onClick={hideToggle}>x</button>
                    </Toast>

        </div>
    );
};

export default MyToast;
