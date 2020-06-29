export default function (data, _config) {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.position = "fixed";
  container.style.display = "flex";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.backgroundColor = "rgba(0,0,0,0.8)";

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.color = "white";
  closeButton.style.backgroundColor = "black";
  closeButton.style.border = "3px solid white";
  closeButton.style.borderRadius = "100%";
  closeButton.style.fontSize = "16px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.padding = "2px 6px 1px 6px";
  closeButton.style.position = "fixed";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";

  closeButton.onclick = () => {
    container.remove();
  };
  container.appendChild(closeButton);

  const video = document.createElement("video");
  video.width = _config.width;
  video.height = _config.height;
  video.style.display = "block";
  video.style.margin = "auto";

  video.loop = true;
  video.controls = true;
  var videoURL = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  video.src = videoURL;

  container.appendChild(video);
  document.querySelector("body").appendChild(container);
}
