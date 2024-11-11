import './app-card.css'
import {
    Link
  } from "@remix-run/react";

export default function AppCard({ id, title, description, url, svg, plan, price, savedShop }) {

    // set default tag
    let tag = 'free';
    if(plan == 'premium') tag = price;

    if(plan == 'premium') {
        // check for sub and purchased
        if(savedShop) {
            if(savedShop.plan) {
                if(savedShop.plan.includes('premium')) tag = `Subscribed`;
            }

            if(savedShop.sections.includes(id)) tag = `Purchased`;
        }
    }

    let desc = description || "";

    if(desc.length > 75) {
        desc = desc.substring(0, 75) + '...';
    }

    return (
        <Link to={url} className="app-card">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
            <div className="app-card-content">
                <h5>{title}</h5>
                <p title={description}>{desc}</p>
                <span class="app-card-tag">{tag}</span>
            </div>
        </Link>
    );
}