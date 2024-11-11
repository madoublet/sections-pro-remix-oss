import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  Page,
  MediaCard,
  VideoThumbnail,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useEffect } from 'react';


import { AppLightbox } from "../components/app-lightbox";

import helpStylesHref from "../css/help.css?url";

export const links = () => [
  { rel: "stylesheet", href: helpStylesHref },
];

export const loader = async ({ request, params }) => {
  var title = "Videos & Help";
  
  const { admin, session } = await authenticate.admin(request);

  return json({ title: title, shop: session.shop });
};

export default function PlanRoute() {
  const { title } = useLoaderData();
  
  const shopify = useAppBridge();


  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  const handleVideoCancel = () => {
    setShowVideoModal(false);
    setCurrentVideo('')
  }

  function handleVideoClick(video) {
    setShowVideoModal(true);
    setCurrentVideo(video);
  }
  
  return (
    <Page
      title={title}
    >
      <section className="app-title">
        <p>Need help? Check out our videos and help docs below. You can find more at <a href="https://www.sectionspro.com/" target="_blank">sectionspro.com</a></p>
      </section>

      <MediaCard
      title="Add your First Section with Sections Pro"
      primaryAction={{
        content: 'Watch Video',
        onAction: () => { handleVideoClick("https://www.youtube-nocookie.com/embed/SlGaQlS_FcE") },
      }}
      description={`Learn how to add your first section and configure it to hit the ground running.`}
    >
      <VideoThumbnail
        videoLength={80}
        thumbnailUrl="/images/setup-play-banner.jpg"
        onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/SlGaQlS_FcE")}
      />
    </MediaCard>

      <div className="app-grid">

        <div className="app-card">
          <h5>Videos</h5>
          <p>
          <ul>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/SlGaQlS_FcE")}>Add your First Section with Sections Pro</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/p6qGkTlfwD4")}>Get Started with the Premium Tabs Section</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/pIO-0Wp4hCo")}>Walkthrough of the Accordion Feature section</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/rwMSmt5UJrY")}>Add animations using the Animate section</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/8QTExjWBrTI")}>Add a Fixed Sales Bar with Sections Pro</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/5GwOwlsJbec")}>Getting started with Columns Premium</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/AIfXdK_5c2w")}>Getting started with Hero Premium</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/pzgiqpz4d38")}>Getting started with the Slideshow Text section</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/6-B6kRaAwNQ")}>Getting started with the Video Modal section</button></li>
              <li><button onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/RkYH3KuauDE")}>Getting started with the Slideshow Premium section</button></li>
            </ul>
          </p>
        </div>

        <div className="app-card">
          <h5>Help Docs</h5>
          <p>
            <ul>
              <li><a href="https://www.sectionspro.com/docs/upgrading-theme/" target="_blank">Upgrading your Shopify Theme</a></li>
              <li><a href="https://www.sectionspro.com/docs/installing-section/" target="_blank">Installing your First Section</a></li>
              <li><a href="https://www.sectionspro.com/docs/removing-section/" target="_blank">Removing a Section</a></li>
              <li><a href="https://www.sectionspro.com/docs/customizing-section/" target="_blank">Customizing your Section</a></li>
              <li><a href="https://www.sectionspro.com/docs/adjusting-headline-size-for-mobile/" target="_blank">Adjusting Heading Size for Desktop and Mobile</a></li>
              <li><a href="https://www.sectionspro.com/docs/enabling-recaptcha/" target="_blank">Enabling reCAPTCHA for Shopify Forms</a></li>
              <li><a href="https://www.sectionspro.com/docs/full-width-sections/" target="_blank">Making your Sections Full Width</a></li>
            </ul>
          </p>
        </div>

      </div>

      <section className="app-title">
        <p>Email <a href="mailto:matt@matthewsmith.com">matt@matthewsmith.com</a> for any questions.</p>
      </section>

      <AppLightbox isOpen={showVideoModal} video={currentVideo} onCancel={handleVideoCancel}></AppLightbox>

    </Page>
  );
}
