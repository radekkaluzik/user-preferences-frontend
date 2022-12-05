import React from 'react';
import {
  Button,
  ButtonVariant,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Menu,
  MenuContent,
  MenuGroup,
  MenuInput,
  MenuItem,
  MenuList,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const renderEmptyState = (setSearch) => (
  <EmptyState variant={EmptyStateVariant.small} className="pf-u-mt-lg">
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h4" size="lg">
      No matching applications found
    </Title>
    <EmptyStateBody>Adjust you filters and try again.</EmptyStateBody>
    <Button variant={ButtonVariant.link} onClick={() => setSearch('')}>
      Clear filters
    </Button>
  </EmptyState>
);

const TabsMenu = ({ searchRef, search, setSearch, fields, onClick }) => (
  <Menu isPlain isScrollable>
    <MenuInput ref={searchRef} className="pf-u-mx-sm">
      <TextInput
        aria-label="Filter menu items"
        placeholder="Search applications"
        iconVariant="search"
        type="search"
        onChange={(value) => setSearch(value)}
        value={search}
      />
    </MenuInput>
    <Divider />
    <MenuContent id="notifications-menu-content">
      {fields.some((bundle) => bundle.fields.length > 0)
        ? fields.map(({ fields, title, name: bundleName }) =>
            fields.length > 0 ? (
              <MenuGroup
                label={title}
                className="pf-u-px-sm"
                key={`menu-group-${bundleName}`}
              >
                <MenuList>
                  {fields.map(({ label, name: sectionName }) => (
                    <MenuItem
                      onClick={(e) => onClick(e, bundleName, sectionName)}
                      key={`menu-item-${bundleName}-${sectionName}`}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuGroup>
            ) : null
          )
        : renderEmptyState(setSearch)}
    </MenuContent>
  </Menu>
);

TabsMenu.propTypes = {
  fields: PropTypes.array.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func,
  searchRef: PropTypes.object,
  onClick: PropTypes.func,
};

export default TabsMenu;
