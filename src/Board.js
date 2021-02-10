import React, { useEffect, useRef, useState } from "react";
import styles from "./Board.module.css";
import PropTypes from "prop-types";
import logoImage from "./logo.svg";
import lollipopLogo from "./images/lollipop.svg";
import iceCreamLogo from "./images/ice_cream.svg";

function Board({
    maze,
    currentCell,
    lollipopState,
    handleGetLollipop,
    hasGotLollipop,
    time,
    iceCreamState,
    handleGetIceCream,
    hasGotIceCream,
}) {
    const canvas = useRef(null);
    const prevCell = useRef(currentCell);
    const container = useRef(null);
    const [ctx, setCtx] = useState(undefined);

    const [randomCellLollipop, setRandomCellLollipop] = useState(null);
    const [randomCellIceCream, setRandomCellIceCream] = useState(null);

    if (!randomCellLollipop) {
        setRandomCellLollipop(chooseRandomCell());
        setRandomCellIceCream(chooseRandomCell());
    }
    avoidLolliCreamCross();

    checkIfLollipopInLastOrFirstCell();

    checkIfIceCreamInFirstOrLastCell();

    if (prevCell.current !== currentCell) {
        if (lollipopState) {
            handleGetLollipop(randomCellLollipop);
        }
        if (iceCreamState) {
            handleGetIceCream(randomCellIceCream);
        }
    }

    useEffect(() => {
        const fitToContainer = () => {
            const { offsetWidth, offsetHeight } = container.current;
            canvas.current.width = offsetWidth;
            canvas.current.height = offsetHeight;
            canvas.current.style.width = offsetWidth + "px";
            canvas.current.style.height = offsetHeight + "px";
        };

        setCtx(canvas.current.getContext("2d"));
        setTimeout(fitToContainer, 0);
    }, []);

    useEffect(() => {
        const drawLine = (x1, y1, width, height) => {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + width, y1 + height);
            ctx.stroke();
        };

        const draw = () => {
            if (!maze) {
                return;
            }

            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

            const blockWidth = Math.floor(canvas.current.width / maze.cols);
            const blockHeight = Math.floor(canvas.current.height / maze.rows);
            const xOffset = Math.floor(
                (canvas.current.width - maze.cols * blockWidth) / 2
            );

            for (let y = 0; y < maze.rows; y++) {
                for (let x = 0; x < maze.cols; x++) {
                    const cell = maze.cells[x + y * maze.cols];
                    if (y === 0 && cell[0]) {
                        drawLine(blockWidth * x + xOffset, blockHeight * y, blockWidth, 0);
                    }
                    if (cell[1]) {
                        drawLine(
                            blockWidth * (x + 1) + xOffset,
                            blockHeight * y,
                            0,
                            blockHeight
                        );
                    }
                    if (cell[2]) {
                        drawLine(
                            blockWidth * x + xOffset,
                            blockHeight * (y + 1),
                            blockWidth,
                            0
                        );
                    }
                    if (x === 0 && cell[3]) {
                        drawLine(blockWidth * x + xOffset, blockHeight * y, 0, blockHeight);
                    }
                }
            }

            const logoSize = 0.75 * Math.min(blockWidth, blockHeight);
            const image = new Image(logoSize, logoSize);
            image.onload = () => {
                ctx.drawImage(
                    image,
                    currentCell[0] * blockWidth + xOffset + (blockWidth - logoSize) / 2,
                    currentCell[1] * blockHeight + (blockHeight - logoSize) / 2,
                    logoSize,
                    logoSize
                );
            };
            image.src = logoImage;

            if (lollipopState) {
                const lollipopImage = new Image(logoSize, logoSize);
                lollipopImage.onload = () => {
                    ctx.drawImage(
                        lollipopImage,
                        randomCellLollipop[0] * blockWidth +
                        xOffset +
                        (blockWidth - logoSize) / 2,
                        randomCellLollipop[1] * blockHeight + (blockHeight - logoSize) / 2,
                        logoSize,
                        logoSize
                    );
                };
                lollipopImage.src = lollipopLogo;
            }
            if (hasGotLollipop) {
                const textSize = Math.min(blockWidth, blockHeight);
                ctx.font = '20px "Joystix"';
                ctx.fillStyle = "blue";
                ctx.textBaseline = "top";
                ctx.fillText(
                    "+5000",
                    randomCellLollipop[0] * blockWidth +
                    xOffset +
                    (blockWidth - textSize) / 2,
                    randomCellLollipop[1] * blockHeight + (blockHeight - textSize) / 2,
                    textSize
                );
            }

            if (iceCreamState) {
                const iceCreamImage = new Image(logoSize, logoSize);
                iceCreamImage.onload = () => {
                    ctx.drawImage(
                        iceCreamImage,
                        randomCellIceCream[0] * blockWidth +
                        xOffset +
                        (blockWidth - logoSize) / 2,
                        randomCellIceCream[1] * blockHeight + (blockHeight - logoSize) / 2,
                        logoSize,
                        logoSize
                    );
                };
                iceCreamImage.src = iceCreamLogo;
            }
            if (hasGotIceCream) {
                const textSize = Math.min(blockWidth, blockHeight);
                ctx.font = '20px "Joystix"';
                ctx.fillStyle = "red";
                ctx.textBaseline = "top";
                ctx.fillText(
                    "+10000",
                    randomCellIceCream[0] * blockWidth +
                    xOffset +
                    (blockWidth - textSize) / 2,
                    randomCellIceCream[1] * blockHeight + (blockHeight - textSize) / 2,
                    textSize
                );
            }

            if (time % 2 === 0) {
                const textSize = Math.min(blockWidth, blockHeight);
                ctx.fillStyle = "red";
                ctx.font = '20px "Joystix"';
                ctx.textBaseline = "top";
                ctx.fillText(
                    "Goal",
                    maze.endCell[1] * blockWidth + xOffset + (blockWidth - textSize) / 2,
                    maze.endCell[0] * blockHeight + (blockHeight - textSize) / 2,
                    textSize
                );
            }
        };

        prevCell.current = currentCell;
        draw();
    }, [
        ctx,
        currentCell,
        maze,
        time,
        hasGotLollipop,
        lollipopState,
        randomCellLollipop,
        hasGotIceCream,
        iceCreamState,
        randomCellIceCream,
    ]);

    return (
        <div className={styles.root} ref={container}>
            <canvas ref={canvas} />
        </div>
    );

    function chooseRandomCell() {
        const cell = [
            Math.floor(Math.random() * 32) + 1,
            Math.floor(Math.random() * 16) + 1,
        ];
        return cell;
    }

    function avoidLolliCreamCross() {
        if (randomCellLollipop) {
            if (
                randomCellLollipop[0] === randomCellIceCream[0] &&
                randomCellLollipop[1] === randomCellIceCream[1]
            ) {
                setRandomCellIceCream(chooseRandomCell());
            }
        }
    }

    function checkIfLollipopInLastOrFirstCell() {
        if (
            (maze &&
                maze.startCell[0] === randomCellLollipop[0] &&
                maze.startCell[1] === randomCellLollipop[1]) ||
            (maze &&
                maze.endCell[0] === randomCellLollipop[1] &&
                maze.endCell[1] === randomCellLollipop[0])
        ) {
            setRandomCellLollipop(chooseRandomCell());
        }
    }

    function checkIfIceCreamInFirstOrLastCell() {
        if (
            (maze &&
                maze.startCell[0] === randomCellIceCream[0] &&
                maze.startCell[1] === randomCellIceCream[1]) ||
            (maze &&
                maze.endCell[0] === randomCellIceCream[1] &&
                maze.endCell[1] === randomCellIceCream[0])
        ) {
            setRandomCellIceCream(chooseRandomCell());
        }
    }
}

Board.propTypes = {
    maze: PropTypes.shape({
        cols: PropTypes.number.isRequired,
        rows: PropTypes.number.isRequired,
        cells: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
        currentCell: PropTypes.arrayOf(PropTypes.number),
    }),
};

export default Board;