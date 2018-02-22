import React, { Component } from 'react';
import NewMeetingDayBlock from './NewMeetingDayBlock';
import AdminManageBlock from './AdminManageBlock';

/* Component to render contents for admin manage page */
class AdminManagePage extends Component {
  render() {
    return (
      <div id="adminManagePage">
        <link rel="stylesheet" type="text/css" href="app/styles/admin_manage_style.css" />
        <h2>Admin Manage</h2>
        <AdminManageBlock render={() => <NewMeetingDayBlock />} title="Set Meeting Day" />
      </div>
    );
  }
}

export default AdminManagePage;
