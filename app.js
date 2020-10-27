const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const KoaRouter = require('koa-router')
const send = require('koa-send')
const path = require('path')

const app = new Koa()
const router = new KoaRouter()

// 后端文件下载方法
router.get('/download/:filename', async ctx => {
	let { filename } = ctx.params
	let filePath = `./static/file/${filename}`
	ctx.attachment(filePath)
	await send(ctx, filePath)
})
// 鉴权下载
router.get('/authDownload/:filename', async ctx => {
	let { filename } = ctx.params
	if (ctx.headers.authorization === '123456') {
		let filePath = `./static/file/${filename}`
		console.log('download', filePath)
		ctx.attachment(filePath)
		await send(ctx, filePath)
	} else {
		console.log('err authDownload')
		ctx.status = 403
		ctx.body = { errMsg: '你无权下载该文件！' }
	}
})

app.use(KoaStatic('./static'))
app.use(KoaBody())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, err => {
	console.log(err ? err.message : 'server run in port 3000!')
})