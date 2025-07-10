const odbc = require('odbc');

const connectionString = `
    Driver={ODBC Driver 18 for SQL Server};
    Server=tcp:im2-server.database.windows.net,1433;
    Database=IM2;
    Uid=rigene;
    Pwd=r1geneh@rvey;
    Encrypt=yes;
    TrustServerCertificate=no;
    Connection Timeout=30;
`;
async function connectToDB() {
  try {
    const connection = await odbc.connect(connectionString);
    const result = await connection.query('SELECT TOP 5 * FROM Suppliers');
    console.log(result);
    await connection.close();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

connectToDB();