import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import { useState, useEffect } from 'react';
import { AppLightbox } from "../components/app-lightbox";

import './app-modal.css'

export function AppSuccess({isOpen, shop, theme, onCancel}) {

  const shopify = useAppBridge();

  const [modalOpen, setModalOpen] = useState(isOpen);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [deeplink, setDeeplink] = useState(theme);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  const handleVideoCancel = () => {
    setShowVideoModal(false);
    setCurrentVideo('')
  }

  function handleVideoClick(video) {
    setShowVideoModal(true);
    setCurrentVideo(video);
    onCancel();
  }

  useEffect(() => {
    setModalOpen(isOpen); 
  }, [isOpen]);

  useEffect(() => {
    if(theme)theme = theme.replace('gid://shopify/OnlineStoreTheme/', '');
    if(shop)shop = shop.replace('.myshopify.com', '');

    setCurrentTheme(theme); 
    setDeeplink(`https://admin.shopify.com/store/${shop}/themes/${theme}/editor`);
    
  }, [theme]);

  // handle publish
  const handleCancel = () => {
    onCancel();
  };
  
  // modal text
  var title = '🎉 Success!'
  var description = 'Your section was successfully created! Lets get your new section up and running. Watch the video below to see how to install your new section on your site.';

  return (
    <>
      <Modal id="success-modal" open={modalOpen}>

        <div class="app-modal-content">
            <p>{description}</p>
            <p><button className="app-image-button" onClick={() => handleVideoClick("https://www.youtube-nocookie.com/embed/SlGaQlS_FcE")}><img src="/images/setup-play-banner.jpg" loading="lazy" /></button></p>
            <p><b>Tip</b> → Use the following deeplink: <a href={deeplink} target="_blank">Go to Shopify Theme Customizer</a></p>
        </div>
        
        <TitleBar title={title}>
        <button onClick={handleCancel}>Done</button>
        </TitleBar>
      </Modal>

      <AppLightbox isOpen={showVideoModal} video={currentVideo} onCancel={handleVideoCancel}></AppLightbox>
    </>
  );
}