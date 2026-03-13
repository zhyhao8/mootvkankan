const STORAGE_KEY = "mootv-videos";
const AUTH_KEY = "mootv-admin-auth";
const ADMIN = { username: "admin", password: "mootv123" };

const seedVideos = [
  {
    id: crypto.randomUUID(),
    title: "星际漫游：第一集",
    desc: "科幻冒险短片，带你探索未知星域。",
    url: "https://www.bilibili.com",
    thumb: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: crypto.randomUUID(),
    title: "城市夜色 Vlog",
    desc: "记录城市夜晚灯光与人文风景。",
    url: "https://www.youtube.com",
    thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60",
  },
];

function readVideos() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedVideos));
    return seedVideos;
  }
  try {
    return JSON.parse(data);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedVideos));
    return seedVideos;
  }
}

function saveVideos(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function renderHome() {
  const grid = document.getElementById("video-grid");
  const tpl = document.getElementById("video-card-template");
  if (!grid || !tpl) return;

  grid.innerHTML = "";
  const videos = readVideos();
  videos.forEach((video) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".thumb").src = video.thumb;
    node.querySelector(".title").textContent = video.title;
    node.querySelector(".desc").textContent = video.desc;
    const watchBtn = node.querySelector(".watch-btn");
    watchBtn.href = video.url;
    watchBtn.textContent = "立即观看";
    grid.appendChild(node);
  });
}

function setAuth(isAuthed) {
  localStorage.setItem(AUTH_KEY, isAuthed ? "1" : "0");
}

function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

function renderAdminList() {
  const list = document.getElementById("admin-video-list");
  if (!list) return;

  const videos = readVideos();
  list.innerHTML = "";
  videos.forEach((video) => {
    const item = document.createElement("li");
    const title = document.createElement("span");
    title.textContent = video.title;

    const delBtn = document.createElement("button");
    delBtn.className = "danger";
    delBtn.textContent = "删除";
    delBtn.addEventListener("click", () => {
      const next = readVideos().filter((v) => v.id !== video.id);
      saveVideos(next);
      renderAdminList();
    });

    item.append(title, delBtn);
    list.appendChild(item);
  });
}

function renderAdminState() {
  const loginPanel = document.getElementById("admin-login");
  const dashboard = document.getElementById("admin-dashboard");
  if (!loginPanel || !dashboard) return;

  if (isAuthed()) {
    loginPanel.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderAdminList();
  } else {
    loginPanel.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
}

function setupAdmin() {
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-msg");
  const videoForm = document.getElementById("video-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (!loginForm || !videoForm || !logoutBtn || !loginMsg) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === ADMIN.username && password === ADMIN.password) {
      setAuth(true);
      loginMsg.textContent = "登录成功";
      renderAdminState();
      return;
    }

    loginMsg.textContent = "用户名或密码错误";
  });

  videoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("video-title").value.trim();
    const desc = document.getElementById("video-desc").value.trim();
    const url = document.getElementById("video-url").value.trim();
    const thumb = document.getElementById("video-thumb").value.trim();

    const videos = readVideos();
    videos.unshift({ id: crypto.randomUUID(), title, desc, url, thumb });
    saveVideos(videos);
    videoForm.reset();
    renderAdminList();
  });

  logoutBtn.addEventListener("click", () => {
    setAuth(false);
    renderAdminState();
  });

  renderAdminState();
}

renderHome();
setupAdmin();
