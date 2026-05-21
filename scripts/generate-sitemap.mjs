import fs from "fs"
import path from "path"

const domain = "https://www.bi2bconsultoria.com.br"
// Pages on the main domain
const pages = [
  "/",
  "/sobre",
  "/servicos",
  "/ferramentas",
  "/contato",
  "/obrigado",
]

// If the campaign uses the abrirminhaempresa subdomain, include its root URL here.
// Sitemaps may include URLs from different subdomains, but it's common to host a
// separate sitemap on the subdomain. We include the subdomain root to help
// search engines discover it when hosted at abrirminhaempresa.bi2bconsultoria.com.br
const includeSubdomain = true
const subdomainHost = "https://www.abrirminhaempresa.bi2bconsultoria.com.br"

const mainUrls = pages.map(
  (p) =>
    `  <url>\n    <loc>${domain}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
)

const extraUrls = includeSubdomain
  ? [
      `  <url>\n    <loc>${subdomainHost}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    ]
  : []

const urls = [...mainUrls, ...extraUrls].join("\n")

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

// Ensure output dir exists (dist) and write file
const outPath = path.join(process.cwd(), "dist")
if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true })
fs.writeFileSync(path.join(outPath, "sitemap.xml"), xml)

// Also write a copy to project root (useful for some hosting setups)
fs.writeFileSync(path.join(process.cwd(), "sitemap.xml"), xml)
