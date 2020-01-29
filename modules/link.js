const linkPreviewGenerator = require("link-preview-generator");
async function linkPreview(message, io) {
  link = await messageToLink(message);
  if (link) {
    await linkPreviewGenerator(link).then(preview => {
      io.emit("linkPreview", {
        link: link,
        message: message,
        title: preview.title,
        description: preview.description,
        domain: preview.domain,
        img: preview.img
      });
    });
  }
}

function messageToLink(link) {
  if (link.includes("</a>")) {
    let links = link.split('"');
    links = links.filter(
      link =>
        link.includes("http") && !link.includes("</a>") && !link.includes("<a")
    );
    return links[0];
  } else {
    return false;
  }
}
// console.log(
//   link(
//     `http:// <a href="http://youtube.com" >youtube.com</a> http:// <a href="http://youtube.com" >youtube.com</a>`
//   )
// );

module.exports = {
  linkPreview
};
