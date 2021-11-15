module.exports = {
  "name": "ready",
  listen(client) {
    const tag = client.user.tag;
    console.log(`${tag} is online!`)
  }
}
