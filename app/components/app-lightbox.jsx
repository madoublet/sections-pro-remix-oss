import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import { useState, useCallback, useEffect } from 'react';

import './app-lightbox.css'

export function AppLightbox({isOpen, video, onCancel}) {

  const shopify = useAppBridge();

  const [modalOpen, setModalOpen] = useState(isOpen);
  const [currentVideo, setCurrentVideo] = useState(video);

  useEffect(() => {
    setModalOpen(isOpen); 
  }, [isOpen]);

  useEffect(() => {
    setCurrentVideo(video); 
  }, [video]);

  // handle publish
  const handleCancel = () => {
    onCancel();
  };
  
  return (
    <>
      <section id="lightbox" class="app-lightbox" open={modalOpen}>
        <a class="app-lightbox-close" onClick={handleCancel}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g></svg>
            </a>
        <div class="app-lightbox-container">
        
          <form>

            <div id="app-lightbox-video" class="app-lightbox-video">
              <div class="app-lightbox-iframe-wrapper">
                  <iframe src={video} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
        
          </form>
          
        </div>
        </section>
    </>
  );
}