export const StageIndicator = ({ stage, ...props }) => {
    return (
        <ul className="stage-indicator" {...props}>
            <li className={stage === 'work' ? 'active' : ''}>Работа</li>
            <li className={stage === 'rest' ? 'active' : ''}>Отдых</li>
        </ul>
    )
} 