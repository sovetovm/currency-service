import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import jsonwebtoken from "jsonwebtoken";

import prisma from "./prisma";

const app = new Koa();
const router = new Router();
const secret = "your_secret_key";

app.use(bodyParser());
app.use(jwt({ secret }).unless({ path: [/^\/public/] }));

app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "Unauthorized";
    } else throw err;
  });
});

router.get("/public/token", (ctx) => {
  const token = jsonwebtoken.sign({ user: "test" }, secret, {
    expiresIn: "1h",
  });
  ctx.body = { token };
});

router.get("/currencies", async (ctx) => {
  const { page = 1, limit = 10 } = ctx.query;
  const currencies = await prisma.currency.findMany({
    skip: (+page - 1) * +limit,
    take: +limit,
  });
  ctx.body = currencies;
});

router.get("/currency/:id", async (ctx) => {
  const { id } = ctx.params;
  const currency = await prisma.currency.findFirst({ where: { id } });
  if (currency) ctx.body = currency;
  else {
    ctx.status = 404;
    ctx.body = { error: "Currency not found" };
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("Server is running on port 3000"));
