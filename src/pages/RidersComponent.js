import { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

const getRandomColor = () => {
  const colors = [
    '#F5A623',
    '#4CAF50',
    '#CCCCCC',
    '#30509B',
    '#FD5B5B',
    '#36B37E',
    '#FFB300',
    '#AB47BC',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateRiders = () => {
  const riders = [
    {
      id: 1,
      name: 'Steffan tawaris',
      phone: '7715847687',
      email: 'steffantawaris29@gmail.com',
      kycDate: '16 Mar 2026 12:43 pm',
      employer: 'NA',
      vehicleModel: 'AKX',
      depositStatus: 'Paid',
      rentalStatus: 'Paid',
      avatar: 'ST',
      bgColor: '#F5A623',
    },
    {
      id: 2,
      name: 'Chid Man',
      phone: '9791840454',
      email: 'chidambaram.m@enervoit.in',
      kycDate: '12 Mar 2026 3:48 pm',
      employer: 'NA',
      vehicleModel: 'AKX_LS',
      depositStatus: 'Paid',
      rentalStatus: 'Paid',
      avatar: 'CM',
      bgColor: '#4CAF50',
    },
    {
      id: 3,
      name: 'Umesh CHANDRAJOSHI',
      phone: '8755255474',
      email: 'joshiumesh343@gmail.com',
      kycDate: '10 Mar 2026 12:28 pm',
      employer: 'NA',
      vehicleModel: 'AKX',
      depositStatus: 'Paid',
      rentalStatus: 'Paid',
      avatar: 'UC',
      bgColor: '#CCCCCC',
    },
    {
      id: 4,
      name: 'Ashadur Rohman',
      phone: '7002843249',
      email: 'ashadrohman777@gmail.com',
      kycDate: '08 Mar 2026 11:30 am',
      employer: 'NA',
      vehicleModel: 'AKX',
      depositStatus: 'Paid',
      rentalStatus: 'Paid',
      avatar: 'AR',
      bgColor: '#4CAF50',
    },
  ];
  for (let i = 5; i <= 74; i++) {
    const firstName = `Demo${i}`;
    const lastName = `User${i}`;
    const name = `${firstName} ${lastName}`;
    riders.push({
      id: i,
      name,
      phone: `90000${1000 + i}`,
      email: `demo${i}@example.com`,
      kycDate: `${((i % 28) + 1).toString().padStart(2, '0')} Mar 2026 ${8 + (i % 10)}:${(10 + i) % 60} am`,
      employer: 'NA',
      vehicleModel: i % 2 === 0 ? 'AKX' : 'AKX_LS',
      depositStatus: i % 3 === 0 ? 'Paid' : 'Pending',
      rentalStatus: i % 2 === 0 ? 'Paid' : 'Pending',
      avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
      bgColor: getRandomColor(),
    });
  }
  return riders;
};

const stats = {
  unverified: 4,
  verified: 70,
  rejected: 0,
};

const searchTypes = ['Rider Name', 'Mobile Number', 'Email', 'Username'];

const RidersComponent = () => {
  const [activeTab, setActiveTab] = useState('verified');
  const [searchType, setSearchType] = useState('Rider Name');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const riders = generateRiders();

  const filteredRiders = riders.filter((rider) => {
    if (searchType === 'Rider Name') {
      return rider.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (searchType === 'Mobile Number') {
      return rider.phone.includes(searchQuery);
    }
    if (searchType === 'Email') {
      return rider.email.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Pagination logic
  const paginatedRiders = filteredRiders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // MUI handlers
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, background: '#fafbfc', minHeight: '100vh' }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={700}>
          Riders
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary">
            + Invite Rider
          </Button>
          <OutlinedButton>📥 Export Verified</OutlinedButton>
        </Stack>
      </Stack>

      {/* Navigation Tabs */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button variant="text" sx={{ fontWeight: 500, color: '#535353' }}>
          Dashboard
        </Button>
        <Typography sx={{ color: '#cecaca' }}>•</Typography>
        <Button
          variant="text"
          color="success"
          sx={{ fontWeight: 500, color: '#2e7d32' }}
        >
          Verification
        </Button>
      </Stack>

      {/* Status Tabs */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {['unverified', 'verified', 'rejected'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'contained' : 'outlined'}
            color={
              tab === 'unverified'
                ? 'warning'
                : tab === 'verified'
                  ? 'success'
                  : 'error'
            }
            onClick={() => setActiveTab(tab)}
            sx={{
              borderRadius: 8,
              minWidth: 120,
              fontWeight: activeTab === tab ? 700 : 500,
            }}
          >
            <span style={{ marginRight: 8, textTransform: 'capitalize' }}>
              {tab}
            </span>
            <span
              style={{
                background: activeTab === tab ? '#fff' : '#ececec',
                color:
                  activeTab === tab
                    ? tab === 'verified'
                      ? '#2e7d32'
                      : tab === 'unverified'
                        ? '#ff9800'
                        : '#d32f2f'
                    : '#888',
                borderRadius: 12,
                padding: '1px 10px',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {stats[tab]}
            </span>
          </Button>
        ))}
      </Stack>

      {/* Search Section - NOW FIXED AND MATCHING YOUR SCREENSHOT */}
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
        {/* Search type box */}
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
        {/* Search input, aligned & styled */}
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

      {/* Table and Pagination */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f3f7fa' }}>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#333', fontSize: 15 }}
                >
                  Name & Email Id
                </TableCell>
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AvatarCircle bgcolor={rider.bgColor}>
                          {rider.avatar}
                        </AvatarCircle>
                        <Box>
                          <Typography fontWeight="bold">
                            {rider.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
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
                        {rider.employer}
                      </Box>
                    </TableCell>
                    <TableCell>{rider.vehicleModel}</TableCell>
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
                        {rider.depositStatus}
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
                        {rider.rentalStatus}
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
    </Box>
  );
};

export default RidersComponent;
