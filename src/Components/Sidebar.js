import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const SidebarOverlay = styled(Box)(({ open }) => ({
  display: open ? 'block' : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1099,
}));

const SidebarContainer = styled(Box)(({ open }) => ({
  width: 280,
  height: '100vh',
  background: '#f5f6f7',
  borderRight: '1px solid #e5e7eb',
  overflow: 'hidden',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1100,
  overflowY: 'auto',
  boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  transform: open ? 'translateX(0)' : 'translateX(-100%)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '3px',
  },
}));

const LogoSection = styled(Box)({
  padding: '24px 16px',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: '#ffffff',
});

const LogoText = styled(Typography)({
  fontSize: 24,
  fontWeight: 800,
  color: '#1b5e20',
  fontFamily: '"Arial Black", sans-serif',
  letterSpacing: '-0.5px',
  marginLeft: '8px',
});

const SectionLabel = styled(Typography)({
  fontSize: 12,
  fontWeight: 700,
  color: '#999',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '16px 16px 8px',
  marginTop: '12px',
});

const StyledListItem = styled(ListItem)(({ active }) => ({
  margin: '4px 8px',
  borderRadius: '8px',
  background: active ? '#e8f5e9' : 'transparent',
  color: active ? '#1b5e20' : '#666',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#f0f0f0',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: active ? '#1b5e20' : '#888',
  },
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
  },
}));

const SubListItem = styled(ListItem)(({ active }) => ({
  paddingLeft: '56px',
  fontSize: '14px',
  background: active ? '#e8f5e9' : 'transparent',
  color: active ? '#1b5e20' : '#666',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#f0f0f0',
  },
}));

const ToggleButton = styled(Box)(({ open }) => ({
  position: 'absolute',
  left: 16,
  top: 16,
  zIndex: open ? -1 : 10,
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: open ? 0 : 1,
  transition: 'opacity 0.3s ease, z-index 0.3s ease',
  '&:hover': {
    background: '#f5f5f5',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState({
    riders: true,
    vehicles: false,
    employers: false,
  });

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && open) {
        onToggle();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [open, onToggle]);

  // Handle outside click
  const handleOverlayClick = () => {
    onToggle();
  };

  return (
    <>
      {/* Toggle Button */}
      <ToggleButton open={open} onClick={onToggle}>
        <MenuIcon sx={{ fontSize: 20 }} />
      </ToggleButton>

      {/* Overlay */}
      <SidebarOverlay open={open} onClick={handleOverlayClick} />

      {/* Sidebar */}
      <SidebarContainer open={open} ref={sidebarRef}>
        {/* Logo Section */}
        <LogoSection>
          <LogoText>MUVNW</LogoText>
        </LogoSection>

        {/* Navigation */}
        <List sx={{ padding: '0' }}>
          {/* OVERVIEW Section */}
          <SectionLabel>Overview</SectionLabel>
          <StyledListItem
            button
            active={isActive('/dashboard')}
            onClick={() => handleNavigation('/dashboard')}
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </StyledListItem>

          {/* MANAGEMENT Section */}
          <SectionLabel>Management</SectionLabel>
          <StyledListItem
            button
            active={isActive('/portal-users')}
            onClick={() => handleNavigation('/portal-users')}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Portal Users" />
          </StyledListItem>

          {/* Riders with Submenu */}
          <StyledListItem
            button
            active={
              isActive('/RidersComponent') ||
              isActive('/riders/verification') ||
              isActive('/riders/engagement') ||
              isActive('/riders/lead') ||
              isActive('/riders/notifications')
            }
            onClick={() => toggleExpand('riders')}
          >
            <ListItemIcon>
              <TwoWheelerIcon />
            </ListItemIcon>
            <ListItemText primary="Riders" />
            {expandedItems.riders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </StyledListItem>
          <Collapse in={expandedItems.riders} timeout="auto" unmountOnExit>
            <SubListItem
              button
              active={isActive('/RidersComponent')}
              onClick={() => handleNavigation('/RidersComponent')}
            >
              <ListItemText primary="List" />
            </SubListItem>
            <SubListItem
              button
              active={isActive('/riders/verification')}
              onClick={() => handleNavigation('/riders/verification')}
            >
              <ListItemText primary="Verification" />
            </SubListItem>
            <SubListItem
              button
              active={isActive('/riders/engagement')}
              onClick={() => handleNavigation('/riders/engagement')}
            >
              <ListItemText primary="Engagement" />
            </SubListItem>
            <SubListItem
              button
              active={isActive('/riders/lead')}
              onClick={() => handleNavigation('/riders/lead')}
            >
              <ListItemText primary="Lead" />
            </SubListItem>
            <SubListItem
              button
              active={isActive('/riders/notifications')}
              onClick={() => handleNavigation('/riders/notifications')}
            >
              <ListItemText primary="Push Notifications" />
            </SubListItem>
          </Collapse>

          {/* Vehicles with Submenu */}
          <StyledListItem
            button
            active={isActive('/vehicles')}
            onClick={() => toggleExpand('vehicles')}
          >
            <ListItemIcon>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicles" />
            {expandedItems.vehicles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </StyledListItem>
          <Collapse in={expandedItems.vehicles} timeout="auto" unmountOnExit>
            <SubListItem
              button
              active={isActive('/vehicles/list')}
              onClick={() => handleNavigation('/vehicles/list')}
            >
              <ListItemText primary="List" />
            </SubListItem>
          </Collapse>

          {/* Employers with Submenu */}
          <StyledListItem
            button
            active={isActive('/employers')}
            onClick={() => toggleExpand('employers')}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Employers" />
            {expandedItems.employers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </StyledListItem>
          <Collapse in={expandedItems.employers} timeout="auto" unmountOnExit>
            <SubListItem
              button
              active={isActive('/employers/list')}
              onClick={() => handleNavigation('/employers/list')}
            >
              <ListItemText primary="List" />
            </SubListItem>
          </Collapse>

          {/* PAYMENT MANAGEMENT Section */}
          <SectionLabel>Payment Management</SectionLabel>
          <StyledListItem
            button
            active={isActive('/payment/summary')}
            onClick={() => handleNavigation('/payment/summary')}
          >
            <ListItemIcon>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Summary" />
          </StyledListItem>

          <StyledListItem
            button
            active={isActive('/payment/user')}
            onClick={() => handleNavigation('/payment/user')}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User" />
          </StyledListItem>

          <StyledListItem
            button
            active={isActive('/payment/vehicle')}
            onClick={() => handleNavigation('/payment/vehicle')}
          >
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle" />
          </StyledListItem>

          <StyledListItem
            button
            active={isActive('/payment/deposits')}
            onClick={() => handleNavigation('/payment/deposits')}
          >
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Deposits" />
          </StyledListItem>

          {/* GEOFENCE MANAGEMENT Section */}
          <SectionLabel>Geofence Management</SectionLabel>
          <StyledListItem
            button
            active={isActive('/geofence/zones')}
            onClick={() => handleNavigation('/geofence/zones')}
          >
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="Zones" />
          </StyledListItem>
        </List>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
