import './Line.css'

const Line = ({ code, newKey }) => {
    return (
        <div id={code} key={newKey} className={(code === "line-0" || code === 'line-A' || code === "line-B") ? "animateLine vertical-line item" : "vertical-line item min-height"}></div>
    )
}

export default Line;