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

// No-data display
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

// Demo data split by status
const unverifiedRiders = [
  {
    id: 101,
    name: 'mukesh yadav',
    phone: '7007915966',
    email: 'mukesh1995yadavkumar@gmail.com',
    kycDate: '16 Mar 2026 12:33 pm',
    avatar: 'MY',
    bgColor: '#36B37E',
  },
  {
    id: 102,
    name: 'Suraj Bandiwadekar',
    phone: '9986523939',
    email: 'surajb6385@gmail.com',
    kycDate: '08 Mar 2026 10:24 am',
    avatar: 'SB',
    bgColor: '#FFB300',
  },
  {
    id: 103,
    name: 'Sourav Manna',
    phone: '8967151646',
    email: 'Gmr36544@gmail.com',
    kycDate: '06 Mar 2026 3:59 pm',
    avatar: 'SM',
    bgColor: '#FFB300',
  },
  {
    id: 104,
    name: 'Naveen C',
    phone: '9886344657',
    email: 'naveen@aktivolt.com',
    kycDate: '03 Mar 2026 11:43 am',
    avatar: 'NC',
    bgColor: '#36B37E',
  },
];

const verifiedRiders = [
  {
    id: 1,
    name: 'Steffan Tawaris',
    phone: '7715847687',
    email: 'steffantawaris29@gmail.com',
    kycDate: '16 Mar 2026 12:43 pm',
    employer: 'Energex',
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
    name: 'Umesh Chandrajoshi',
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
  // 5-50: Generated sample riders for demo
  ...Array.from({ length: 46 }, (_, i) => {
    const id = i + 5;
    const firstNames = [
      'Priya',
      'Ankit',
      'Sneha',
      'Rahul',
      'Meena',
      'Siddharth',
      'Aditya',
      'Vikram',
      'Anjali',
      'Harsha',
      'Jitesh',
      'Manish',
      'Varsha',
      'Kiran',
      'Tejas',
      'Divya',
      'Neha',
      'Surya',
      'Nikhil',
      'Suman',
      'Ira',
      'Kabir',
      'Alok',
      'Vikas',
      'Mitali',
      'Shreya',
      'Riya',
      'Vishal',
      'Kunal',
      'Aarti',
      'Tarun',
      'Mahesh',
      'Mehul',
      'Amol',
      'Ashish',
      'Diksha',
      'Gayatri',
      'Deepak',
      'Ruchi',
      'Mona',
      'Sarita',
      'Saumya',
      'Nisha',
      'Rohan',
      'Advait',
    ];
    const lastNames = [
      'Kumar',
      'Jain',
      'Gupta',
      'Patil',
      'Yadav',
      'Ghosh',
      'Joshi',
      'Singh',
      'Verma',
      'Sharma',
      'Rao',
      'Iyer',
      'Pillai',
      'Naik',
      'Das',
      'Reddy',
      'Shetty',
      'Goel',
      'Dubey',
      'Chowdhury',
      'Mehra',
      'Kapoor',
      'Bansal',
      'Kulkarni',
      'Pandey',
      'Chopra',
      'Dixit',
      'Desai',
      'Jhala',
      'Saxena',
      'Mishra',
      'Rawat',
      'Dubhashi',
      'Dey',
      'Cheema',
      'Grover',
      'Nagpal',
      'Shah',
      'Bhatia',
      'Bose',
      'Mehta',
      'Parikh',
      'Chatterjee',
      'Nigam',
    ];
    const fname = firstNames[i % firstNames.length];
    const lname = lastNames[i % lastNames.length];
    const name = `${fname} ${lname}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`;
    return {
      id,
      name,
      phone: `90000${1000 + id}`,
      email,
      kycDate: `${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')} Mar 2026 ${8 + (id % 12)}:${(10 + id) % 60} am`,
      employer: id % 5 === 0 ? 'Energex' : 'NA',
      vehicleModel: id % 2 === 0 ? 'AKX' : 'AKX_LS',
      depositStatus: id % 3 === 0 ? 'Pending' : 'Paid',
      rentalStatus: id % 2 === 0 ? 'Paid' : 'Pending',
      avatar: `${fname[0]}${lname[0]}`.toUpperCase(),
      bgColor: [
        '#F5A623',
        '#4CAF50',
        '#CCCCCC',
        '#30509B',
        '#36B37E',
        '#FFB300',
        '#AB47BC',
      ][id % 7],
    };
  }),
];

const rejectedRiders = []; // No rejected riders for demo.

const stats = {
  unverified: unverifiedRiders.length,
  verified: 20, // update to actual length if needed
  rejected: rejectedRiders.length,
};

const searchTypes = ['Rider Name', 'Mobile Number', 'Email', 'Username'];

const RidersComponent = () => {
  const [activeTab, setActiveTab] = useState('verified');
  const [searchType, setSearchType] = useState('Rider Name');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Simulate switching data by status
  let riderList = [];
  if (activeTab === 'unverified') riderList = unverifiedRiders;
  else if (activeTab === 'verified') riderList = verifiedRiders;
  else if (activeTab === 'rejected') riderList = rejectedRiders;

  const filterFn = (rider) => {
    if (searchType === 'Rider Name')
      return rider.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchType === 'Mobile Number')
      return rider.phone.includes(searchQuery);
    if (searchType === 'Email')
      return rider.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Tab Headings/Status
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

  // blank table columns for other statuses:
  const rejectedCols = [
    { label: 'Name & Email Id', minWidth: 240 },
    { label: 'KYC Verified Date/Time', minWidth: 140 },
    { label: 'Date of Rejection', minWidth: 140 },
    { label: 'Reason for Rejection', minWidth: 160 },
    { label: 'Re-uploaded Status', minWidth: 160 },
    { label: 'KYC Documents', minWidth: 120 },
  ];

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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                          <Box sx={{ fontSize: 56, mb: 2, color: '#e0e2e7' }}>
                            📄
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
                        {/* Fill in rejected structure for future */}
                        <TableCell>(data)</TableCell>
                        <TableCell>(data)</TableCell>
                        <TableCell>(data)</TableCell>
                        <TableCell>(data)</TableCell>
                        <TableCell>(data)</TableCell>
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
