import { useState } from 'react'
import './board.css'

/**
 * Predefined background styles for the user avatars
 */
const AVATAR_COLORS = [
    { bg: 'rgba(91,108,243,0.2)', color: '#8b9dff' },
    { bg: 'rgba(251,191,36,0.2)', color: '#fcd34d' },
    { bg: 'rgba(52,211,153,0.2)', color: '#6ee7b7' },
    { bg: 'rgba(167,139,250,0.2)', color: '#c4b5fd' },
    { bg: 'rgba(251,113,133,0.2)', color: '#fda4af' },
]

/**
 * Mock user initials mapping
 */
const INITIALS = ['AK', 'SL', 'MR', 'JD', 'TN']

/**
 * Map internal priority values to user-friendly labels
 */
const PRIORITY_LABEL = { high: 'High', mid: 'Medium', low: 'Low' }

/**
 * Define the structure of the Kanban board
 * Each column has an internal `id` matching task statuses.
 */
const COLUMNS = [
    { id: 'todo', label: 'TO DO', dotClass: 'board-label-dot--todo' },
    { id: 'doing', label: 'DOING', dotClass: 'board-label-dot--doing' },
    { id: 'done', label: 'DONE', dotClass: 'board-label-dot--done' },
]

/**
 * Board Component
 * ---------------
 * Renders the columns and manages Drag-and-Drop state.
 */
function Board({ cards, onOpenModal, onDelete, onMove }) {
    // `draggingId` keeps track of the task currently being dragged
    const [draggingId, setDraggingId] = useState(null)

    // `dragOverCol` keeps track of which column is hovered to highlight it
    const [dragOverCol, setDragOverCol] = useState(null)

    return (
        <section className="board-grid">
            {COLUMNS.map((col) => {
                const colCards = cards.filter((c) => c.status === col.id)
                return (
                    <article
                        key={col.id}
                        className={`board-column board-${col.id} ${dragOverCol === col.id ? 'board-column--dragover' : ''}`}

                        /* Native HTML5 Drag & Drop handlers */
                        onDragOver={(e) => {
                            e.preventDefault(); // Must prevent default to allow drop
                            setDragOverCol(col.id)
                        }}
                        onDragLeave={() => setDragOverCol(null)}
                        onDrop={(e) => {
                            e.preventDefault()
                            setDragOverCol(null)

                            // Only move if we are actively dragging a card
                            if (draggingId !== null) onMove(draggingId, col.id)
                            setDraggingId(null)
                        }}
                    >
                        {/* Column Title and Indicator */}
                        <header className="board-header">
                            <span className="board-label">{col.label}</span>
                            <span className={`board-label-dot ${col.dotClass}`} />
                        </header>

                        <div className="board-cards-list">
                            {colCards.length === 0 ? (
                                <div className="board-empty">
                                    <span className="board-empty-icon">+</span>
                                    <p>No tasks yet</p>
                                </div>
                            ) : (
                                colCards.map((card) => (
                                    <TaskCard
                                        key={card.id}
                                        card={card}
                                        colId={col.id}
                                        onDelete={onDelete}
                                        onDragStart={setDraggingId}
                                    />
                                ))
                            )}
                        </div>

                        <button
                            className="board-add-button"
                            onClick={() => onOpenModal(col.id)}
                        >
                            + Add task
                        </button>
                    </article>
                )
            })}
        </section>
    )
}

/**
 * TaskCard Component
 * ------------------
 * A draggable card representing an individual task.
 */
function TaskCard({ card, colId, onDelete, onDragStart }) {
    // Visual flag when card is being dragged
    const [dragging, setDragging] = useState(false)

    // Use modulo to randomly assign an avatar based on the task `av` prop
    const av = AVATAR_COLORS[card.av % 5]
    const ini = INITIALS[card.av % 5]

    // Tag is formatted as "color|label"
    const [tagColor, tagLabel] = (card.tag || 'blue|Task').split('|')

    return (
        <div
            className={`task-card task-card--${colId} ${dragging ? 'task-card--dragging' : ''}`}
            draggable
            onDragStart={() => {
                setDragging(true);
                onDragStart(card.id) // Pass dragged ID to parent Board component
            }}
            onDragEnd={() => setDragging(false)}
        >
            <div className="task-card-top">
                <span className="task-card-title">{card.title}</span>
                <button className="task-card-del" onClick={() => onDelete(card.id)}>×</button>
            </div>

            {card.desc && <p className="task-card-desc">{card.desc}</p>}

            <div className="task-card-footer">
                <span className={`task-tag task-tag--${tagColor}`}>{tagLabel}</span>
                <div className="task-card-meta">
                    <span className="task-priority">
                        <span className={`task-priority-dot task-priority-dot--${card.priority}`} />
                        {PRIORITY_LABEL[card.priority]}
                    </span>
                    <div
                        className="task-avatar"
                        style={{ background: av.bg, color: av.color }}
                    >
                        {ini}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Board
