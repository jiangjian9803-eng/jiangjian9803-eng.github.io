import fs from "node:fs";
import path from "node:path";
import ClientExperience from "./client-experience";

function getPortfolioMarkup() {
  const html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
  const body = html.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>\s*<\/body>/i);
  if (!body) throw new Error("Unable to extract portfolio markup");
  return body[1];
}

export default function Home() {
  return <><div dangerouslySetInnerHTML={{ __html: getPortfolioMarkup() }} /><ClientExperience /></>;
}
