import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Sidebar from '../Components/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Select,
  MenuItem,
  InputBase,
  Box,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import * as XLSX from 'xlsx';

// Styled avatar for table
const AvatarCircle = styled('div')(({ bgcolor }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 18,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  marginRight: 12,
  background: bgcolor,
}));

const OutlinedButton = styled(Button)({
  border: '1.5px solid #4caf50',
  color: '#4caf50',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
});

const NoDataBox = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafbfc',
  borderRadius: 18,
  padding: '60px 0',
  marginTop: 24,
  minHeight: 180,
  border: '1.5px dashed #f1f2f6',
});

const statusColors = [
  '#F5A623',
  '#4CAF50',
  '#CCCCCC',
  '#30509B',
  '#36B37E',
  '#FFB300',
  '#AB47BC',
];

const getAvatar = (firstName, lastName) => {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  return '?';
};

const searchTypes = ['Rider Name', 'Mobile Number', 'Email', 'Username'];

const ToggleButton = styled(Box)(({ open }) => ({
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  display: open ? 'none' : 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  width: 'fit-content',
  '&:hover': {
    background: '#f5f5f5',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const RidersComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('verified');
  const [searchType, setSearchType] = useState('Rider Name');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for fetched data
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch data from FastAPI
  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const resp = await fetch('http://localhost:8000/riders');
        const data = await resp.json();
        if (Array.isArray(data.riders)) {
          setRiders(data.riders);
        } else {
          setRiders([]);
        }
      } catch (err) {
        setFetchError('Could not load riders data');
        setRiders([]);
      }
      setLoading(false);
    };
    fetchRiders();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      sessionStorage.removeItem('isLoggedIn');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/', { replace: true });
    }
  };

  // Partition by status
  const getRiderStatus = (rider) => {
    if (rider.ReasonforRejection && rider.ReasonforRejection !== '')
      return 'rejected';
    if (rider.KYCVerifiedDateTime && rider.KYCVerifiedDateTime !== '')
      return 'verified';
    return 'unverified';
  };

  const verifiedRiders = riders
    .filter((rider) => getRiderStatus(rider) === 'verified')
    .map((rider, i) => ({
      ...rider,
      id: rider.RiderId || i,
      name: `${rider.FirstName} ${rider.LastName}`,
      phone: rider.MobileNumber,
      email: rider.Email,
      kycDate: rider.KYCVerifiedDateTime,
      employer: rider.Employer || 'NA',
      vehicleModel: rider.VehicleModel || '-',
      depositStatus: rider.DepositStatus || '-',
      rentalStatus: rider.RentalStatus || '-',
      avatar: getAvatar(rider.FirstName, rider.LastName),
      bgColor: statusColors[i % statusColors.length],
    }));

  const unverifiedRiders = riders
    .filter((rider) => getRiderStatus(rider) === 'unverified')
    .map((rider, i) => ({
      ...rider,
      id: rider.RiderId || i,
      name: `${rider.FirstName} ${rider.LastName}`,
      phone: rider.MobileNumber,
      email: rider.Email,
      kycDate: rider.KYCUploadedDateTime,
      avatar: getAvatar(rider.FirstName, rider.LastName),
      bgColor: statusColors[i % statusColors.length],
    }));

  const rejectedRiders = riders
    .filter((rider) => getRiderStatus(rider) === 'rejected')
    .map((rider, i) => ({
      ...rider,
      id: rider.RiderId || i,
      name: `${rider.FirstName} ${rider.LastName}`,
      phone: rider.MobileNumber,
      email: rider.Email,
      kycDate: rider.KYCVerifiedDateTime,
      dateOfRejection: rider.DateofRejection,
      reason: rider.ReasonforRejection,
      reuploadedStatus: rider.ReUploadedStatus,
      avatar: getAvatar(rider.FirstName, rider.LastName),
      bgColor: statusColors[i % statusColors.length],
      kycDoc: rider.KycDocuments,
    }));

  const stats = {
    unverified: unverifiedRiders.length,
    verified: verifiedRiders.length,
    rejected: rejectedRiders.length,
  };

  let riderList = [];
  if (activeTab === 'unverified') riderList = unverifiedRiders;
  else if (activeTab === 'verified') riderList = verifiedRiders;
  else if (activeTab === 'rejected') riderList = rejectedRiders;

  const filterFn = (rider) => {
    if (searchType === 'Rider Name')
      return rider.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchType === 'Mobile Number')
      return (rider.phone + '').includes(searchQuery);
    if (searchType === 'Email')
      return rider.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  };
  const filteredRiders = riderList.filter(filterFn);

  const paginatedRiders = filteredRiders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export function based on active tab
  const handleExport = async () => {
    setExporting(true);
    try {
      let exportData = [];
      let fileName = '';
      let sheetName = '';

      if (activeTab === 'verified') {
        exportData = verifiedRiders.map((rider) => ({
          Name: rider.name,
          Email: rider.email,
          Phone: rider.phone,
          'Verification Date': rider.kycDate,
          'Current Employer': rider.employer,
          'Vehicle Model': rider.vehicleModel,
          'Employer Name': 'N/A',
          'Employer ID': 'N/A',
        }));
        fileName = 'Riders_Verified.xlsx';
        sheetName = 'Verified Riders';
      } else if (activeTab === 'unverified') {
        exportData = unverifiedRiders.map((rider) => ({
          Name: rider.name,
          Email: rider.email,
          Phone: rider.phone,
          'Upload Date': rider.kycDate,
        }));
        fileName = 'Riders_Unverified.xlsx';
        sheetName = 'Unverified Riders';
      } else if (activeTab === 'rejected') {
        exportData = rejectedRiders.map((rider) => ({
          Name: rider.name,
          Email: rider.email,
          Phone: rider.phone,
          'KYC Verified Date': rider.kycDate,
          'Date of Rejection': rider.dateOfRejection,
          'Reason for Rejection': rider.reason,
          'Re-uploaded Status': rider.reuploadedStatus,
        }));
        fileName = 'Riders_Rejected.xlsx';
        sheetName = 'Rejected Riders';
      }

      // Create a new workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Set column widths based on tab
      let colWidths = [];
      if (activeTab === 'verified') {
        colWidths = [
          { wch: 20 }, // Name
          { wch: 30 }, // Email
          { wch: 15 }, // Phone
          { wch: 20 }, // Verification Date
          { wch: 18 }, // Current Employer
          { wch: 15 }, // Vehicle Model
          { wch: 15 }, // Employer Name
          { wch: 15 }, // Employer ID
        ];
      } else if (activeTab === 'unverified') {
        colWidths = [
          { wch: 20 }, // Name
          { wch: 30 }, // Email
          { wch: 15 }, // Phone
          { wch: 20 }, // Upload Date
        ];
      } else if (activeTab === 'rejected') {
        colWidths = [
          { wch: 20 }, // Name
          { wch: 30 }, // Email
          { wch: 15 }, // Phone
          { wch: 20 }, // KYC Verified Date
          { wch: 20 }, // Date of Rejection
          { wch: 30 }, // Reason for Rejection
          { wch: 20 }, // Re-uploaded Status
        ];
      }
      ws['!cols'] = colWidths;

      // Style header row
      const headerStyle = {
        font: { bold: true, color: 'FFFFFF', size: 12 },
        fill: { fgColor: { rgb: '4CAF50' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      // Apply header styling
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = headerStyle;
      }

      // Apply borders to data rows
      const dataStyle = {
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[address]) continue;
          ws[address].s = dataStyle;
        }
      }

      // Write the file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // Determine export button text and disabled state
  const getExportButtonLabel = () => {
    if (activeTab === 'verified') return '📥 Export Verified';
    if (activeTab === 'unverified') return '📥 Export Unverified';
    if (activeTab === 'rejected') return '📥 Export Rejected';
    return '📥 Export';
  };

  const isExportDisabled = () => {
    if (activeTab === 'verified') return verifiedRiders.length === 0;
    if (activeTab === 'unverified') return unverifiedRiders.length === 0;
    if (activeTab === 'rejected') return rejectedRiders.length === 0;
    return true;
  };

  const tabMeta = [
    {
      key: 'unverified',
      label: 'Unverified',
      color: 'warning',
      badge: stats.unverified,
    },
    {
      key: 'verified',
      label: 'Verified',
      color: 'success',
      badge: stats.verified,
    },
    {
      key: 'rejected',
      label: 'Rejected',
      color: 'error',
      badge: stats.rejected,
    },
  ];

  const rejectedCols = [
    { label: 'Name & Email Id', minWidth: 240 },
    { label: 'KYC Verified Date/Time', minWidth: 140 },
    { label: 'Date of Rejection', minWidth: 140 },
    { label: 'Reason for Rejection', minWidth: 160 },
    { label: 'Re-uploaded Status', minWidth: 160 },
    { label: 'KYC Documents', minWidth: 120 },
  ];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <Box sx={{ p: 3, background: '#fafbfc', minHeight: '100vh' }}>
        {/* Header with Toggle Button */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <ToggleButton
              open={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </ToggleButton>
            <Typography variant="h4" fontWeight={700}>
              Riders
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" color="primary">
              + Add Rider
            </Button>
            <Button variant="contained" color="primary">
              + Invite Rider
            </Button>
            <OutlinedButton
              onClick={handleExport}
              disabled={exporting || isExportDisabled()}
            >
              {exporting ? '⏳ Exporting...' : getExportButtonLabel()}
            </OutlinedButton>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              disabled={loggingOut}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              }}
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </Stack>
        </Stack>

        {/* Navigation Tabs */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {tabMeta.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'contained' : 'outlined'}
              color={tab.color}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(0);
              }}
              sx={{
                borderRadius: 8,
                minWidth: 120,
                fontWeight: activeTab === tab.key ? 700 : 500,
                background: activeTab === tab.key ? undefined : '#f6f7fa',
              }}
            >
              <span style={{ marginRight: 8, textTransform: 'capitalize' }}>
                {tab.label}
              </span>
              <span
                style={{
                  background: activeTab === tab.key ? '#fff' : '#ececec',
                  color:
                    activeTab === tab.key
                      ? tab.key === 'verified'
                        ? '#2e7d32'
                        : tab.key === 'unverified'
                          ? '#ff9800'
                          : '#d32f2f'
                      : '#888',
                  borderRadius: 12,
                  padding: '1px 10px',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {tab.badge}
              </span>
            </Button>
          ))}
        </Stack>

        {/* Search Section */}
        <Paper
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(44,62,80,0.04)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '270px',
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: '#6b7280',
                fontSize: '15px',
                pb: '7px',
                pl: '1px',
              }}
            >
              Search Type
            </Typography>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{
                background: '#fff',
                borderRadius: '12px',
                fontSize: '19px',
                height: '54px',
                boxShadow: '0 1px 4px rgba(44,62,80,0.04)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#a0aec0',
                },
              }}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">--Select Type--</MenuItem>
              {searchTypes.map((type) => (
                <MenuItem value={type} key={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <InputBase
            placeholder="Search rider"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              background: '#fff',
              borderRadius: '12px',
              px: 3,
              height: '54px',
              fontSize: '19px',
              border: '1.5px solid #e5e7eb',
              boxShadow: '0 1px 4px rgba(44,62,80,0.04)',
              color: '#6b7280',
              alignItems: 'center',
              display: 'flex',
              marginTop: '30px',
              marginRight: '10px',
            }}
            startAdornment={
              <Box sx={{ mr: 1.8, color: '#a0aec0', fontSize: 24 }}>
                <span role="img" aria-label="search">
                  🔍
                </span>
              </Box>
            }
          />
        </Paper>

        {/* Table Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress />
          </Box>
        ) : fetchError ? (
          <NoDataBox>
            <Typography variant="h6" sx={{ color: '#de4242', fontWeight: 500 }}>
              {fetchError}
            </Typography>
          </NoDataBox>
        ) : (
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                {activeTab === 'verified' && (
                  <>
                    <TableHead>
                      <TableRow sx={{ background: '#f3f7fa' }}>
                        <TableCell>Name & Email Id</TableCell>
                        <TableCell>KYC Verified Date/Time</TableCell>
                        <TableCell>Employer / ID</TableCell>
                        <TableCell>Vehicle Model</TableCell>
                        <TableCell>Deposit Status</TableCell>
                        <TableCell>Rental Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRiders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRiders.map((rider) => (
                          <TableRow
                            key={rider.id}
                            hover
                            sx={{ transition: 'background 0.2s' }}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <AvatarCircle bgcolor={rider.bgColor}>
                                  {rider.avatar}
                                </AvatarCircle>
                                <Box>
                                  <Typography fontWeight="bold">
                                    {rider.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#666' }}
                                  >
                                    {rider.phone}
                                  </Typography>
                                  <br />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#0077c2' }}
                                  >
                                    {rider.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{rider.kycDate}</TableCell>
                            <TableCell>
                              <Box
                                component="span"
                                sx={{
                                  background: '#f0eded',
                                  borderRadius: '6px',
                                  px: 1.2,
                                  py: 0.3,
                                  display: 'inline-block',
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {rider.employer ?? '-'}
                              </Box>
                            </TableCell>
                            <TableCell>{rider.vehicleModel ?? '-'}</TableCell>
                            <TableCell>
                              <Box
                                component="span"
                                sx={{
                                  bgcolor:
                                    rider.depositStatus === 'Paid'
                                      ? '#dcedc8'
                                      : '#ffe0b2',
                                  borderRadius: '5px',
                                  px: 1.4,
                                  py: 0.3,
                                  color:
                                    rider.depositStatus === 'Paid'
                                      ? '#43a047'
                                      : '#fc8a13',
                                  fontWeight: 600,
                                  fontSize: 13,
                                  display: 'inline-block',
                                }}
                              >
                                {rider.depositStatus ?? '-'}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                component="span"
                                sx={{
                                  bgcolor:
                                    rider.rentalStatus === 'Paid'
                                      ? '#dcedc8'
                                      : '#ffe0b2',
                                  borderRadius: '5px',
                                  px: 1.4,
                                  py: 0.3,
                                  color:
                                    rider.rentalStatus === 'Paid'
                                      ? '#43a047'
                                      : '#fc8a13',
                                  fontWeight: 600,
                                  fontSize: 13,
                                  display: 'inline-block',
                                }}
                              >
                                {rider.rentalStatus ?? '-'}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                sx={{
                                  borderRadius: 12,
                                  borderWidth: 1,
                                  textTransform: 'none',
                                }}
                              >
                                KYC Docs
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </>
                )}
                {activeTab === 'unverified' && (
                  <>
                    <TableHead>
                      <TableRow sx={{ background: '#f3f7fa' }}>
                        <TableCell>Name & Email Id</TableCell>
                        <TableCell>KYC Uploaded Date/Time</TableCell>
                        <TableCell>KYC Documents</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRiders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRiders.map((rider) => (
                          <TableRow
                            key={rider.id}
                            hover
                            sx={{
                              transition: 'background 0.2s',
                              borderBottom: '1px dashed #f1f2f6',
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <AvatarCircle bgcolor={rider.bgColor}>
                                  {rider.avatar}
                                </AvatarCircle>
                                <Box>
                                  <Typography
                                    fontWeight="bold"
                                    sx={{
                                      color: '#222',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {rider.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#818181' }}
                                  >
                                    {rider.phone}
                                  </Typography>
                                  <br />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#a0aec0' }}
                                  >
                                    {rider.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{rider.kycDate}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="success"
                                size="medium"
                                sx={{
                                  borderRadius: 12,
                                  borderColor: '#31a366',
                                  color: '#31a366',
                                  px: 3,
                                  fontWeight: 600,
                                  textTransform: 'none',
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </>
                )}
                {activeTab === 'rejected' && (
                  <>
                    <TableHead>
                      <TableRow sx={{ background: '#f3f7fa' }}>
                        {rejectedCols.map((c) => (
                          <TableCell
                            key={c.label}
                            style={c.minWidth ? { minWidth: c.minWidth } : {}}
                          >
                            {c.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRiders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={rejectedCols.length}
                            align="center"
                            style={{ padding: 0 }}
                          >
                            <NoDataBox>
                              <Box
                                sx={{ fontSize: 56, mb: 2, color: '#e0e2e7' }}
                              >
                                📋
                              </Box>
                              <Typography
                                variant="h6"
                                color="#b0bac9"
                                fontWeight={500}
                                sx={{ fontSize: 21, mt: 1 }}
                              >
                                No data
                              </Typography>
                            </NoDataBox>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRiders.map((rider) => (
                          <TableRow key={rider.id}>
                            <TableCell>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <AvatarCircle bgcolor={rider.bgColor}>
                                  {rider.avatar}
                                </AvatarCircle>
                                <Box>
                                  <Typography fontWeight="bold">
                                    {rider.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#818181' }}
                                  >
                                    {rider.phone}
                                  </Typography>
                                  <br />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#a0aec0' }}
                                  >
                                    {rider.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{rider.kycDate ?? '-'}</TableCell>
                            <TableCell>
                              {rider.dateOfRejection ?? '-'}
                            </TableCell>
                            <TableCell>{rider.reason ?? '-'}</TableCell>
                            <TableCell>
                              {rider.reuploadedStatus ?? '-'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="success"
                                size="medium"
                                sx={{
                                  borderRadius: 12,
                                  borderColor: '#31a366',
                                  color: '#31a366',
                                  px: 3,
                                  fontWeight: 600,
                                  textTransform: 'none',
                                }}
                                onClick={() => {
                                  if (rider.kycDoc)
                                    window.open(rider.kycDoc, '_blank');
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRiders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 15, 25]}
              sx={{
                '.MuiTablePagination-toolbar': { justifyContent: 'flex-end' },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                  { fontSize: 13 },
                '.MuiTablePagination-select': {
                  fontWeight: 'bold',
                  paddingLeft: 0,
                },
                marginRight: 3,
                background: '#f5faff',
              }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default RidersComponent;
