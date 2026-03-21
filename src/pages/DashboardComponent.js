import ComingSoon from '../Components/FeatureCommingSoon';
import Sidebar from '../Components/Sidebar';
import { useState } from 'react';
import { Box } from '@mui/material';

const DashboardComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <Box sx={{ p: 3, background: '#fafbfc', minHeight: '100vh' }}>
        <ComingSoon />
      </Box>
    </Box>
  );
};

export default DashboardComponent;
