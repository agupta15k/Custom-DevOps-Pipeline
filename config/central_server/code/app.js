const http = require('http');
const fs = require('fs');
const path = require('path');

const content_header = {
	'Content-Type': 'text/plain'
};

const server = http.createServer((req, res) => {
	if (req.method === 'POST' && req.url === '/uploadArtifacts') {
		let fileWriteStream = fs.createWriteStream('./artifacts.zip');
		req.pipe(fileWriteStream);
		fileWriteStream.on('finish', () => {
			res.writeHead(200, { content_header });
			res.end('File uploaded successfully');
		});
	} else if (req.method === 'GET' && req.url === '/downloadArtifacts') {
		const filePath = path.join(__dirname, './artifacts.zip');
		fs.access(filePath, fs.constants.F_OK, (err) => {
			if (err) {
				res.writeHead(404, { content_header });
				res.end('File not found');
			} else {
				const fileStream = fs.createReadStream(filePath);
				res.writeHead(200, {
					'Content-Type': 'application/zip',
					'Content-Disposition': 'attachment; filename="artifacts.zip"',
				});
				fileStream.pipe(res);
			}
		});
	} else {
		res.writeHead(404, { content_header });
		res.end('Not Found');
	}
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
