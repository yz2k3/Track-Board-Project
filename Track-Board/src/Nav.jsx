import './nav.css'

/**
 * Nav Component
 * -------------
 * Renders the top navigation bar of the application.
 * 
 * Props:
 * - todoCnt {number}: Number of tasks currently in the "To Do" column.
 * - doingCnt {number}: Number of tasks currently in the "Doing" column.
 * - doneCnt {number}: Number of tasks currently in the "Done" column.
 * - onNewTask {function}: Callback function triggered when the "+ New Task" button is clicked.
 */
function Nav({ todoCnt, doingCnt, doneCnt, onNewTask }) {
    return (
        <div className="app-navbar-wrapper">
            <nav className="app-navbar">
                {/* Application Branding / Logo Area */}
                <div className="app-brand">Track Board</div>

                <div className="app-navbar-actions">
                    {/* Status indicator for 'To Do' tasks */}
                    <div className="status-pill" aria-label="To Do count">
                        <span className="status-dot to-do-count" />
                        <span className="status-count">{todoCnt}</span>
                    </div>

                    {/* Status indicator for 'Doing' tasks */}
                    <div className="status-pill" aria-label="Doing count">
                        <span className="status-dot doing-count" />
                        <span className="status-count">{doingCnt}</span>
                    </div>

                    {/* Status indicator for 'Done' tasks */}
                    <div className="status-pill" aria-label="Done count">
                        <span className="status-dot done-count" />
                        <span className="status-count">{doneCnt}</span>
                    </div>

                    {/* Button to open the new task modal */}
                    <button className="new-task-button" onClick={onNewTask}>+ New Task</button>
                </div>
            </nav>
        </div>
    )
}

export default Nav
