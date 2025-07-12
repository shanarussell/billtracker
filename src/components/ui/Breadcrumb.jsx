import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbConfig = {
    '/dashboard': { label: 'Dashboard', parent: null },
    '/add-edit-bill': { label: 'Add Bill', parent: '/dashboard' },
    '/financial-summary': { label: 'Summary', parent: '/dashboard' }
  };

  const currentRoute = breadcrumbConfig[location.pathname];
  
  if (!currentRoute || location.pathname === '/dashboard') {
    return null;
  }

  const buildBreadcrumbPath = (pathname) => {
    const path = [];
    let current = breadcrumbConfig[pathname];
    
    while (current) {
      path.unshift({ pathname: Object.keys(breadcrumbConfig).find(key => breadcrumbConfig[key] === current), ...current });
      current = current.parent ? breadcrumbConfig[current.parent] : null;
    }
    
    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath(location.pathname);

  const handleBreadcrumbClick = (pathname) => {
    navigate(pathname);
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleBreadcrumbClick('/dashboard')}
        iconName="Home"
        iconSize={16}
        className="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
      />
      
      {breadcrumbPath.map((item, index) => (
        <React.Fragment key={item.pathname}>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          
          {index === breadcrumbPath.length - 1 ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(item.pathname)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;