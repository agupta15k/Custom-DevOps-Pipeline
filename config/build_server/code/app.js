const fs = require('fs');
const http = require('http');

const filePath = '../../../coffee-project/artifacts.zip';

const options = {
	hostname: '152.7.178.254',
	port: 8080,
	path: '/uploadArtifacts',
	method: 'POST',
	headers: {
		'Content-Type': 'application/zip',
	},
};

const req = http.request(options, (res) => {
	let data = '';

	res.on('data', (chunk) => {
		data += chunk;
	});

	res.on('end', () => {
		console.log(data);
	});
});

req.on('error', (error) => {
	console.error(error);
});

const fileStream = fs.createReadStream(filePath);
fileStream.pipe(req);
