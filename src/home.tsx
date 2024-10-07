import React, { useEffect, useState } from 'react';

export function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {        
        window.electronAPI.getData().then((result) => {
            console.log(result);
            
          setUsers(result);
        }).catch((err) => {
          console.error(err);
        });
      } else {
        console.error("electronAPI n'est pas défini");
      }
  }, []);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}