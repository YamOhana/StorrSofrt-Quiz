import React from 'react';
import styles from './Notification.module.css';
import PropTypes from 'prop-types';

function Notification({show, gameOver}) {

    return (
        show &&
        <div className={styles.root}>
            {gameOver ? <p>GAME OVER</p> : null}
            PUSH START BUTTON
        </div>
    );
}

Notification.propTypes = {
    show: PropTypes.bool.isRequired,
    gameOver: PropTypes.bool.isRequired
};

export default Notification;
