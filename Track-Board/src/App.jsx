import { useState, useEffect } from 'react'

import './App.css'
import Nav from './Nav.jsx'
import Board from './Board.jsx'

function App() {

  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem('trackboard-cards')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('trackboard-cards', JSON.stringify(cards))
  }, [cards])
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState('todo')

  const countFor = (status) => cards.filter((c) => c.status === status).length

  function openModal(status = 'todo') {
    setDefaultStatus(status)
    setModalOpen(true)
  }
  function addCard(card) {
    setCards((prev) => [...prev, { ...card, id: Date.now() }])
  }

  function deleteCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  function moveCard(id, newStatus) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
  }


  return (
    <div className="app-background">
      <Nav
        todoCnt={countFor('todo')}
        doingCnt={countFor('doing')}
        doneCnt={countFor('done')}
        onNewTask={() => openModal()}
      />

      <main className="app-content">
        <Board
          cards={cards}
          onOpenModal={openModal}
          onDelete={deleteCard}
          onMove={moveCard}
        />
      </main>

      {modalOpen && (
        <TaskModal
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onAdd={addCard}
        />
      )}
    </div>
  )
}
const TAG_COLORS = ['blue', 'amber', 'green', 'purple', 'pink']
function pickColor(label) {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  return TAG_COLORS[hash % TAG_COLORS.length]
}
function TaskModal({ defaultStatus, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState(defaultStatus)
  const [priority, setPriority] = useState('high')
  const [tagLabel, setTagLabel] = useState('')

  function handleCreate() {
    if (!title.trim()) return
    const label = tagLabel.trim() || 'Task'
    const color = pickColor(label)
    onAdd({
      title: title.trim(),
      desc: desc.trim(),
      status,
      priority,
      tag: `${color}|${label}`,
      av: Math.floor(Math.random() * 5),
    })
    onClose()
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <h3 className="modal-title">New Task</h3>

        <div className="modal-field">
          <label className="modal-label">TITLE</label>
          <input
            className="modal-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">DESCRIPTION</label>
          <textarea
            className="modal-input modal-textarea"
            rows={2}
            placeholder="Optional details..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">STATUS</label>
            <select className="modal-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">PRIORITY</label>
            <select className="modal-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="mid">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">TAG</label>
          <input
            className="modal-input"
            type="text"
            placeholder="e.g. Design, Bug Fix, Sprint 3…"
            value={tagLabel}
            onChange={(e) => setTagLabel(e.target.value)}
          />
        </div>

        <div className="modal-btns">
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-create" onClick={handleCreate}>Create Task</button>
        </div>
      </div>
    </div>
  )
}

export default App