import React, { useEffect, useState, useReducer, createContext } from 'react';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { TextButton } from '@strapi/design-system/TextButton';

import SeoChecks from '../SeoChecks';
import SocialPreview from './SocialPreview';
import PreviewChecks from './PreviewChecks';
import BrowserPreview from './BrowserPreview';

import Eye from '@strapi/icons/Eye';
import ArrowRight from '@strapi/icons/ArrowRight';

import { getAllChecks } from '../../utils/checks';

import { useIntl } from 'react-intl';
import { getTrad } from '../../../../utils';

import reducer from './reducer';

import { fetchConfig } from "../../../../utils/api";
import _ from 'lodash';

const initialState = {
  preview: true,
};

export const SeoCheckerContext = createContext(null);

const Summary = () => {
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [isBrowserPreviewVisible, setIsBrowserPreviewVisible] = useState(false);
  const [isSocialPreviewVisible, setIsSocialPreviewVisible] = useState(false);
  const [isSeoChecksVisible, setIsSeoChecksVisible] = useState(false);
  const [localChecks, setLocalChecks] = useState({});
  const [checks, dispatch] = useReducer(reducer, initialState);
  const { allLayoutData, layout, modifiedData } = useCMEditViewDataManager();

  const { contentType, components } = allLayoutData;
  const seo = _.get(modifiedData, 'seo', null);
  const hasSocials = _.has(seo, "metaSocial");
  const [config, setConfig] = useState({});
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    fetchConfig().then((data) => {
      setConfig(data);
      setIsLoadingConfig(false)
    });
    const fetchChecks = async () => {
      if (!(JSON.stringify(localChecks) === JSON.stringify(checks))) {
        if (checks?.preview) {
          const status = await getAllChecks(
            layout,
            modifiedData,
            components,
            contentType
          );
          dispatch({
            type: 'UPDATE_FOR_PREVIEW',
            value: status,
          });
        } else
          dispatch({
            type: 'UPDATE_FOR_PREVIEW',
            value: checks,
          });
        setLocalChecks(checks);
      }
    };

    fetchChecks().then(() => {
      setIsLoading(false);
    });
  }, [checks]);

  return (
    <SeoCheckerContext.Provider value={dispatch}>
      <Box>
        <Typography variant="sigma" textColor="neutral600" id="seo">
          {formatMessage({
            id: getTrad('Plugin.name'),
            defaultMessage: 'SEO Plugin',
          })}
        </Typography>
        <Box paddingTop={2} paddingBottom={6}>
          <Divider />
        </Box>
        <Box paddingTop={1}>
          <Button
            fullWidth
            variant="secondary"
            startIcon={<Eye />}
            onClick={() => setIsBrowserPreviewVisible((prev) => !prev)}
          >
            {formatMessage({
              id: getTrad('Button.browser-preview'),
              defaultMessage: 'Browser Preview',
            })}
          </Button>
        </Box>

        {hasSocials &&
        <Box paddingTop={2}>
          <Button
            fullWidth
            variant="secondary"
            startIcon={<Eye />}
            onClick={() => setIsSocialPreviewVisible((prev) => !prev)}
          >
            {formatMessage({
              id: getTrad('Button.social-preview'),
              defaultMessage: 'Social Preview',
            })}
          </Button>
        </Box>
        }

        {!isLoading && !isLoadingConfig && <PreviewChecks checks={checks} config={config} />}
        <Box paddingTop={4}>
          <TextButton
            startIcon={<ArrowRight />}
            onClick={() => setIsSeoChecksVisible((prev) => !prev)}
          >
            {formatMessage({
              id: getTrad('Button.see-details'),
              defaultMessage: 'SEE DETAILS',
            })}
          </TextButton>
        </Box>

        {isBrowserPreviewVisible && (
          <BrowserPreview
            modifiedData={modifiedData}
            setIsVisible={setIsBrowserPreviewVisible}
          />
        )}
        {hasSocials && isSocialPreviewVisible && (
          <SocialPreview
            modifiedData={modifiedData}
            setIsVisible={setIsSocialPreviewVisible}
          />
        )}
        {isSeoChecksVisible && !isLoadingConfig && (
          <SeoChecks
            modifiedData={modifiedData}
            components={components}
            contentType={contentType}
            checks={checks}
            setIsVisible={setIsSeoChecksVisible}
            config={config}
          />
        )}
      </Box>
    </SeoCheckerContext.Provider>
  );
};

export default Summary;
