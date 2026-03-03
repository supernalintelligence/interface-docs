const net = require('net');

function findAvailablePort(startPort = 3010, maxPort = 3020) {
  return new Promise((resolve, reject) => {
    function tryPort(port) {
      if (port > maxPort) {
        reject(new Error(`No available ports found between ${startPort} and ${maxPort}`));
        return;
      }
      
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          // Port is in use, try next one
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });
      
      server.once('listening', () => {
        const address = server.address();
        const foundPort = address && typeof address === 'object' ? address.port : port;
        server.close(() => {
          resolve(foundPort);
        });
      });
      
      server.listen(port);
    }
    
    tryPort(startPort);
  });
}

if (require.main === module) {
  findAvailablePort()
    .then(port => {
      console.log(port);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error finding port:', err.message);
      process.exit(1);
    });
}

module.exports = findAvailablePort;
