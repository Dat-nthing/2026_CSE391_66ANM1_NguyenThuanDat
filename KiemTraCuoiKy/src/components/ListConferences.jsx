import React from "react";

const ListConferences = ({ conferencesLoc, themHoiNghi }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Speakers</th>
          <th>Email</th>
          <th>Date</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {conferencesLoc.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.conferenceName}</td>
            <td>{item.speakers.join(', ')}</td>
            <td>{item.email}</td>
            <td>{new Date(item.date).toISOString().split('T')[0]}</td>
            <td>{item.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListConferences;