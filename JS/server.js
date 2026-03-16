const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "JSON", "characters.json");
console.log("Arquivo de personagens:", DATA_FILE);


const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readCharacters() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeCharacters(characters) {
  await fs.writeFile(DATA_FILE, JSON.stringify(characters, null, 2));
}

async function handleApi(req, res) {
  if (req.url === "/api/characters" && req.method === "GET") {
    try {
      const characters = await readCharacters();
      return sendJson(res, 200, characters);
    } catch {
      return sendJson(res, 500, { error: "Falha ao ler personagens." });
    }
  }

  if (req.url === "/api/characters" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { name, universe, image, story } = JSON.parse(body || "{}");

        if (!name || !universe || !image || !story) {
          return sendJson(res, 400, { error: "Dados incompletos." });
        }

        const newCharacter = {
          name: String(name).trim(),
          universe: String(universe).trim(),
          image: String(image).trim(),
          story: String(story).trim()
        };

        const characters = await readCharacters();
        characters.push(newCharacter);
        await writeCharacters(characters);

        return sendJson(res, 201, newCharacter);
      } catch {
        return sendJson(res, 500, { error: "Falha ao salvar personagem." });
      }
    });

    return;
  }

  return sendJson(res, 404, { error: "Rota não encontrada." });
}

async function handleStatic(req, res) {
  const reqPath = req.url === "/" ? "/index.html" : req.url;
  const normalizedPath = path.normalize(reqPath).replace(/^\.+/, "");
  const filePath = path.join(ROOT, normalizedPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Acesso negado");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      res.writeHead(404);
      res.end("Não encontrado");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const content = await fs.readFile(filePath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Não encontrado");
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    await handleApi(req, res);
    return;
  }

  await handleStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Servidor do Hall da Fama em http://localhost:${PORT}`);
});
