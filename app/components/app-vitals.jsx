import './app-vitals.css'
import {useAppBridge} from '@shopify/app-bridge-react';
import { useEffect, useState } from 'react';

export default function AppVitals({ }) {

    const shopify = useAppBridge();

    const [lcp, setLcp] = useState('--');
    const [fid, setFid] = useState('--');
    const [cls, setCls] = useState('--');
    const [inp, setInp] = useState('--');

    useEffect(() => {
        // Define the callback function
        const callback = async (data) => {
            const monitorUrl = 'https://yourserver.com/web-vitals-metrics';
            
            console.log('metrics', data.metrics);
            
            if(data.metrics) {
                for (var x=0; x<data.metrics.length; x++) {
                    var metric = data.metrics[x];

                    if(metric.name == "LCP") {
                        setLcp(metric.value.toFixed(2).toString());
                    }

                    if(metric.name == "CLS") {
                        setCls(metric.value.toFixed(2).toString());
                    }

                    if(metric.name == "FID") {
                        setFid(metric.value.toFixed(2).toString());
                    }

                    if(metric.name == "INP") {
                        setInp(metric.value.toFixed(2).toString());
                    }
                }
            }
        };

        // Register the callback
        shopify.webVitals.onReport(callback);
      }, []);
    
    

    return (
        <div className="app-vitals">
            <span>LCP: {lcp}</span>
            <span>FID: {fid}</span> 
            <span>CLS: {cls}</span> 
            <span>INP: {inp}</span></div>
    );
}