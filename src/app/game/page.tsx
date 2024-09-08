'use client'

import { useState } from 'react'
import style from './page.module.css'

const WINNER_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

function calculateWinner(squares: Array<string>) {
    for (let i = 0; i < WINNER_LINES.length; i++) {
        const [a, b, c] = WINNER_LINES[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

function Square({ value, onClick }: { value: string; onClick: () => void }) {
    return (
        <button className={style.square} onClick={onClick}>
            {value}
        </button>
    )
}

export function Board({
    xIsNext,
    squares,
    onPlay,
}: {
    xIsNext: boolean
    squares: Array<string>
    onPlay: (squares: Array<string>) => void
}) {
    function getNextPlayer() {
        return xIsNext ? 'X' : 'O'
    }

    function handleClick(pos: number) {
        if (squares[pos] || calculateWinner(squares)) return
        const nextSquares = squares.slice()
        nextSquares[pos] = getNextPlayer()
        onPlay(nextSquares)
    }

    const winner = calculateWinner(squares)
    let status = winner ? `Winner: ${winner}` : `Next Player ${getNextPlayer()}`

    return (
        <>
            <div className={style.status}>{status}</div>
            <div className={style.board_row}>
                <Square value={squares[0]} onClick={() => handleClick(0)} />
                <Square value={squares[1]} onClick={() => handleClick(1)} />
                <Square value={squares[2]} onClick={() => handleClick(2)} />
            </div>
            <div className={style.board_row}>
                <Square value={squares[3]} onClick={() => handleClick(3)} />
                <Square value={squares[4]} onClick={() => handleClick(4)} />
                <Square value={squares[5]} onClick={() => handleClick(5)} />
            </div>
            <div className={style.board_row}>
                <Square value={squares[6]} onClick={() => handleClick(6)} />
                <Square value={squares[7]} onClick={() => handleClick(7)} />
                <Square value={squares[8]} onClick={() => handleClick(8)} />
            </div>
        </>
    )
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const currentSquares = history[currentMove]
    const xIsNext = currentMove % 2 === 0

    function handlePlay(nextSquares: Array<string>) {
        const newHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(newHistory)
        setCurrentMove(newHistory.length - 1)
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let desc = move > 0
            ? `Go to move #${move}`
            : `Go to game start`
        return (
            <li className={style.game_info} key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    })

    return (
        <div className={style.game}>
            <div className={style.game_board}>
                <Board xIsNext={xIsNext} squares={currentSquares}
                    onPlay={handlePlay} />
            </div>
            <div >
                <ol>{moves}</ol>
            </div>
        </div>
    )
}
