var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Demand App',
  description: 'Demand app for request orders',
  script: 'C:\\demand-app\\bin\\www',
  // execPath: 'C:\\Program Files\\nodejs',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=8096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();

// svc.on('uninstall',function(){
//   console.log('Uninstall complete.');
//   console.log('The service exists: ',svc.exists);
// });

// // Uninstall the service.
// svc.uninstall();