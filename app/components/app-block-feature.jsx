import './app-feature.css'
import {
    Button,
  } from "@shopify/polaris";
  import {
    useNavigate, 
    Link
  } from "@remix-run/react";

export default function AppBlockFeature({ plan }) {

    const navigate = useNavigate();

    function handlePrimaryAction() {
        navigate(`/app/plan/manage`);
    }

    return (
        <div class="app-feature">
            <div>
                <h3>Get Started with Blocks</h3>
                <p>
                Sections Pro blocks use Shopify App Blocks to extend our beautiful UI elements to anywhere on your shop—including the product section!
                </p>
                <p>Sections Pro blocks are only available for premium plans.</p>
                <p style={ {marginTop: '10px'} }>
                {plan == 'free' &&
                    <a style={ {marginRight: '10px'} }><Button onClick={handlePrimaryAction}>Upgrade to Premium</Button></a>
                }
                    <a><Link to="/app/list/premium">Watch our Video</Link></a>
                </p>
            </div>
            <div class="app-feature-graphic">
                <img src="/images/blocks-illustration.webp" loading="lazy" />
            </div>
        </div>
    );
}