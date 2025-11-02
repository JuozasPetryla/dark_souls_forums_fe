const mockUsers = [
  { id: 1, name: "Solaire of Astora", role: "Paladinas", status: "Prisijungęs" },
  { id: 2, name: "Siegmeyer of Catarina", role: "Karys", status: "Atsijungęs" },
  { id: 3, name: "Artorias the Abysswalker", role: "Riteris", status: "Prisijungęs" },
  { id: 4, name: "Gwynevere", role: "Dievybė", status: "Atsijungęs" },
];

export default function Users() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Naudotojų sąrašas</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Vardas</th>
              <th>Rolė</th>
              <th>Statusas</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <th>{user.id}</th>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "Prisijungęs"
                        ? "badge-success"
                        : "badge-neutral"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
