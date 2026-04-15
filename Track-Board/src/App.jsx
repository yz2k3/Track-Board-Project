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

  // editingCard holds the card object the user wants to edit (null = no edit open)
  const [editingCard, setEditingCard] = useState(null)

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

  // editCard receives the updated card and replaces the old one in the list
  function editCard(updatedCard) {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
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
          onEdit={setEditingCard}
        />
      </main>

      {modalOpen && (
        <TaskModal
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onAdd={addCard}
        />
      )}

      {/* EditModal opens when user clicks the edit button on a card */}
      {editingCard && (
        <EditModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={(updatedCard) => {
            editCard(updatedCard)
            setEditingCard(null)
          }}
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

/**
 * EditModal Component
 * -------------------
 * Opens pre-filled with the existing card data.
 * User can change title, description, status, priority, and tag, then click Save.
 */
function EditModal({ card, onClose, onSave }) {
  // Pre-fill every field with the card's current values
  const [tagColor, tagLabel] = (card.tag || 'blue|Task').split('|')

  const [title, setTitle] = useState(card.title)
  const [desc, setDesc] = useState(card.desc)
  const [status, setStatus] = useState(card.status)
  const [priority, setPriority] = useState(card.priority)
  const [tag, setTag] = useState(tagLabel)

  function handleSave() {
    if (!title.trim()) return
    const label = tag.trim() || 'Task'
    const color = pickColor(label)

    // Build the updated card — keep the same id and av so nothing else changes
    onSave({
      ...card,
      title: title.trim(),
      desc: desc.trim(),
      status,
      priority,
      tag: `${color}|${label}`,
    })
  }

  return (
    <div
      className="modal-overlay"

    >
      <div className="modal-box">
        <h3 className="modal-title">Edit Task</h3>

        <div className="modal-field">
          <label className="modal-label">TITLE</label>
          <input
            className="modal-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">DESCRIPTION</label>
          <textarea
            className="modal-input modal-textarea"
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSave()}
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
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="modal-btns">
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-create" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default App