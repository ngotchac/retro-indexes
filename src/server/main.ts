import next from "next";
import Pino from "pino";
import Koa from "koa";
import Router from "@koa/router";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== "production";

const logger = Pino();

async function main() {
	const app = next({ dev });
	const appRequestHandler = app.getRequestHandler();

	await app.prepare();

	const server = new Koa();
	const router = new Router();

	router.all("*", async (ctx) => {
		await appRequestHandler(ctx.req, ctx.res);
		ctx.respond = false;
	});

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const koaLogger = require("koa-pino-logger")();
	server.use(koaLogger);

	server.use(router.routes());

	server.listen(port, () => {
		logger.info(`> Ready on http://localhost:${port}`);
	});
}

main().catch((error) => {
	logger.error(error);
	process.exit(1);
});
