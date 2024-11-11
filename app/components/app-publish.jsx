import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import {
    TextField,
    Select
  } from "@shopify/polaris";
import { useState, useCallback, useEffect } from 'react';
import {
  useNavigation,
} from "@remix-run/react";

import './app-modal.css'


export function AppPublish({isOpen, status, themes, sectionName, onPublish, onCancel}) {

  const shopify = useAppBridge();

  const [modalOpen, setModalOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setModalOpen(isOpen); 
    setIsLoading(false);
  }, [isOpen]);


  // modal text
  var title = 'Publish Demo'
  var description = '👋 The demo section will contain a watermark. If you decide to purchase the section, you will need to republish it to remove the watermark.';

  if(status == 'publish') {
    title = 'Publish Section'; 
    description = 'Select a Name for your section. The section will be accessible from any of your templates in the Shopify Theme customizer.';
  }

  // start text field
  const [name, setName] = useState(`🚀SP - ${sectionName}`);
  const [nameError, setNameError] = useState(``);
  const [isError, setIsError] = useState(false);

  const handleChange = useCallback(
    (value) => {
      setName(value)
      if(value == "") {
        setNameError("Name is required");
        setIsError(true);
      }
      else{
        setNameError("");
        setIsError(false);
      }
    },
    [],
  );

  // start select
  const [theme, setTheme] = useState(themes[0].id);

  const handleSelectChange = useCallback(
    (value) => setTheme(value),
    [],
  );

  let options = [];

  for(let x=0; x<themes.length; x++) {
    options.push({label: `${themes[x].name} (${themes[x].role})`, value: `${themes[x].id}`});
  }

  // handle publish
  const handlePublish = () => {
    setIsLoading(true);
    onPublish(theme, name, status);
  };

  // handle publish
  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal id="publish-modal" open={modalOpen}>

        <div class="app-modal-content">
            <p>{description}</p>
            <TextField
                label="Name"
                value={name}
                onChange={handleChange}
                error={nameError}
                autoComplete="off"
                />
            <div style={{marginTop: '20px'}}>
                    <Select
                        label="Theme"
                        options={options}
                        onChange={handleSelectChange}
                        value={theme}
                    
            /></div>
        </div>
        
        <TitleBar title={title}>
          <button loading={isLoading ? "" : undefined} disabled={isError} variant="primary" onClick={handlePublish}>Publish Section</button>
          <button onClick={handleCancel}>Cancel</button>
        </TitleBar>
      </Modal>
    </>
  );
}