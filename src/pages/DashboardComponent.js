import ComingSoon from '../Components/FeatureCommingSoon';
import Sidebar from '../Components/Sidebar';
import { useState } from 'react';
import { Box } from '@mui/material';
const DashboardComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </Box>
      <ComingSoon />
    </div>
  );
};

export default DashboardComponent;
