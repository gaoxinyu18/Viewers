import { utils } from '@ohif/core';
import React from 'react';
import DicomTagBrowser from './components/DicomTagBrowser';

const { studyMetadataManager } = utils;

export default function getCommandsModule(servicesManager) {
  const actions = {
    openDICOMTagViewer({ viewports }) {
      const { activeViewportIndex, viewportSpecificData } = viewports;
      const activeViewportSpecificData =
        viewportSpecificData[activeViewportIndex];

      const {
        StudyInstanceUID,
        displaySetInstanceUID,
      } = activeViewportSpecificData;

      const studyMetadata = studyMetadataManager.get(StudyInstanceUID);
      const displaySets = studyMetadata.getDisplaySets();

      const { UIModalService } = servicesManager.services;

      const WrappedDicomTagBrowser = function() {
        return (
          <DicomTagBrowser
            displaySets={displaySets}
            activeDisplaySetInstanceUID={displaySetInstanceUID}
          />
        );
      };

      UIModalService.show({
        content: WrappedDicomTagBrowser,
        title: `DICOM Tag Browser`,
      });
    },
  };

  const definitions = {
    openDICOMTagViewer: {
      commandFn: actions.openDICOMTagViewer,
      storeContexts: ['servers', 'viewports'],
    },
  };

  return {
    actions,
    definitions,
  };
}
