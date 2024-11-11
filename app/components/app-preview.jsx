import './app-preview.css'
import {
    Link
  } from "@remix-run/react";

export default function AppPreview({ url, srcDoc }) {

    return (
        <div className="app-preview">
            <iframe srcDoc={srcDoc}></iframe>
        </div>
    );
}