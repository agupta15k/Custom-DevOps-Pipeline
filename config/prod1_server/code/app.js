const fs = require('fs');
const http = require('http');

const clientOptions = {
	hostname: '152.7.178.254',
	port: 8080,
	path: '/downloadArtifacts',
	method: 'GET'
};

const file = fs.createWriteStream('./artifacts.zip');

const req = http.request(clientOptions, (res) => {
	if (res.statusCode !== 200) {
		console.error(`Failed to fetch artifacts. Status code: ${res.statusCode}`);
		process.exit(1);
	}

	res.pipe(file).on('close', () => {
		console.log('Build artifacts extracted successfully.');
	});
});

req.on('error', (error) => {
	console.error(`Error fetching artifacts: ${error.message}`);
	process.exit(1);
});

req.end();
