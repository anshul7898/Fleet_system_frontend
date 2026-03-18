import { useState } from 'react';
import './RidersComponent.css';

const RidersComponent = () => {
  const [activeTab, setActiveTab] = useState('verified');
  const [searchType, setSearchType] = useState('Rider Name');
  const [searchQuery, setSearchQuery] = useState('');

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

  const stats = {
    unverified: 4,
    verified: 20,
    rejected: 0,
  };

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

  return (
    <div className="riders-container">
      {/* Header */}
      <div className="riders-header">
        <h1>Riders</h1>
        <div className="header-actions">
          <button className="invite-btn">+ Invite Rider</button>
          <button className="export-btn">📥 Export Verified</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button className="nav-link">Dashboard</button>
        <span className="separator">•</span>
        <button className="nav-link verification">Verification</button>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button
          className={`tab ${activeTab === 'unverified' ? 'active' : ''}`}
          onClick={() => setActiveTab('unverified')}
        >
          <span className="tab-label">Unverified</span>
          <span className="badge unverified">{stats.unverified}</span>
        </button>
        <button
          className={`tab ${activeTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveTab('verified')}
        >
          <span className="tab-label">Verified</span>
          <span className="badge verified">{stats.verified}</span>
        </button>
        <button
          className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <span className="tab-label">Rejected</span>
          <span className="badge rejected">{stats.rejected}</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-type">
          <label>Search Type</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-dropdown"
          >
            <option>--Select Type--</option>
            <option>Rider Name</option>
            <option>Mobile Number</option>
            <option>Email</option>
            <option>Username</option>
          </select>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search rider"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="riders-table">
          <thead>
            <tr>
              <th>Name & Email Id</th>
              <th>KYC Verified Date/Time</th>
              <th>Employer / ID</th>
              <th>Vehicle Model</th>
              <th>Deposit Status</th>
              <th>Rental Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider) => (
              <tr key={rider.id}>
                <td className="name-cell">
                  <div
                    className="rider-avatar"
                    style={{ backgroundColor: rider.bgColor }}
                  >
                    {rider.avatar}
                  </div>
                  <div className="rider-info">
                    <p className="rider-name">{rider.name}</p>
                    <p className="rider-phone">{rider.phone}</p>
                    <p className="rider-email">{rider.email}</p>
                  </div>
                </td>
                <td className="kyc-cell">{rider.kycDate}</td>
                <td className="employer-cell">
                  <span className="na-badge">{rider.employer}</span>
                  <span className="na-badge">{rider.employer}</span>
                </td>
                <td className="vehicle-cell">{rider.vehicleModel}</td>
                <td className="status-cell">
                  <span className="status-badge paid">
                    {rider.depositStatus}
                  </span>
                </td>
                <td className="status-cell">
                  <span className="status-badge paid">
                    {rider.rentalStatus}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="action-btn">KYC Docs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RidersComponent;
