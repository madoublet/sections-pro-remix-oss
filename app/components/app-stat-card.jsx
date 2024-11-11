import './app-stat-card.css'

export default function AppStatCard({ title, stat }) {

    return (
        <div className="app-stat-card">
            <h3>{title}</h3>
            <p>{stat}</p>
        </div>
    );
}