const linkPreviewGenerator = require("link-preview-generator");
const urlExists = require("url-exists");

async function linkPreview(link, io) {
  urlExists(link, async function(err, exists) {
    if (exists) {
      const preview = await linkPreviewGenerator(link).catch(console.error);
      if (preview) {
        io.emit("linkPreview", {
          link: link,
          title: preview.title,
          description: preview.description,
          domain: preview.domain,
          img: preview.img
        });
      }
    }
  });
}

async function messageToLink(link, io) {
  if (link.includes("</a>")) {
    let links = link.split('"');
    links = links.filter(
      link =>
        link.includes("http") && !link.includes("</a>") && !link.includes("<a")
    );
    linkPreview(links[0], io);
  }
}
// linkPreview(
//   `http:// <a href="http://youtube.com" >youtube.com</a> http:// <a href="http://youtube.com" >youtube.com</a>`,
//   0
// );

module.exports = {
  linkPreview,
  messageToLink
};
