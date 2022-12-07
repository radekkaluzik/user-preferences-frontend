import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Text, Title } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { getNavFromURL, setNavToURL } from './urlSync';
import TabsMenu from './TabsMenu';
import config from '../../config/config.json';

const renderPageHeading = (bundleTitle, sectionTitle) => (
  <React.Fragment>
    <Title headingLevel="h3" size="xl" className="pf-u-pb-xs">
      {`${sectionTitle} | ${bundleTitle}`}
    </Title>
    <Text className="pf-u-mb-xl">
      Configure your {sectionTitle} notifications.
    </Text>
  </React.Fragment>
);

const FormTabs = ({ fields, titleRef }) => {
  const history = useHistory();
  const formOptions = useFormApi();
  const searchRef = useRef(null);
  const navConfig = useRef({});

  const [search, setSearch] = useState('');
  const [filteredFields, setFilteredFields] = useState(fields);

  const handleResize = () => {
    const container = document.getElementById('notifications-container');
    const gridElement = document.getElementById('notifications-grid');
    const menu = document.getElementById('notifications-menu-content');
    gridElement.style.height = `${container.getBoundingClientRect().height}px`;
    menu.style.maxHeight = `${
      container.getBoundingClientRect().height -
      titleRef.current.getBoundingClientRect().height -
      searchRef.current.getBoundingClientRect().height -
      1
    }px`;
  };

  useEffect(() => {
    if (window.screen.width > 768) {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    navConfig.current = getNavFromURL(history, fields, {
      bundle: fields?.[0]?.name,
      app: fields?.[0]?.fields?.[0]?.name,
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = fields.reduce(
      (acc, bundle) => [
        ...acc,
        {
          ...bundle,
          fields: bundle.fields.filter((item) => {
            const searchValue = search.toLowerCase();
            return (
              item.name?.toLowerCase().includes(searchValue) ||
              item.title?.toLowerCase().includes(searchValue)
            );
          }, []),
        },
      ],
      []
    );
    setFilteredFields(filtered);
  }, [search]);

  return (
    <React.Fragment>
      <div className="pref-notifications--nav">
        <TabsMenu
          searchRef={searchRef}
          search={search}
          setSearch={setSearch}
          fields={filteredFields}
          onClick={(e, bundleName, sectionName) => {
            e.preventDefault();
            navConfig.current = {
              bundle: bundleName,
              app: sectionName,
            };
            setNavToURL(history, navConfig.current);
          }}
        />
      </div>
      <div className="pref-notifications--inputs">
        <React.Fragment>
          {renderPageHeading(
            config['notification-preference'][navConfig.current.bundle]?.title,
            fields
              .reduce((acc, curr) => [...acc, ...curr.fields], [])
              .filter(
                (item) =>
                  item.name === navConfig.current.app &&
                  item.bundle === navConfig.current.bundle
              )?.[0]?.label
          )}
          <div>
            {formOptions.renderForm(
              fields.reduce(
                (acc, curr) => [
                  ...acc,
                  ...curr.fields.map((item) => ({
                    ...item,
                    key: `form-${item.bundle}-${item.name}`,
                    fields: [
                      item.fields.map((input) => ({
                        ...input,
                        hideField: !(
                          item.name === navConfig.current.app &&
                          item.bundle === navConfig.current.bundle
                        ),
                      })),
                    ],
                  })),
                ],
                []
              ),
              formOptions
            )}
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};

FormTabs.propTypes = {
  fields: PropTypes.array.isRequired,
  dataType: PropTypes.any,
  validate: PropTypes.any,
  component: PropTypes.any,
  titleRef: PropTypes.any,
};

export default React.memo(FormTabs);
