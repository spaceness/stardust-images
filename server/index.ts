#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import fs from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";

const app = Fastify({
	logger: true,
});

app.get("/healthcheck", (_req, res) => res.send({ message: "Stardust Container Agent is running" }));
app.get("/password", async (_req, res) => res.send(process.env.VNCPASSWORD));
app.get("/screenshot", (_req, res) => {
	fs.mkdirSync(`${tmpdir()}/screenshots`, { recursive: true });
	const path = `${tmpdir()}/screenshots/window.png`;
	execSync(`DISPLAY=:1 import -window root ${path}`);
	const image = fs.readFileSync(path);
	fs.unlinkSync(path);
	res.header("Content-Type", "image/png").send(image);
});
app.get("/files/list", () => {
	fs.mkdirSync(`${homedir()}/Downloads`, { recursive: true });
	const files = fs.readdirSync(`${homedir()}/Downloads`);
	return files;
});
app.get("/files/download/:name", (req, res) => {
	const { name: fileName } = req.params as { name: string };
	if (!fileName) {
		console.log("No file name provided");
		return res.code(404).send({ error: "No file name provided" });
	}
	try {
		const file = fs.readFileSync(`${homedir()}/Downloads/${fileName}`);
		res.send(file);
	} catch (e) {
		console.log(e);
		res.code(404).send({ error: "File not found" });
	}
});
app.addContentTypeParser("*", (_request, payload, done) => done(null, payload));
app
	.put("/files/upload/:name", async (req, res) => {
		const { name: fileName } = req.params as { name: string };
		if (!fileName) {
			console.log("No file name provided");
			return res.code(404).send({ error: "No file name provided" });
		}

		try {
			fs.mkdirSync(`${homedir()}/Uploads`, { recursive: true });
			const fileStream = fs.createWriteStream(`${homedir()}/Uploads/${fileName}`);
			await new Promise<void>((resolve, reject) => {
				req.raw
					.on("data", (chunk) => {
						fileStream.write(chunk);
					})
					.on("end", () => {
						fileStream.end();
						resolve();
					})
					.on("error", (err) => {
						console.log(err);
						fileStream.end();
						fs.unlinkSync(`${homedir()}/Uploads/${fileName}`);
						reject(err);
					});
			});
			console.log(`File ${fileName} uploaded`);
			res.send({ success: true });
		} catch (e) {
			console.log(e);
			res.status(500).send({ error: "Upload failed" });
		}
	})
	.register(fastifyStatic, {
		root: path.join(import.meta.dirname, "static"),
	});
try {
	await app.listen({ port: 6080, host: "0.0.0.0" });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
